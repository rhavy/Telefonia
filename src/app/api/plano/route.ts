import { auth } from "@/lib/authBanco";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET() {
  try {
    const planos = await prisma.plano.findMany({
    where: { ativo: true },
    // orderBy: { nome: "desc" },
    include: {
      beneficios: {
        where: { ativo: true },    
        orderBy: { descricao: "asc" },
        select: {
          id: true,
          descricao: true,
        },
      },
    },
  });


    return NextResponse.json({ data: planos });
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao buscar planos!" },
      { status: 400 }
    );
  }
});
