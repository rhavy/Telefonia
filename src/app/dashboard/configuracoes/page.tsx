"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Footer from "@/components/template/footer";

export default function ConfiguracoesPage() {
  const [nome, setNome] = useState("João Silva");
  const [email, setEmail] = useState("joao@email.com");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [notificacoes, setNotificacoes] = useState({
    email: true,
    sms: false,
  });

  const handleSalvarPerfil = () => {
    toast.success("Perfil atualizado com sucesso!");
    // Aqui você chamaria sua API para salvar alterações
  };

  const handleAlterarSenha = () => {
    if (novaSenha !== confirmSenha) {
      toast.error("As senhas não conferem!");
      return;
    }
    toast.success("Senha alterada com sucesso!");
    // Aqui você chamaria sua API para alterar senha
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmSenha("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16 space-y-12">

          {/* Título */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-blue-700 tracking-tight mb-3">
              Configurações
            </h1>
            <p className="text-gray-600 text-lg">
              Gerencie suas preferências de conta, senha e notificações.
            </p>
          </div>

          {/* Perfil */}
          <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:gap-4">
                <Input
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Button onClick={handleSalvarPerfil}>Salvar Alterações</Button>
            </CardContent>
          </Card>

          {/* Senha */}
          <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Senha atual"
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
              <Input
                placeholder="Nova senha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <Input
                placeholder="Confirmar nova senha"
                type="password"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
              />
              <Button onClick={handleAlterarSenha}>Alterar Senha</Button>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notificacoes.email}
                  onChange={(e) =>
                    setNotificacoes({ ...notificacoes, email: e.target.checked })
                  }
                />
                Receber notificações por email
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notificacoes.sms}
                  onChange={(e) =>
                    setNotificacoes({ ...notificacoes, sms: e.target.checked })
                  }
                />
                Receber notificações por SMS
              </label>
              <Button onClick={() => toast.success("Preferências de notificação salvas!")}>
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
