import Footer from "@/components/template/footer";
import Header from "@/components/template/header";
import PlanosDisponiveisPage from "@/components/template/planosDisponiveis";

export default function AssinarPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header/>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-blue-700">
              Escolha seu plano ideal
            </h1>
            <p className="text-gray-600 text-lg">
              Assine agora e tenha acesso à melhor cobertura e atendimento do Brasil.
            </p>
          </div>

          {/* Planos disponíveis */}
          <PlanosDisponiveisPage/>
        </div>
      </main>

      <Footer />
    </div>
  );
}
