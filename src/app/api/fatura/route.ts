import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Fatura = {
  id: string;
  contratoId: string;
  valor: number;
  vencimento: string | Date;
  pago: boolean;
};

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const contrato = await prisma.contrato.findFirst({
      where: { userId: session.user.id },
    });

    if (!contrato) {
      return NextResponse.json({ error: "Nenhum contrato encontrado" }, { status: 404 });
    }

    const faturas= await prisma.fatura.findMany({
      where: { contratoId: contrato.id },
      orderBy: { vencimento: "asc" },
    });

    return NextResponse.json(faturas);
  } catch (error) {
    console.error("Erro ao buscar faturas:", error);
    return NextResponse.json({ error: "Erro interno ao buscar faturas" }, { status: 500 });
  }
}
