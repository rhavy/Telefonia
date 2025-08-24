'use server'

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { isValidCEP, sanitizeName } from "@/utils/format";
import { addYears, addMonths } from "date-fns";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { identity } from "lodash";


// Define a interface para os benefícios de um plano
interface Beneficio {
  id: string;
  descricao: string;
}

// Define a interface para um plano com seus benefícios
interface PlanoComBeneficios {
  id:          string;
  nome:        string;
  precoMensal: number;
  precoAnual:  number;
  desconto:    number;
  descricao:   string;
  internet:    string;
  atendimento: string;
  chamadas:    string;
  seguranca:   string;
  suporte:     string;
  beneficios:  Beneficio[];
}

// Define a interface para a resposta da API de planos
interface ResponseData {
  data: PlanoComBeneficios[];
}

export async function CreateAssinar({ idCliente, name, periodo, pagamento, valor, plano }: {
   idCliente: string; 
   name: string; 
   periodo: "ANUAL" | "MENSAL"; pagamento: string; 
   valor: number; 
   plano: string;
  }) {
  try {

    // Busca os planos disponíveis na API
    const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api/plano`;
    const response = await fetch(url, { cache: "no-store" });
    const json = (await response.json()) as ResponseData;

    if (!response.ok || !json.data) {
      return { error: "Erro ao buscar os planos no servidor!" };
    }

    // Encontra o plano selecionado pelo cliente
    const planoSelecionado = json.data.find(
      (p) => sanitizeName(p.nome) === sanitizeName(plano)
    );

    if (!planoSelecionado) {
      return { error: "Nenhum plano foi selecionado." };
    }

    // Cria um novo contrato para o cliente
    const contrato = await prisma.contrato.create({
      data: {
        userId: idCliente,
        planoId: planoSelecionado.id,
        tipo: periodo === "ANUAL" ? "ANUAL" : "MENSAL",
        inicio: new Date(),
        fim: periodo === "ANUAL" ? addYears(new Date(), 1) : addMonths(new Date(), 1),
        ativo: false, // O contrato inicia como inativo até a confirmação do pagamento
      },
    });

    if (!contrato?.id) {
      return { error: "Falha ao criar o contrato." };
    } 
    // const fatura = await prisma.fatura.create({
    //   data: {
    //     valor: valor,
    //     vencimento: periodo === "ANUAL" ? addYears(new Date(), 1) : addMonths(new Date(), 1),
    //     contratoId: contrato.id,
    //     pago: false, // A fatura inicia como não paga
    //     },
    // });

    // if (!fatura?.id) {
    //   return { error: "Falha ao criar o contrato." };
    // } 

    // Cria uma sessão de pagamento no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.HOST_URL}/dashboard?status=success`,
      cancel_url: `${process.env.HOST_URL}/dashboard`,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Contrato ${name}`,
              description: `Contrato criado em ${new Date().toLocaleDateString()}`,
            },
            unit_amount: valor, // O valor deve ser em centavos
          },
          quantity: 1,
        }
      ],
      payment_intent_data: {
        metadata: {
          clienteName: name,
          clienteId: idCliente,
          assinaturaPeriodo: periodo,
          assinaturaForma: pagamento,
          contratoValor: valor, 
          contratoId: contrato.id 
        }
      }
    });

    // Retorna o ID da sessão de pagamento
    return { sessionId: session.id };

  } catch (err) {
    console.error("Erro ao criar assinatura:", err);
    return {
      error: "Falha no processo de cadastro do cliente! Por favor, tente novamente mais tarde.",
    };
  }
}
