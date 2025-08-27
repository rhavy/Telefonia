"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import DownloadBoleto from "./DownloadBoleto";
import { useFaturaTraducoes } from "@/utils/translateClient";

export type Fatura = {
  id: string;
  contratoId: string;
  valor: number;
  vencimento: string | Date;
  pago: boolean;
  codigoBarras?: string;
  chavePix?: string;
}; 

type FaturaCardProps = {
  fatura: Fatura;
  onExibir: () => void;
};

export default function FaturaCard({ fatura, onExibir }: FaturaCardProps) {
  const { contratoFatura, vencimentoFatura, statusFatura, detalhesFatura, exibirFatura, valorFatura, valorCalculoLocalFatura, valorCalculoFatura} = useFaturaTraducoes();
  const vencimento = new Date(fatura.vencimento);
  const vencimentoFormatado = vencimento.toLocaleDateString(`${valorCalculoLocalFatura}`, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const hoje = new Date();
  const atrasada = !fatura.pago && vencimento < hoje;
  const status = fatura.pago ? "Pago" : atrasada ? "Atrasada" : "Em aberto";

  return (
    <Card key={fatura.id} className="shadow-sm hover:shadow-md transition rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          {contratoFatura}: {fatura.contratoId}
        </CardTitle>
        <CreditCard className="h-6 w-6 text-blue-600" />
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600">
          <strong>{vencimentoFatura}:</strong> {vencimentoFormatado}
        </p>
        <p className="text-sm text-gray-600">
          <strong>{valorFatura}:</strong>{" "}
          {(fatura.valor / 100).toLocaleString(`${valorCalculoLocalFatura}`, {
            style: "currency",
            currency: `${valorCalculoFatura}`,
          })}
        </p>

        <p className="text-sm mt-2 flex items-center gap-2">
          {status === "Pago" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
          {status === "Em aberto" && <Clock className="h-4 w-4 text-orange-500" />}
          {status === "Atrasada" && <AlertCircle className="h-4 w-4 text-red-600" />}
          {statusFatura}:{" "}
          <span
            className={
              status === "Pago"
                ? "text-green-600 font-medium"
                : status === "Em aberto"
                ? "text-orange-500 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {status}
          </span>
        </p>

        <div className="mt-4 flex items-center gap-3">
          <Link
            href={`/dashboard/faturas/${fatura.id}`}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            {detalhesFatura}
          </Link>
           <button
                onClick={onExibir}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {exibirFatura}
            </button>
          <DownloadBoleto faturaId={fatura.id} visualizar={false} />
        </div>
      </CardContent>
    </Card>
  );
}
