"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Footer from "@/components/template/footer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { useConfiguracaoTraducoes } from "@/utils/translateClient";

export type PreferenciasProps = {
  id: string;
  tipo: "TEMA" | "IDIOMA" | "NOTIFICACAOEMAIL" | "NOTIFICACAOSMS";
  valor: string;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type PreferenciaUpdate = {
  tipo: "TEMA" | "IDIOMA" | "NOTIFICACAOEMAIL" | "NOTIFICACAOSMS";
  valor: string;
};

export default function ConfiguracoesPage() {
  const queryClient = useQueryClient();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [tema, setTema] = useState<"light" | "dark">("light");
  const [idioma, setIdioma] = useState<"pt" | "en" | "es">("pt");
  const [notificacoes, setNotificacoes] = useState({ email: true, sms: false });
  const { titulo, subTitulo, erroPreferencia, sussecPreferencia, tituloPreferencia, tituloNotificaçõesConfiguracao, tituloIdiomaConfiguracao, tituloContaPreferencia,
    receberNotificaçõesSMSConfiguracao, receberNotificaçõesEmailConfiguracao, modoEscuroConfiguracao, alterarSenhaConfiguracao, excluirContaConfiguracao } = useConfiguracaoTraducoes();

  // Buscar preferências do usuário
  const { data: preferencias } = useQuery<PreferenciasProps[]>({
    queryKey: ["config-perfil"],
    queryFn: () => fetcher<PreferenciasProps[]>("/api/config/perfil"),
  });

  const salvarPreferencia = useMutation({
    mutationFn: async (pref: PreferenciaUpdate) => {
      const res = await fetch("/api/config/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pref),
      });
      if (!res.ok) throw new Error(`${erroPreferencia}`);
      return res.json();
    },
    onSuccess: () => {
      toast.success(`${sussecPreferencia}`);
      queryClient.invalidateQueries({ queryKey: ["config-perfil"] });
    },
    onError: (err: any) => {
      toast.error(err.message || `${erroPreferencia}`);
    },
  });

  // Inicializar estados com preferências do backend
  useEffect(() => {
    if (!preferencias) return;
    preferencias.forEach((p) => {
      switch (p.tipo) {
        case "TEMA":
          setTema(p.valor as "light" | "dark");
          break;
        case "IDIOMA":
          setIdioma(p.valor as "pt" | "en" | "es");
          break;
        case "NOTIFICACAOEMAIL":
          setNotificacoes((prev) => ({ ...prev, email: p.valor === "true" }));
          break;
        case "NOTIFICACAOSMS":
          setNotificacoes((prev) => ({ ...prev, sms: p.valor === "true" }));
          break;
      }
    });
  }, [preferencias]);

  // Salvar automaticamente quando preferências mudarem
  useEffect(() => salvarPreferencia.mutate({ tipo: "TEMA", valor: tema }), [tema]);
  useEffect(() => salvarPreferencia.mutate({ tipo: "IDIOMA", valor: idioma }), [idioma]);
  useEffect(() => salvarPreferencia.mutate({ tipo: "NOTIFICACAOEMAIL", valor: notificacoes.email.toString() }), [notificacoes.email]);
  useEffect(() => salvarPreferencia.mutate({ tipo: "NOTIFICACAOSMS", valor: notificacoes.sms.toString() }), [notificacoes.sms]);

  // Alterar senha
  const handleAlterarSenha = async () => {
    if (novaSenha !== confirmSenha) return toast.error("Senhas não conferem!");
    const res = await fetch("/api/config/senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senhaAtual, novaSenha }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    toast.success(data.message);
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
              {titulo}
            </h1>
            <p className="text-gray-600 text-lg">
              {subTitulo}
            </p>
          </div>

          {/* Aparência */}
          <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md rounded-2xl">
            <CardHeader><CardTitle>{tituloPreferencia}</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-w-md mx-auto">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tema === "dark"}
                  onChange={(e) => setTema(e.target.checked ? "dark" : "light")}
                />
                {modoEscuroConfiguracao}
              </label>
              <label className="flex items-center gap-2">{tituloIdiomaConfiguracao}</label>
              <select
                className="border rounded-md p-2"
                value={idioma}
                onChange={(e) => setIdioma(e.target.value as "pt" | "en" | "es")}
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md rounded-2xl">
            <CardHeader><CardTitle>{tituloNotificaçõesConfiguracao}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notificacoes.email}
                  onChange={(e) =>
                    setNotificacoes({ ...notificacoes, email: e.target.checked })
                  }
                />
                {receberNotificaçõesEmailConfiguracao}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notificacoes.sms}
                  onChange={(e) =>
                    setNotificacoes({ ...notificacoes, sms: e.target.checked })
                  }
                />
                {receberNotificaçõesSMSConfiguracao}
              </label>
            </CardContent>
          </Card>

          {/* Conta */}
          <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md rounded-2xl">
            <CardHeader><CardTitle>{tituloContaPreferencia}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="destructive"
                onClick={() => toast.error("⚠️ Confirme exclusão de conta em sua API")}
              >
                {excluirContaConfiguracao}
              </Button>
            </CardContent>
          </Card>

          {/* Alterar Senha */}
          <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md rounded-2xl">
            <CardHeader><CardTitle>{alterarSenhaConfiguracao}</CardTitle></CardHeader>
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
              <Button onClick={handleAlterarSenha}>{alterarSenhaConfiguracao}</Button>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
