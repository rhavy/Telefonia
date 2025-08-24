import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { phone, code } = await req.json();

  if (!phone || !code) {
    return NextResponse.json({ error: "Número e código obrigatórios" }, { status: 400 });
  }

  const record = await prisma.verificationCode.findUnique({
    where: { phone },
  });

  if (!record || record.code !== code) {
    return NextResponse.json({ error: "Código inválido!" }, { status: 400 });
  }

  // Se válido → pode vincular ao usuário logado (Better Auth) ou criar usuário novo
  await prisma.verificationCode.delete({ where: { phone } });

  return NextResponse.json({ success: true, message: "Telefone validado com sucesso!" });
}
