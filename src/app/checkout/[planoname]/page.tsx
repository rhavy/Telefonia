// app/checkout/[planoname]/page.tsx

import DescricaoPlano from "@/components/template/descricaoPlano";
import { notFound } from "next/navigation";
import AssinarContrato from "./_components/form";
import Header from "@/components/template/header";
import Footer from "@/components/template/footer";
import { sanitizeName } from "@/utils/format";

interface Beneficio {
  id: string;
  descricao: string;
}

interface PlanoComBeneficios {
  id:           string;
  nome:         string;
  precoMensal:  number;
  precoAnual:   number;
  desconto:     number;
  descricao:    string;
  internet:     string;
  atendimento:  string;
  chamadas:     string;
  seguranca:    string;
  suporte:      string;
  beneficios:   Beneficio[];
}

interface ResponseData {
  data: PlanoComBeneficios[];
}

interface Props {
  params: {
    planoname: string;
  };
}

// 🧠 Página principal
export default async function CheckoutPage(props: Props) {
  const { planoname } = await props.params; // 👈 precisa do await
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api/plano`;

  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      notFound();
    }

    const json = (await response.json()) as ResponseData;
    if (!json?.data) notFound();

    const planoSelecionado = json.data.find(
      (plano) => sanitizeName(plano.nome) === sanitizeName(planoname)
    );

    if (!planoSelecionado) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header />
        <main className="container mx-auto max-w-6xl p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 -mt-8 md:-mt-16 relative z-10">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl font-bold text-blue-700 mb-4 text-center">
                Detalhes do plano
              </h1>
              <DescricaoPlano planos={planoSelecionado}>
                <></>
              </DescricaoPlano>
              <div className="flex items-center justify-center">
                <div className="text-center max-w-md">
                  <h2 className="text-xl font-semibold text-blue-700 mb-4">
                    Por que escolher a ConectaNet?
                  </h2>
                  <ul className="text-gray-600 space-y-2 text-left">
                    <li>✅ Cobertura nacional com tecnologia de ponta</li>
                    <li>✅ Atendimento personalizado e suporte 24h</li>
                    <li>✅ Planos flexíveis para sua casa ou empresa</li>
                    <li>✅ Instalação rápida e gratuita</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <AssinarContrato plano={planoSelecionado} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (err) {
    console.error("Erro inesperado ao carregar plano:", err);
    notFound();
  }
}

