"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateAccountButton() {
  const [loading, setLoading] = useState(false);
    
  async function handleCreateStripeAccount() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/stripe/create-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Falha ao Criar Conta de Pagamento!"); // Exibindo o erro retornado da API
        setLoading(false);
        return;
      }

      window.location.href = data.url; // Redireciona para o Stripe onboarding
    } catch (err) {
      toast.error("Ocorreu um erro inesperado!"); // Adicionando uma mensagem de erro genérica
      console.error("Erro ao criar a conta Stripe:", err); // Para depuração
      setLoading(false);
    }
  }

  return (
    <div className="mb-5">
      <Button 
        className="cursor-pointer" 
        onClick={handleCreateStripeAccount} 
        disabled={loading}
      >
        {loading ? "Carregando..." : "Ativar Conta de Pagamentos"}
      </Button>
    </div>
  );
}
