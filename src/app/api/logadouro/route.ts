// /app/api/perfil/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    const logadouro = await prisma.endereco.findFirst({
      where: { userId: session.user.id },
    });

    if (!logadouro) {
      return NextResponse.json(
        { ok: false, error: "Endereço não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: logadouro });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    if(!body){
      return NextResponse.json({ ok: false, error: "Campo não pode ser Vazio" }, { status: 401 });
    }

    // Busca endereço ativo do usuário
    const existente = await prisma.endereco.findFirst({
      where: { userId: session.user.id, ativo: true },
    });

    let enderecoAtualizado;

    if (existente) {
      enderecoAtualizado = await prisma.endereco.update({
        where: { id: existente.id },
        data: body,
      });
    } else {
      enderecoAtualizado = await prisma.endereco.create({
        data: { userId: session.user.id, ativo: true, ...body },
      });
    }

    return NextResponse.json({ ok: true, data: enderecoAtualizado });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
