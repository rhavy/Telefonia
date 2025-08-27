import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
        headers: await headers(),
      });
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const preferencias = await prisma.preferencia.findMany({ where: { userId: session.user.id } });
  return NextResponse.json({ ok: true, data: preferencias });
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { tipo, valor } = body;

    if (!tipo || valor === undefined) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
    }

    const pref = await prisma.preferencia.upsert({
      where: { id: `${session.user.id}-${tipo}` },
      update: { valor, updatedAt: new Date() },
      create: {
        id: `${session.user.id}-${tipo}`,
        tipo,
        valor,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, data: pref });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
