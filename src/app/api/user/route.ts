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

    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: user});
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

    // Busca User ativo do usuário
    const existente = await prisma.user.findFirst({
      where: { id: session.user.id, },
    });

    let userAtualizado;

    if (existente) {
      userAtualizado = await prisma.user.update({
        where: { id: existente.id },
        data: body,
      });
    } else {
      userAtualizado = await prisma.user.create({
        data: { userId: session.user.id, ativo: true, ...body },
      });
    }

    return NextResponse.json({ ok: true, data: userAtualizado });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}