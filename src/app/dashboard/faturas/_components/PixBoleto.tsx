"use client";

import { useState } from "react";
import { PixCanvas } from "react-qrcode-pix";
import { ClipboardCopy, Check } from "lucide-react";
import { Fatura } from "./cardFatura";
import { useFaturaTraducoes } from "@/utils/translateClient";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { PerfilProps } from "@/types/api";
import { PagamentoComPix } from "./PagamentoComPix";

type PixBoletoProps = {
  fatura: Fatura;
  chavePix: string;
  descricao?: string;
};

export default function PixBoleto({ fatura, chavePix, descricao }: PixBoletoProps) {
  const [copiado, setCopiado] = useState(false);
  const { data: perfil } = useQuery({
      queryKey: ["perfil"],
      queryFn: () => fetcher<PerfilProps>("/api/perfil"),
      refetchInterval: 10000,
    });
  const { tabBoletoFatura, contratoFatura, vencimentoFatura, valorFatura, chavePixFatura, valorCalculoLocalFatura, valorCalculoFatura, tituloPixFatura, carregandoPixFatura } = useFaturaTraducoes();
  
  const valorFormatado = (fatura.valor / 100).toLocaleString(valorCalculoLocalFatura, {
    style: "currency",
    currency: valorCalculoFatura,
  });

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const vencimentoFormatado = new Date(fatura.vencimento).toLocaleDateString(valorCalculoLocalFatura);

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center border-b border-gray-300">
        <h2 className="text-lg font-bold">{tabBoletoFatura} Pix</h2>
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            fatura.pago
              ? "bg-green-100 text-green-800"
              : new Date(fatura.vencimento) < new Date()
              ? "bg-red-100 text-red-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {fatura.pago
            ? "Pago"
            : new Date(fatura.vencimento) < new Date()
            ? "Atrasado"
            : "Em aberto"}
        </span>
      </div>

      {/* Informações da fatura */}
      <div className="px-4 py-3 text-sm space-y-1">
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
        <div className="flex justify-between font-semibold">
          <span>{valorFatura}:</span>
          <span>{valorFormatado}</span>
        </div>
        {descricao && <p className="text-gray-600">{descricao}</p>}
      </div>

      {/* Linha pontilhada */}
      <div className="border-t border-dashed border-gray-300 my-3"></div>

      {/* QR Code Pix */}
      <div className="flex flex-col items-center px-4 py-3">
        {/* <PixCanvas
        //   pixkey={chavePix}
        //   merchant={perfil?.name ?? "User"}
        //   city={"Sao Paulo"}
        //   amount={fatura.valor / 100}
        //   onLoad={() => {}}
        // /> */}
        <PagamentoComPix titulo={tituloPixFatura} carregamento={carregandoPixFatura} amount={fatura.valor / 100} chavePix={chavePix} city={"Vitoria"} nome={perfil?.name ?? "User"} />
        <div className="flex items-center justify-between w-full mt-2 text-sm">
          <span>{chavePixFatura}:</span>
          <span className="font-mono">{chavePix}</span>
        </div>
        <button
          onClick={copiarPix}
          className="flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
        >
          {copiado ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
          {copiado ? "Copiado!" : "Copiar Chave Pix"}
        </button>
      </div>
    </div>
  );
}
