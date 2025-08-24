"use client"

import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { formatCurrency, sanitizeName } from '@/utils/format';
import { useQuery } from "@tanstack/react-query";
import { Plano } from '@/generated/prisma';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

interface Beneficio {
  id: string;
  descricao: string;
}

interface PlanoComBeneficios extends Plano {
  beneficios: Beneficio[];
}

interface ResponseData {
  data: PlanoComBeneficios[];
}

export default function PlanosDisponiveisPage() {
    const { data, isLoading } = useQuery({
    queryKey: ['get-plano'],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api/plano`;
      const response = await fetch(url);
      const json = await response.json() as ResponseData;
      if(!response.ok){
        return [];
      }
      return json.data;
    },
    refetchInterval: 10000
  })

  if(isLoading){
    return(
      <div className="mt-5">
        <p className="text-center text-gray-700">Carregando...</p>
      </div>
    ) 
  }

 return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plano Básico */}
        {data && data.map((plano) => (
        <Card key={plano.id} className="border rounded-lg p-6 shadow-sm bg-white text-center">
            <CardHeader>
            <CardTitle>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Plano {plano.nome}</h3>
            </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4">{plano.descricao}</p>
                
                <ul className="text-sm text-gray-700 mb-6 space-y-2 text-left">{plano.internet}  de Internet</ul>
                <ul className="text-sm text-gray-700 mb-6 space-y-2 text-left">Chamadas  {plano.chamadas}</ul>
                <ul className="text-sm text-gray-700 mb-6 space-y-2 text-left">Atendimento {plano.atendimento}</ul>
                <ul className="text-sm text-gray-700 mb-6 space-y-2 text-left">Segurança {plano.seguranca}</ul>
                <ul className="text-sm text-gray-700 mb-6 space-y-2 text-left">Suporte {plano.suporte}</ul>
                <ul className="text-sm text-gray-700 mb-6 space-y-2 text-left">
                    {plano.beneficios.length > 0 ? (
                        plano.beneficios.map((beneficio) => (
                        <li key={beneficio.id}>✅ {beneficio.descricao}</li>
                        ))
                    ) : (
                      <></>
                        // <li className="text-gray-500 italic">Nenhum benefício disponível</li>
                    )}
                </ul>

                <div className="text-2xl font-bold text-blue-700 mb-4">Mensal: {formatCurrency(plano.precoMensal / 100)}</div>
                <Link href={`${process.env.NEXT_PUBLIC_HOST_URL}/planos/${sanitizeName(plano.nome)}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-md transition-all duration-300">
                    Assinar Plano
                    <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
                <div className="text-xs font-bold text-blue-400 mb-4">Anual: {formatCurrency(plano.precoAnual / 100)}</div>
            </CardContent>
        </Card>
        ))}

    </div>
  );
}
