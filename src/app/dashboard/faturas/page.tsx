import Footer from "@/components/template/footer";
import LitaFAtura from "./_comonents/listaFatura";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FaturasPage() {
  const session = await auth.api.getSession({
              headers: await headers()
          });
          if (!session) {
            redirect("/login");          
          }
   return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Título */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
              Minhas Faturas
            </h1>
            <p className="text-gray-600 text-lg">
              Acompanhe suas faturas, baixe boletos e verifique o status dos pagamentos.
            </p>
          </div>

          {/* Lista de faturas */}
            <LitaFAtura/>
        </div>
      </main>

      <Footer />
    </div>
  );
}
