import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash, verify } from "argon2";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
          headers: await headers(),
        });
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json();
  const { senhaAtual, novaSenha } = body;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.password || !(await verify(user.password, senhaAtual))) {
    return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
  }

  const novaHash = await hash(novaSenha);

  await prisma.user.update({ where: { id: user.id }, data: { password: novaHash } });
  await prisma.historicoSenha.create({ data: { userId: user.id, hash: novaHash } });

  return NextResponse.json({ ok: true, message: "Senha alterada com sucesso!" });
}
