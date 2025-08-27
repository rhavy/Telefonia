"use client"
import { Fatura } from "./cardFatura";
import DownloadBoleto from "./DownloadBoleto";
import { useFaturaTraducoes } from "@/utils/translateClient";

type FaturaBoletoProps = {
  fatura: Fatura;
  descricao?: string;
  codigoBarras?: string;
};
  export default function FaturaBoleto({
  fatura,
  descricao,
  codigoBarras,
}: FaturaBoletoProps) {
  const { tabBoletoFatura, valorCalculoLocalFatura, valorCalculoFatura, contratoFatura, vencimentoFatura, valorFatura, valorDescricaoFatura, codigobarrasFatura, situacaoAbertoFatura, situacaoAtrasadaFatura } = useFaturaTraducoes();
  const vencimento = new Date(fatura.vencimento);
  const vencimentoFormatado = vencimento.toLocaleDateString(`${valorCalculoLocalFatura}`, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const valorFormatado = (fatura.valor / 100).toLocaleString(`${valorCalculoLocalFatura}`, {
    style: "currency",
    currency: `${valorCalculoFatura}`,
  });

  const hoje = new Date();
  const atrasada = !fatura.pago && vencimento < hoje;
  const status = fatura.pago ? "Pago" : atrasada ? `${situacaoAtrasadaFatura}` : `${situacaoAbertoFatura}`;

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b border-gray-300">
        <h2 className="text-lg font-bold">{tabBoletoFatura}</h2>
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            status === "Pago"
              ? "bg-green-100 text-green-800"
              : status === "Em aberto"
              ? "bg-orange-100 text-orange-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Informações principais */}
      <div className="px-4 py-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>ID:</span>
          <span>{fatura.id}</span>
        </div>
        <div className="flex justify-between">
          <span>{contratoFatura}:</span>
          <span>{fatura.contratoId}</span>
        </div>
        <div className="flex justify-between">
          <span>{vencimentoFatura}:</span>
          <span>{vencimentoFormatado}</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>{valorFatura}:</span>
          <span>{valorFormatado}</span>
        </div>
        {descricao && (
          <div>
            <span>{valorDescricaoFatura}:</span>
            <p className="text-gray-600">{descricao}</p>
          </div>
        )}
      </div>

      {/* Linha pontilhada */}
      <div className="border-t border-dashed border-gray-300 my-2"></div>

      {/* Código de barras */}
      {codigoBarras && (
        <div className="px-4 py-2 flex flex-col items-center">
          <p className="text-xs text-gray-500 mb-2">{codigobarrasFatura}</p>
          <div className="bg-black h-10 w-full relative">
            <span className="absolute inset-0 flex justify-center items-center text-white text-xs">
              {codigoBarras}
            </span>
          </div>
        </div>
      )}

     {/* <PixBoleto chavePix="" fatura={fatura} descricao=""/> */}
     
      {/* Botão baixar */}
      <div className="px-4 py-3 border-t border-gray-300 flex justify-end">
        <DownloadBoleto faturaId={fatura.id} visualizar={true}/>
      </div>
    </div>
  );
}
