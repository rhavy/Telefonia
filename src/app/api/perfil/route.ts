// /app/api/perfil/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
function formatarCPF(cpf?: string | null): string {
  if (!cpf) return "";
  const apenasNumeros = cpf.replace(/\D/g, "");
  if (apenasNumeros.length !== 11) return cpf;
  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDataBrasileira(data?: string | Date | null): string {
  if (!data) return "";

  const d = new Date(data);

  // Corrige para pegar a data UTC "pura"
  const dia = d.getUTCDate().toString().padStart(2, "0");
  const mes = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const ano = d.getUTCFullYear();

  return `${dia}/${mes}/${ano}`;
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { ok: false, error: "Não autenticado" },
        { status: 401 }
      );
    }

    const perfil = await prisma.perfil.findFirst({
      where: { userId: session.user.id },
    });

    if (!perfil) {
      return NextResponse.json(
        { ok: false, error: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    const genero =
      perfil.genero === "MASCULINO"
        ? "Masculino"
        : perfil.genero === "FEMININO"
        ? "Feminino"
        : "Não informado";

    const perfilFormatado = {
      ...perfil,
      cpf: formatarCPF(perfil.cpf),
      genero,
      nascimento: formatDataBrasileira(perfil.nascimento),
    };

    return NextResponse.json({ ok: true, data: perfilFormatado });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();
    if(!body){
      return NextResponse.json({ ok: false, error: "Campo não pode ser Vazio" }, { status: 401 });
    }

    // Busca Perfil ativo do usuário
    const existente = await prisma.perfil.findFirst({
      where: { userId: session.user.id, },
    });

    let perfilAtualizado;
    if (body.nascimento) {
        body.nascimento = new Date(body.nascimento);
      }
    if (existente) {
      perfilAtualizado = await prisma.perfil.update({
        where: { id: existente.id },
        data: body,
      });
    } else {
      perfilAtualizado = await prisma.perfil.create({
        data: { userId: session.user.id, ativo: true, ...body },
      });
    }

    return NextResponse.json({ ok: true, data: perfilAtualizado });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}