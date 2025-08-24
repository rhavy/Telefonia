"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Botão hambúrguer */}
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      {/* Conteúdo lateral */}
      <SheetContent
        side="right"
        className="w-[240px] sm:w-[280px] p-6 bg-white/95 backdrop-blur-md"
      >
        <h2 className="text-lg font-semibold mb-6">Menu</h2>

        <div className="flex flex-col gap-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/perfil"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
          >
            <User size={18} />
            Meu perfil
          </Link>

          <Link
            href="/dashboard/faturas"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600"
          >
            <FileText size={18} />
            Faturas
          </Link>
          <Button
            variant="ghost"
            className="justify-start px-0 text-red-500 hover:text-red-600 hover:bg-transparent cursor-pointer"
            onClick={handleSignout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
