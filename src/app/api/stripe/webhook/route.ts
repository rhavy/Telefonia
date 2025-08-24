import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { addMonths } from "date-fns";

export const runtime = "nodejs"; // Stripe precisa do Node runtime, não Edge

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  // 1️⃣ Validar webhook com body raw
  let payload: string;
  try {
    payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    console.log("⚡ Evento Stripe recebido:", event.type);
  } catch (err) {
    console.error("❌ Falha ao autenticar webhook:", err);
    return new NextResponse(`Webhook Error`, { status: 400 });
  }

  // 2️⃣ Tratar eventos
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("📦 Checkout Session:", session);

      const paymentIntentId = session.payment_intent as string;
      if (!paymentIntentId) {
        console.error("❌ Nenhum payment_intent encontrado na session");
        break;
      }

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log("💳 PaymentIntent:", paymentIntent.id);
        console.log("🎯 Metadata recebida:", paymentIntent.metadata);

        // 3️⃣ Recuperar dados do metadata
        const clienteName       = paymentIntent.metadata?.clienteName ?? null;
        const clienteId         = paymentIntent.metadata?.clienteId ?? null;
        const assinaturaPeriodo = paymentIntent.metadata?.assinaturaPeriodo ?? "MENSAL";
        const assinaturaForma   = paymentIntent.metadata?.assinaturaForma ?? "PIX";
        const contratoValor     = paymentIntent.metadata?.contratoValor ?? "0";
        const contratoId        = paymentIntent.metadata?.contratoId ?? null;

        if (!contratoId) {
          console.error("❌ contratoId não foi enviado no metadata");
          break;
        }

        // 4️⃣ Calcular vencimento da fatura
        const hoje = new Date();
        const fimContrato = assinaturaPeriodo === "ANUAL"
          ? addMonths(hoje, 12)
          : addMonths(hoje, 1);

        // 5️⃣ Criar fatura com pagamento
        let fatura;
        try {
          fatura = await prisma.fatura.create({
            data: {
              contratoId: contratoId,
              valor: Number(contratoValor),
              vencimento: fimContrato,
              pago: true,
              pagamento: {
                create: {
                  dataPagamento: new Date(),
                  metodo: assinaturaForma.toUpperCase() as "CARTAO" | "BOLETO" | "PIX",
                },
              },
            },
            include: { pagamento: true },
          });
          console.log("✅ Fatura criada:", fatura);
        } catch (err) {
          console.error("❌ Erro Prisma (fatura.create):", err);
          return new NextResponse(`Erro ao criar fatura`, { status: 500 });
        }

        // 6️⃣ Ativar contrato
        try {
          const updateContrato = await prisma.contrato.update({
            where: { id: contratoId },
            data: { ativo: true },
          });
          console.log("✅ Contrato ativado:", updateContrato.id);
        } catch (err) {
          console.error("❌ Erro Prisma (contrato.update):", err);
          return new NextResponse(`Erro ao ativar contrato`, { status: 500 });
        }
      } catch (err) {
        console.error("❌ Erro ao processar pagamento:", err);
        return new NextResponse(`Erro ao processar pagamento`, { status: 500 });
      }

      break;
    }

    default:
      console.log("Evento não tratado:", event.type);
      break;
  }

  return NextResponse.json({ ok: true });
}
