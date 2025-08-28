
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; 
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Busca contrato do usuário, já incluindo plano e benefícios
    const contrato = await prisma.contrato.findFirst({
      where: { userId: session.user.id, ativo: true },
      include: {
        plano: {
          include: {
            beneficios: true, // todos os benefícios do plano
          },
        },
        faturas: {
          include: {
            pagamento: true, // se quiser incluir pagamentos também
          },
        },
      },
    });

    if (!contrato) {
      return NextResponse.json(
        { ok: false, error: "Nenhum contrato encontrado" },
        { status: 404 }
      );
    }

    const plano = await prisma.plano.findFirst({
        where: { ativo: true },
        include:{
          beneficios: true
        }
      });

    if (!plano) {
      return NextResponse.json(
        { ok: false, error: "Nenhum contrato encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: contrato,
      plano
    });
  } catch (error) {
    console.error("Erro ao buscar contrato e plano:", error);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao buscar dados" },
      { status: 500 }
    );
  }
}

