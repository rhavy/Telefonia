"use client";

import Footer from "@/components/template/footer";
import { UserPerfil } from "./_components/UserPerfilClient";
import { useDashboardTraducoes, usePerfilTraducoes } from "@/utils/translateClient";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { PerfilProps } from "@/types/api";

export default function PerfilPage() {
  const { titulo, subTitulo } = usePerfilTraducoes();

  const { data: perfil } = useQuery({
    queryKey: ["perfil"],
    queryFn: () => fetcher<PerfilProps>("/api/perfil"),
    refetchInterval: 10000,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
              {titulo}
            </h1>
            <p className="text-gray-600 text-lg">
              {subTitulo}
            </p>
          </div>

          {/* Passar os dados para o componente de perfil */}
          <UserPerfil/>
        </div>
      </main>

      <Footer />
    </div>
  );
}
