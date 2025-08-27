"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, CreditCard, Wifi, Settings } from "lucide-react";
import Footer from "@/components/template/footer";
import { useDashboardTraducoes } from "@/utils/translateClient";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { PerfilProps } from "@/types/api";

export default function DashboardPage() {

  const { apresentacao, apresentacao1, descricao, widgetPerfil, perfiltext, perfilLink, widgetAssi, assitext, assiLink, widgetFaturas, faturastext, faturasLink,
    widgetDocumentos, documentostext, documentosLink, widgetConfiguracoes, configuracoestext, configuracoesLink
   } = useDashboardTraducoes();
  const { data: perfil } = useQuery({
      queryKey: ["perfil"],
      queryFn: () => fetcher<PerfilProps>("/api/perfil"),
      refetchInterval: 10000,
    });
  if(perfil?.name == ''){
    
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Boas-vindas */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex flex-col items-center gap-2 cols-1 md:cols-2">
              <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
                {apresentacao}
                {/* <p className="font-bold text-gray-600 text-lg">{session?.user?.name}</p> */}
                <p className="font-bold text-gray-600 text-lg">{perfil?.name}</p>
                {apresentacao1}
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              {descricao}
            </p>
          </div>

          {/* Cards principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Meus Dados */}
            <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{widgetPerfil}</CardTitle>
                <User className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {perfiltext}
                </p>
                <Link href="/dashboard/perfil" className="text-blue-600 font-medium text-sm mt-3 inline-block">
                  {perfilLink}
                </Link>
              </CardContent>
            </Card>

            {/* Assinatura */}
            <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{widgetAssi}</CardTitle>
                <Wifi className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {assitext}
                </p>
                <Link href="/dashboard/assinatura/" className="text-blue-600 font-medium text-sm mt-3 inline-block">
                  {assiLink}
                </Link>
              </CardContent>
            </Card>

            {/* Faturas */}
            <Card className="shadow-sm hover:shadow-md transition rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{widgetFaturas}</CardTitle>
                <CreditCard className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {faturastext}
                </p>
                <Link href="/dashboard/faturas" className="text-blue-600 font-medium text-sm mt-3 inline-block">
                  {faturasLink}
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Seções adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Documentos */}
            <Card className="shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{widgetDocumentos}</CardTitle>
                <FileText className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {documentostext}
                </p>
                <Link href="/dashboard/documentos" className="text-blue-600 font-medium text-sm">
                  {documentosLink}
                </Link>
              </CardContent>
            </Card>

            {/* Configurações */}
            <Card className="shadow-sm rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{widgetConfiguracoes}</CardTitle>
                <Settings className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {configuracoestext}
                </p>
                <Link href="/dashboard/configuracoes" className="text-blue-600 font-medium text-sm">
                  {configuracoesLink}
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
