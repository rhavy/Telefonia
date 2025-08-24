
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, CreditCard, Wifi, Settings, LogOut, } from "lucide-react";
import Footer from "@/components/template/footer";
import { LoadingPage } from "@/components/loadingPage";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type userProps = {
  id: string;
  name: string;
  email: string;
  image?: string;
  banner?: string;
  role: string;
};
export default async function DashboardPage() {
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
          {/* Boas-vindas */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex flex-col items-center gap-2 cols-1 md:cols-2">
              <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
                Bem-vindo, 
              <p className="font-bold text-gray-600 text-lg">
                {session?.user?.name}
              </p>
                ao seu Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Aqui você pode gerenciar sua assinatura, visualizar faturas,
              atualizar seus dados e muito mais.
            </p>
          </div>

          {/* Cards principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  Meus Dados
                </CardTitle>
                <User className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Acesse e edite suas informações pessoais, como nome, e-mail e
                  senha.
                </p>
                <Link
                  href="/dashboard/perfil"
                  className="text-blue-600 font-medium text-sm mt-3 inline-block"
                >
                  Gerenciar perfil →
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  Assinatura
                </CardTitle>
                <Wifi className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Veja detalhes do seu plano contratado e status da assinatura.
                </p>
                <Link
                  href="/dashboard/assinatura/123"
                  className="text-blue-600 font-medium text-sm mt-3 inline-block"
                >
                  Ver assinatura →
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  Faturas
                </CardTitle>
                <CreditCard className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Consulte suas faturas, acompanhe pagamentos e baixe boletos.
                </p>
                <Link
                  href="/dashboard/faturas"
                  className="text-blue-600 font-medium text-sm mt-3 inline-block"
                >
                  Acessar faturas →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Seções adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card className="shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  Documentos
                </CardTitle>
                <FileText className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Contratos, termos de uso e comprovantes disponíveis para
                  download.
                </p>
                <Link
                  href="/dashboard/documentos"
                  className="text-blue-600 font-medium text-sm"
                >
                  Ver documentos →
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  Configurações
                </CardTitle>
                <Settings className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Preferências de notificação, métodos de pagamento e segurança.
                </p>
                <Link
                  href="/dashboard/configuracoes"
                  className="text-blue-600 font-medium text-sm"
                >
                  Ajustar configurações →
                </Link>
              </CardContent>
            </Card>
          </div>

         
        </div>
      </main>

      <Footer />
    </div>
  );
}