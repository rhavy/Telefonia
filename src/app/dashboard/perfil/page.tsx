import Footer from "@/components/template/footer";
import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserPerfil } from "./_components/UserPerfilClient";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
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
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">Meu Perfil</h1>
            <p className="text-gray-600 text-lg">
              Veja e atualize suas informações pessoais.
            </p>
          </div>
          <UserPerfil />        
        </div>
      </main>

      <Footer />
    </div>
  );
}
