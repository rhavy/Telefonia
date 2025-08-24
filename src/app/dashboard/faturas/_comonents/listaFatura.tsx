"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { CreditCard, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

type Fatura = {
    id: string;
    contratoId: string;
    valor: number;
    vencimento: string | Date;
    pago: boolean;
};

export default function ListaFatura() {
    const {
        data: faturas = [],
        isLoading,
        error,
    } = useQuery<Fatura[]>({
        queryKey: ["fatura"],
        queryFn: () => fetcher<Fatura[]>("/api/fatura"),
        refetchInterval: 10000,
    });

    if (isLoading)
        return <p className="text-center text-gray-500">Carregando faturas...</p>;
    if (error) {
        const message =
            error instanceof Error ? error.message : "Erro desconhecido";
        return (
            <p className="text-center text-red-500">
                Erro ao carregar faturas: {message}
            </p>
        );
    }
    if (faturas.length === 0)
        return <p className="text-center text-gray-500">Nenhuma fatura encontrada.</p>;

    const hoje = new Date();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faturas.map((fatura) => {
                const vencimento = new Date(fatura.vencimento);
                const vencimentoFormatado = vencimento.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });

                const atrasada = !fatura.pago && vencimento < hoje;
                const status = fatura.pago
                    ? "Pago"
                    : atrasada
                    ? "Atrasada"
                    : "Em aberto";

                return (
                    <Card
                        key={fatura.id}
                        className="shadow-sm hover:shadow-md transition rounded-2xl"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-semibold">
                                Contrato: {fatura.contratoId}
                            </CardTitle>
                            <CreditCard className="h-6 w-6 text-blue-600" />
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-gray-600">
                                <strong>Vencimento:</strong> {vencimentoFormatado}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Valor:</strong> R$ {fatura.valor.toFixed(2)}
                            </p>

                            <p className="text-sm mt-2 flex items-center gap-2">
                                {status === "Pago" && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                                {status === "Em aberto" && (
                                    <Clock className="h-4 w-4 text-orange-500" />
                                )}
                                {status === "Atrasada" && (
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                )}
                                Status:{" "}
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
                                    Ver detalhes
                                </Link>
                                <button
                                    type="button"
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition"
                                >
                                    <Download className="h-4 w-4" />
                                    Baixar boleto
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
