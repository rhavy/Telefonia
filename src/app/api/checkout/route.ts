import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ajuste conforme sua estrutura
import { isUnder18 } from "@/utils/format";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cpf = searchParams.get("cpf");
    const email = searchParams.get("email");
    const nasc = searchParams.get("nasc");

    if (!cpf || !email || !nasc) {
      return NextResponse.json(
        { error: "CPF, email e data de nascimento são obrigatórios." },
        { status: 422 }
      );
    }

    if (isUnder18(nasc)) {
      return NextResponse.json(
        { error: "Você deve ter pelo menos 18 anos." },
        { status: 422 }
      );
    }

    const emailExistente = await prisma.user.findFirst({
      where: { email: email.trim().toLocaleLowerCase() },
    });

    const cpfExistente = await prisma.perfil.findFirst({
      where: { cpf: cpf.trim() },
    });

    if (emailExistente && cpfExistente) {
      return NextResponse.json(
        { error: "Já existe um cliente com este e-mail e CPF." },
        { status: 409 }
      );
    }

    if (emailExistente) {
      return NextResponse.json(
        { error: "Este e-mail já está em uso." },
        { status: 409 }
      );
    }

    if (cpfExistente) {
      return NextResponse.json(
        { error: "Este CPF já está cadastrado." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Dados verificados com sucesso. Nenhum conflito encontrado." },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Erro API Checkout:", err);
    return NextResponse.json(
      { error: "Erro interno ao verificar cliente." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, ...dados } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do cliente é obrigatório." }, { status: 400 });
    }

    const perfilAtualizado = await prisma.perfil.create({
      data: {
        userId: id,
        cpf: dados.cpf,
        genero: dados.genero,
        nascimento: new Date(dados.nasc),        
      },
    });

    if (!perfilAtualizado) {
      return NextResponse.json({ error: "Erro ao Criar perfil do cliente." }, { status: 500 });
    }
    const enderecoAtualizado = await prisma.endereco.create({
      data: {
        userId: id,
        cep: dados.cep,
        logradouro: dados.logradouro,
        numero: dados.numero,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.cidade,
        estado: dados.estado,
        pais: dados.pais,
        ativo: true,
      },
    });

    if (!enderecoAtualizado) {
      return NextResponse.json({ error: "Erro ao Criar Endereço do cliente." }, { status: 500 });
    }

    return NextResponse.json(perfilAtualizado, { status: 200 });
  } catch (err) {
    console.error("❌ Erro ao atualizar cliente:", err);
    return NextResponse.json({ error: "Erro interno ao atualizar cliente." }, { status: 500 });
  }
}

