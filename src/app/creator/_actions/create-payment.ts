'use server'

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { z } from "zod"

const createPaymentSchema = z.object({
    slug: z.string().min(1, "Slug do Criador é obrigatório!"),
    name: z.string().min(1, "O nome precisa ter no mínimo 1 caractere!"),
    message: z.string().min(4, "A mensagem precisa ter no mínimo 4 caracteres."),
    price: z.number().min(1500, "Selecione um valor maior que R$ 15,00."),
    creatorId: z.string().min(1, "ID do Criador é obrigatório!"),
})

type CreatePaymentData = z.infer<typeof createPaymentSchema>

export async function CreatePayment(data: CreatePaymentData) {
    const schema = createPaymentSchema.safeParse(data);

    if(!schema.success){
        return { error: schema.error.issues[0].message }
    }

    try {
        const creator = await prisma.user.findFirst({
            where:{ connectedStripeAccountId: data.creatorId, }
        })

        if(!creator){
            return { error: "Criador não encontrado ou não possui uma conta de pagamento conectada." }
        }
        
        const applicationFeeAmount = Math.floor(data.price * 0.1)

        const donation = await prisma.donation.create({
            data:{
                donorName: data.name,
                donorMessage: data.message,
                userId: creator.id,
                status: "PENDING",
                amount: (data.price - applicationFeeAmount),
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",success_url: `${process.env.HOST_URL}/creator/${data.slug}?status=success`,
            cancel_url: `${process.env.HOST_URL}/creator/${data.slug}`,
            line_items: [
                {
                    price_data:{
                        currency: "brl",
                        product_data:{
                            name: "Apoiar "+ creator.name,
                            description: data.message,
                        },
                        unit_amount: data.price,                        
                    },
                    quantity:1,
                }
            ],
            payment_intent_data: {
                application_fee_amount: applicationFeeAmount,
                transfer_data:{
                    destination: creator.connectedStripeAccountId as string,
                },
                metadata:{
                    donorName: data.name,
                    donorMessage: data.message,
                    donationId: donation.id
                }
            }
        })
        return { sessionId: session.id, }
    } catch (err) {
        console.error("Falha ao criar a sessão de pagamento do Stripe:", err);
        return { error: "Falha no Pagamento! Por favor, tente novamente mais tarde." }        
    }
}