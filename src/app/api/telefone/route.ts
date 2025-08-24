// /app/api/perfil/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
    }

    const telefones = await prisma.telefone.findMany({
      where: { userId: session.user.id, ativo: true },
    });

    return NextResponse.json({ ok: true, data: telefones });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
export async function POST(req: Request) {
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

    const body = await req.json();
    const { numero, tipo } = body;

    if (!numero || !tipo) {
      return NextResponse.json(
        { ok: false, error: "Número e tipo do telefone são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar novo telefone ativo
    const telefone = await prisma.telefone.create({
      data: {
        numero,
        tipo,
        ativo: true,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ ok: true, data: telefone });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}