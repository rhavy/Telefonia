import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajuste para seu path
import crypto from "crypto";

export async function POST(req: Request) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ error: "Número é obrigatório" }, { status: 400 });
  }

  // Gera código aleatório de 6 dígitos
  const code = crypto.randomInt(100000, 999999).toString();

  // Salva no banco (tabela VerificationCode)
  await prisma.verificationCode.upsert({
    where: { phone },
    update: { code, createdAt: new Date() },
    create: { phone, code, createdAt: new Date() },
  });

  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: `Seu código de verificação é: ${code}` },
        }),
      }
    );

    return NextResponse.json({ success: true, message: "Código enviado" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao enviar código" }, { status: 500 });
  }
}
