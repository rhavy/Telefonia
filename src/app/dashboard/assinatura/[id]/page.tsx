"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Crown, CalendarCheck, RefreshCcw } from "lucide-react";
import Footer from "@/components/template/footer";

export default function AssinaturaPage() {
  const assinaturaAtual = {
    plano: "Premium",
    preco: "R$ 99,90/mês",
    status: "Ativa",
    renovacao: "10/09/2025",
    metodoPagamento: "Cartão de crédito (**** 1234)",
  };

  const planosDisponiveis = [
    { nome: "Básico", preco: "R$ 49,90/mês", beneficios: ["Eventos ilimitados", "Suporte padrão"] },
    { nome: "Premium", preco: "R$ 99,90/mês", beneficios: ["Tudo do Básico", "Suporte prioritário", "Relatórios avançados"] },
    { nome: "Enterprise", preco: "R$ 199,90/mês", beneficios: ["Tudo do Premium", "Atendimento dedicado", "Integrações personalizadas"] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Título */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
              Minha Assinatura
            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie seu plano de assinatura, forma de pagamento e upgrades.
            </p>
          </div>

          {/* Assinatura atual */}
          <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md transition rounded-2xl mb-10">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Plano Atual: {assinaturaAtual.plano}
              </CardTitle>
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                {assinaturaAtual.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                <strong>Preço:</strong> {assinaturaAtual.preco}
              </p>
              <p className="text-gray-600">
                <strong>Forma de pagamento:</strong>{" "}
                {assinaturaAtual.metodoPagamento}
              </p>
              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <CalendarCheck className="h-4 w-4 text-blue-600" />
                <span>
                  <strong>Próxima renovação:</strong>{" "}
                  {assinaturaAtual.renovacao}
                </span>
              </p>

              <div className="mt-5 flex gap-4">
                <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                  Alterar Plano
                </button>
                <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition">
                  Cancelar Assinatura
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Outros planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {planosDisponiveis.map((plano) => (
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
                    Assinar {plano.nome}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
