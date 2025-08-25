"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import FaturaCard, { Fatura } from "./cardFatura";
import FaturaDetalhes from "./FaturaDetalhes";
import PixBoleto from "./PixBoleto";

export default function ListaFatura() {
  const [faturaAberta, setFaturaAberta] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"boleto" | "pix">("boleto");

  const { data: documentos = [], isLoading, error } = useQuery<DocumentoType[]>({
    queryKey: ["documentos"],
    queryFn: async () => {
      const res = await fetch("/api/documentos");
      const data = await res.json();
      // Caso a API retorne { documentos: [...] }
      return data?.documentos ?? data ?? [];
    },
    refetchInterval: 10000,
  });


  if (isLoading) return <p className="text-center text-gray-500">Carregando faturas...</p>;
  if (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return <p className="text-center text-red-500">Erro ao carregar faturas: {message}</p>;
  }
  if (faturas.length === 0) return <p className="text-center text-gray-500">Nenhuma fatura encontrada.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {faturas.map((fatura) => (
        <div key={fatura.id} className="bg-gray-50 rounded-xl shadow-sm overflow-hidden transition hover:shadow-md">
          <FaturaCard
            fatura={fatura}
            onExibir={() =>
              setFaturaAberta(faturaAberta === fatura.id ? null : fatura.id)
            }
          />
            {/* <FaturaPagamento fatura={fatura} /> */}
          {faturaAberta === fatura.id && (
            <div className="mt-2 p-4 border-t border-gray-200 rounded-b-xl bg-white transition">
              {/* Abas */}
              <div className="flex gap-2 mb-4">
                <button
                  className={`px-4 py-1 rounded-md font-medium ${
                    abaAtiva === "boleto"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setAbaAtiva("boleto")}
                >
                  Boleto
                </button>
                <button
                  className={`px-4 py-1 rounded-md font-medium ${
                    abaAtiva === "pix"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setAbaAtiva("pix")}
                >
                  Pix
                </button>
              </div>

              {/* Conteúdo da aba */}
              {abaAtiva === "boleto" ? (
                <FaturaDetalhes
                  fatura={fatura}
                  codigoBarras="23793.38128 60003.123456 00100.000012 1 72540000012500"
                  descricao="Mensalidade referente a setembro/2025"
                />
              ) : (
                <PixBoleto
                  fatura={fatura}
                  chavePix="12345678900"
                  descricao="Pagamento via Pix - Mensalidade setembro/2025"
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
