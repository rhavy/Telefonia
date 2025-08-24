import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { LoginForm } from "./_components/login-form";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/template/header";
import { authClient } from "@/lib/auth-client";
import Router from "next/router";

export default async function loginPage() {
     const session = await auth.api.getSession({
          headers: await headers()
      })
      if (session && session?.user.emailVerified === true) {
          redirect("/dashboard");
        }
      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
            <Header/>
            <div className="flex min-h-screen flex-col items-center justify-center p-4">          
              <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold">Login {session?.user.name} </h1>
                  <p className="mt-2 text-sm text-muted-foreground">Entre com suas credenciais para acessar sua conta</p>
                </div>
        
                <LoginForm/>
        
                <div className="text-center text-sm">
                  <p>
                    Não tem uma conta?{" "}
                    <Link href="/signup" className="font-medium text-primary hover:underline">
                      Cadastre-se
                    </Link>
                  </p>
                </div>
              </div>
            </div>
        </div>
      )
}