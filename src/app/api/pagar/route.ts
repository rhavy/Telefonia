import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Better Auth
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
          headers: await headers(),
        });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { faturaId, metodo } = body; // metodo = "pix" | "boleto"

    // Buscar fatura no banco
    const fatura = await prisma.fatura.findUnique({
      where: { id: faturaId },
    });
    if (!fatura) {
      return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 });
    }

    // Criar PaymentIntent no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: fatura.valor, // em centavos
      currency: "brl",
      payment_method_types: [metodo], 
      receipt_email: session.user.email!,
      metadata: { faturaId: fatura.id, userId: session.user.id },
    });

    return NextResponse.json(paymentIntent);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
