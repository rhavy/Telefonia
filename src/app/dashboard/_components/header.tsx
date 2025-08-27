"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard, LogOut, Phone, User } from "lucide-react";
import MobileMenu from "./menu-mobile";
import { authClient } from "@/lib/auth-client";
import { useHeaderAdminTraducoes } from "@/utils/translateClient";

export default function Header() {
  const router = useRouter();

  async function handleSignout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login"); // redirect to login page
        },
      },
    });
  }

  const { dashboardPage, perfilPage, faturasPage, configPage, assiPage, docPage } = useHeaderAdminTraducoes();

  return (

    <header className="py-6 px-4 sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center text-blue-600 font-bold text-xl">
              <Phone className="h-6 w-6 mr-2" />
              <span>ConectaNet</span>
          </Link>

          {/* Navegação à direita */}
          <div className="flex items-center gap-4">
            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
              >
                <LayoutDashboard size={18} />
                {dashboardPage}
              </Link>

              <Link
                href="/dashboard/faturas"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
              >
                <FileText size={18} />
                {faturasPage}
              </Link>

              <Link
                href="/dashboard/assinatura"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
              >
                <FileText size={18} />
                {assiPage}
              </Link>

              <Link
                href="/dashboard/documentos"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
              >
                <FileText size={18} />
                {docPage}
              </Link>

              <Link
                href="/dashboard/perfil"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
              >
                <User size={18} />
                {perfilPage}
              </Link>

              <Link
                href="/dashboard/configuracoes"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
              >
                <User size={18} />
                {configPage}
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                onClick={handleSignout}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sair</span>
              </Button>
            </nav>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
      </div>
  </header>
  );
}
