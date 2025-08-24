import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { headers } from "next/headers";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const url = new URL(req.url);
    const descricaoQuery = url.searchParams.get("descricao");

    const fatura = await prisma.fatura.findUnique({ where: { id } });
    if (!fatura) {
      return NextResponse.json({ error: "Fatura não encontrada" }, { status: 404 });
    }
    const perfil = await prisma.perfil.findFirst({ where: { userId: session.user.id } });
    const endereco = await prisma.endereco.findFirst({ where: { userId: session.user.id } });
    const contrato = await prisma.contrato.findFirst({ where: { id: fatura.contratoId } });
    const plano = contrato ? await prisma.plano.findFirst({ where: { id: contrato.planoId } }) : null;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = 595;
    const margin = 50;
    const padding = 10;
    const valorFormatado = (fatura.valor / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const vencimento = new Date(fatura.vencimento).toLocaleDateString("pt-BR");

    // Cabeçalho
    page.drawRectangle({ x: 0, y: 780, width: pageWidth, height: 60, color: rgb(0, 0.4, 0.7) });
    page.drawText("Operadora Telêfonia S.A.", { x: 30, y: 800, size: 20, font, color: rgb(1, 1, 1) });
    page.drawText("CNPJ: 00.000.000/0001-00", { x: 30, y: 785, size: 10, font, color: rgb(1, 1, 1) });
    page.drawText(`Fatura - ${vencimento.split("/")[1]}/${vencimento.split("/")[2]}`, { x: 450, y: 800, size: 14, font, color: rgb(1, 1, 1) });

    // Dados do cliente
    page.drawText(`Assinante: ${session.user.name ?? "Cliente"}`, { x: margin, y: 750, size: 12, font });
    page.drawText(`CPF/CNPJ: ${perfil?.cpf ?? "000.000.000-00"}`, { x: margin, y: 735, size: 12, font });
    page.drawText(`Nº da conta: ${fatura.id}`, { x: margin + 250, y: 750, size: 12, font });
    page.drawText(`Endereço: ${endereco?.logradouro ?? "Rua Exemplo"}, ${endereco?.numero ?? "123"}`, { x: margin, y: 720, size: 10, font });
    page.drawText(`${endereco?.bairro ?? "Centro"} - ${endereco?.cidade ?? "Cidade"}/${endereco?.estado ?? "ES"} CEP: ${endereco?.cep ?? "29 000-000"}`, { x: margin, y: 705, size: 10, font });

    // Resumo da fatura
    const resumoY = 640;
    const resumoHeight = 60;
    page.drawRectangle({ x: margin, y: resumoY, width: pageWidth - 2 * margin, height: resumoHeight, color: rgb(1, 1, 1), borderColor: rgb(0, 0, 0), borderWidth: 1 });
    page.drawText(`Valor Total: ${valorFormatado}`, { x: margin + padding, y: resumoY + resumoHeight - 15, size: 14, font, color: rgb(0.8, 0, 0) });
    page.drawText(`Vencimento: ${vencimento}`, { x: margin + 250, y: resumoY + resumoHeight - 15, size: 14, font });
    page.drawText("Evite a suspensão. Pague até o vencimento.", { x: margin + padding, y: resumoY + resumoHeight - 30, size: 10, font });

    // Dados do Plano
    const planoY = 580;
    const planoHeight = 60;
    page.drawRectangle({ x: margin, y: planoY, width: pageWidth - 2 * margin, height: planoHeight, color: rgb(1, 1, 1), borderColor: rgb(0, 0, 0), borderWidth: 1 });
    page.drawText("Dados do Plano:", { x: margin + padding, y: planoY + planoHeight - 15, size: 12, font });
    page.drawText(`Plano: ${plano?.nome ?? "Plano Controle 15GB"}`, { x: margin + padding, y: planoY + planoHeight - 30, size: 10, font });
    page.drawText(`Mensalidade: ${plano?.valor ? (plano.valor / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "R$ 79,90"}`, { x: margin + padding, y: planoY + planoHeight - 45, size: 10, font });

    // Resumo de consumo
    const consumoY = 510;
    const consumoHeight = 60;
    page.drawRectangle({ x: margin, y: consumoY, width: pageWidth - 2 * margin, height: consumoHeight, color: rgb(1, 1, 1), borderColor: rgb(0, 0, 0), borderWidth: 1 });
    page.drawText("Resumo de Consumo", { x: margin + padding, y: consumoY + consumoHeight - 15, size: 12, font });
    page.drawText("Ligações Locais: 120 min", { x: margin + padding, y: consumoY + consumoHeight - 30, size: 10, font });
    page.drawText("Internet: 4.5 GB", { x: margin + 160, y: consumoY + consumoHeight - 30, size: 10, font });
    page.drawText("SMS: 50 mensagens", { x: margin + 320, y: consumoY + consumoHeight - 30, size: 10, font });

    // Mensagem / descrição
    const mensagemY = 470;
    const mensagemHeight = 40;
    page.drawRectangle({ x: margin, y: mensagemY, width: pageWidth - 2 * margin, height: mensagemHeight, color: rgb(1, 1, 1), borderColor: rgb(0, 0, 0), borderWidth: 1 });
    page.drawText("Mensagens:", { x: margin + padding, y: mensagemY + mensagemHeight - 15, size: 12, font });
    page.drawText(descricaoQuery ?? "Pagamento em débito automático garante pontualidade.", { x: margin + padding, y: mensagemY + mensagemHeight - 30, size: 10, font });

    // Linha digitável
    const barcodeY = 350;
    const barcodeHeight = 40;
    page.drawRectangle({ x: margin, y: barcodeY, width: pageWidth - 2 * margin, height: barcodeHeight, color: rgb(0.95, 0.95, 0.95), borderColor: rgb(0, 0, 0), borderWidth: 1 });
    page.drawText("Linha Digitável: 23793.38128 60003.123456 00100.000012 1 72540000012500", { x: margin + padding, y: barcodeY + 15, size: 10, font });

    // Rodapé
    page.drawText("Documento gerado eletronicamente - não é necessária assinatura.", { x: 140, y: 290, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
    page.drawText("SAC: 0800 000 0000  |  Ouvidoria: 0800 111 2222", { x: 140, y: 275, size: 9, font, color: rgb(0.4, 0.4, 0.4) });

    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=fatura-${vencimento}.pdf`
      }
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao gerar PDF" }, { status: 500 });
  }
}
