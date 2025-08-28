"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssinaturaTraducoes } from "@/utils/translateClient";
import { CreditCard, RefreshCcw } from "lucide-react";

type Plano = {
  nome: string;
  preco: string;
  beneficios: string[];
};

interface PlanosDisponiveisProps {
  planos: Plano[];
}

export default function PlanosDisponiveis({ planos }: PlanosDisponiveisProps) {
  const {assinarAssinatura} = useAssinaturaTraducoes();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {planos.map((plano) => (
        <Card
          key={plano.nome}
          className="shadow-sm hover:shadow-md transition rounded-2xl"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              {plano.nome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-blue-700">
              {plano.preco}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              {plano.beneficios.map((b, idx) => (
                <li key={idx}>• {b}</li>
              ))}
            </ul>

            <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              <RefreshCcw className="h-4 w-4" />
              {assinarAssinatura} {plano.nome}
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
