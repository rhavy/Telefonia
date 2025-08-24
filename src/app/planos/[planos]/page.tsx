"use client";

import DescricaoPlano from "@/components/template/descricaoPlano";
import Footer from "@/components/template/footer";
import Header from "@/components/template/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useParams, notFound } from "next/navigation";
import { formatCurrency, sanitizeName } from "@/utils/format";

interface Beneficio {
  id: string;
  descricao: string;
}

interface PlanoComBeneficios {
  id:           string;
  nome:         string;
  precoMensal:  number;
  precoAnual:   number;
  descricao:    string;
  internet:     string;
  atendimento:  string;
  chamadas:     string;
  seguranca:    string;
  suporte:      string;  
  beneficios: Beneficio[];
}

interface ResponseData {
  data: PlanoComBeneficios[];
}
export default function PlanoPremiumPage() {
  const params = useParams();
  const planosParam = typeof params.planos === "string" ? params.planos : "";

  const { data, isLoading } = useQuery({
    queryKey: ["get-plano"],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api/plano`;
      const response = await fetch(url);
      const json = (await response.json()) as ResponseData;
      if (!response.ok) {
        return [];
      }
      return json.data;
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="mt-5">
        <p className="text-center text-gray-700">Carregando...</p>
      </div>
    );
  }

  const planoSelecionado = data?.find(
    (plano) => sanitizeName(plano.nome) === sanitizeName(planosParam)
  );

  if (!planoSelecionado) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <DescricaoPlano planos={planoSelecionado}>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-700 mb-4">
            R${formatCurrency(planoSelecionado.precoMensal / 100)}/mês
          </div>
          <Link
            href={`${process.env.NEXT_PUBLIC_HOST_URL}/checkout/${sanitizeName(
              planoSelecionado.nome
            )}`}
          >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg">
              Assinar Plano {planoSelecionado.nome}
            </Button>
          </Link>
        </div>
      </DescricaoPlano>
      <Footer />
    </div>
  );
}
