
import { FeatureCard } from "@/components/FeatureCard";
import { ArrowRight, Phone, Wifi, ShieldCheck, } from "lucide-react";
import Footer from "@/components/template/footer";
import Header from "@/components/template/header";
import PlanosDisponiveisPage from "@/components/template/planosDisponiveis";
import Link from "next/link";
import { dadosAleatoriosAdmin, dadosAleatoriosPlano } from "@/utils/dadosAleatorio";
export default async function Home() {
  // dadosAleatoriosPlano("d785810d-19a5-4702-8769-222315bd89ec")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header/>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium mb-2">
              Soluções em telefonia e internet
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Conecte-se com o futuro da comunicação
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Planos acessíveis, cobertura nacional e atendimento de qualidade para você e sua empresa.
            </p>

              <Link
                href="/assinatura"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-5 rounded-md transition-colors duration-300 shadow-sm"
                aria-label="Assinar agora"
              >
                Assine agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Wifi className="h-8 w-8 text-blue-600" />}
              title="Internet de alta velocidade"
              description="Navegue sem interrupções com nossos planos de fibra ótica e 5G."
            />
            <FeatureCard
              icon={<Phone className="h-8 w-8 text-blue-600" />}
              title="Planos flexíveis"
              description="Escolha o plano ideal para seu perfil, com chamadas ilimitadas e roaming gratuito."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-blue-600" />}
              title="Segurança e privacidade"
              description="Proteção de dados e suporte dedicado para garantir sua tranquilidade."
            />
          </div>

          {/* Planos */}


          <section className="mt-24">
            <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">
              Nossos Planos
            </h2>
            <PlanosDisponiveisPage/>
          </section>
        </div>
      </main>

        {/* Footer */}
        <Footer/>
    </div>
  );
}
