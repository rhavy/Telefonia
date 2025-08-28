"use client";

import { useQuery } from "@tanstack/react-query";
import Footer from "@/components/template/footer";
import AssinaturaAtual from "./_components/AssinaturaAtual";
import PlanosDisponiveis from "./_components/PlanosDisponiveis";
import { useAssinaturaTraducoes } from "@/utils/translateClient";

// Tipagens
export type Beneficio = {
  id: string;
  descricao: string;
};

export type Plano = {
  id: string;
  nome: string;
  precoMensal: number; 
  precoAnual: number; 
  beneficios: string[];
};

export type Fatura = {
  id: string;
  valor: number;
  vencimento: string;
  pago: boolean;
  pagamento: any | null;
};

export type Contrato = {
  id: string;
  userId: string;
  planoId: string;
  tipo: string;
  inicio: string;
  ativo: boolean;
  plano: Plano;
  faturas: Fatura[];
};

export type ApiResponseContrato = {
  data: Contrato;
  tipo:"MENSAL" | "ANUAL";
};

export interface PlanoComBeneficios {
  id: string;
  nome: string;
  preco: string;
  beneficios: Beneficio[];
}

interface ResponseDataPlanos {
  data: PlanoComBeneficios[];
}

export default function AssinaturaPage() {
  // Query do contrato atual
  const { isLoadingAssinatura, titulo, subTitulo, correteMesAssinatura, correteAnoAssinatura } = useAssinaturaTraducoes();
  const { data: assinaturaResp, isLoading: isLoadingContrato } = useQuery<Contrato>({
    queryKey: ['get-assinatura'],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api/assinatura`;
      const response = await fetch(url);
      const json = await response.json() as ApiResponseContrato;
      if (!response.ok) throw new Error('Erro ao carregar contrato');
      return json.data;
    },
    refetchInterval: 10000,
  });
  // Query dos planos disponíveis
  const { data: planosDisponiveis = [], isLoading: isLoadingPlanos } = useQuery<PlanoComBeneficios[]>({
    queryKey: ['get-planos'],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api/plano`;
      const response = await fetch(url);
      const json = await response.json() as ResponseDataPlanos;
      if (!response.ok) return [];
      return json.data;
    },
    refetchInterval: 10000,
  });

  // Loading geral
  if (isLoadingContrato || isLoadingPlanos) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">{isLoadingAssinatura}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
              {titulo}
            </h1>
            <p className="text-gray-600 text-lg">
              {subTitulo} 
              {assinaturaResp ? ` Plano atual: ${assinaturaResp.plano.nome}` : ''}
            </p>
          </div>

          {/* Plano atual */}
          {assinaturaResp && <AssinaturaAtual contrato={assinaturaResp} 
          valor={assinaturaResp?.tipo === "MENSAL" ? assinaturaResp.plano.precoMensal : assinaturaResp?.plano.precoAnual} 
          prazo={assinaturaResp?.tipo === "MENSAL" ? `${correteMesAssinatura}` : `${correteAnoAssinatura}`} />}

          {/* Planos disponíveis */}
          {planosDisponiveis.length > 0 && (
            <PlanosDisponiveis
              planos={planosDisponiveis.map(p => ({
                ...p,
                beneficios: p.beneficios.map(b => b.descricao)
              }))}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
