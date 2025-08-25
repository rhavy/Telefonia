import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { headers } from "next/headers";

// GET documentos do usuário logado
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Usuário não autenticado" }, { status: 401 });
    }

    const documentos = await prisma.documento.findMany({
        where: { userId: session.user.id },
        select: { id: true, nome: true, url: true, status: true, tipo: true, userId: true } // retorna tipo
    });

    if (!documentos) {
      return NextResponse.json({ ok: false, error: "Nenhum documentos encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: documentos });
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    return NextResponse.json({ ok: false, error: "Erro interno ao buscar documentos" }, { status: 500 });
  }
}

// POST upload de documento
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const docId = formData.get("docId") as string | null;

    if (!file || !docId) {
      return NextResponse.json({ error: "Arquivo ou docId faltando" }, { status: 400 });
    }

    // Permitir apenas PDF ou imagens
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 });
    }

    // Criar diretório se não existir
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${docId}_${Date.now()}.${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);

    // Salvar no servidor
    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    const fileUrl = `/uploads/${fileName}`;

    // 🔑 Garantir que tipo = docId e userId sejam únicos
    const documento = await prisma.documento.upsert({
      where: {
        tipo_userId: {
          tipo: docId as "RG" |"CPF"| "RESIDENCIA",
          userId: session.user.id,
        },
      },
      update: {
        url: fileUrl,
        status: "PENDENTE",
      },
      create: {
        nome: file.name,
        url: fileUrl,
        status: "PENDENTE",
        tipo: docId as "RG" |"CPF"| "RESIDENCIA", // aqui usamos o tipo.id (RG, CPF, etc.)
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Upload realizado com sucesso",
      documento,
      url: fileUrl,
    });
  } catch (err) {
    console.error("Erro no upload:", err);
    return NextResponse.json({ error: "Erro ao processar arquivo" }, { status: 500 });
  }
}




