"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, Smartphone, MessageCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatarTelefone } from "@/utils/format";

type TelefoneProps = {
  id?: string;
  numero: string;
  tipo: string;
  ativo?: boolean;
};

export function TelefonesManager() {
  const queryClient = useQueryClient();
  const [novosTelefones, setNovosTelefones] = useState<TelefoneProps[]>([]);

  // Buscar telefones existentes
  const { data, isLoading } = useQuery({
    queryKey: ["telefone"],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api/telefone`;
      const response = await fetch(url);
      const json = await response.json();
      return Array.isArray(json) ? json : json.data || [];
    },
    refetchInterval: 10000,
  });

  const telefones: TelefoneProps[] = Array.isArray(data) ? data : [];

  // Atualizar telefone existente em tempo real
  const handleUpdateTelefone = async (id: string, field: "numero" | "tipo", value: string) => {
    await fetch(`/api/telefone/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    // Atualiza cache local para refletir mudança imediatamente
    queryClient.setQueryData(["telefone"], (oldData: any) => {
      if (!oldData) return [];
      return oldData.map((tel: TelefoneProps) =>
        tel.id === id ? { ...tel, [field]: value } : tel
      );
    });
  };

  // Adicionar novo campo
  const handleAddTelefone = () => {
    setNovosTelefones((prev) => [...prev, { numero: "", tipo: "CELULAR" }]);
  };

  // Atualizar número do novo telefone
  const handleChangeNumero = (index: number, value: string) => {
    setNovosTelefones((prev) => {
      const updated = [...prev];
      updated[index].numero = value.replace(/\D/g, "");
      return updated;
    });
  };

  // Atualizar tipo do novo telefone
  const handleChangeTipo = (index: number, value: string) => {
    setNovosTelefones((prev) => {
      const updated = [...prev];
      updated[index].tipo = value;
      return updated;
    });
  };

  // Remover campo do novo telefone
  const handleRemoveTelefone = (index: number) => {
    setNovosTelefones((prev) => prev.filter((_, i) => i !== index));
  };

  // Salvar novos telefones
  const salvarTelefones = async () => {
    if (!novosTelefones.length) return;
    await Promise.all(
      novosTelefones.map((tel) =>
        fetch("/api/telefone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tel),
        })
      )
    );
    setNovosTelefones([]);
    queryClient.invalidateQueries({ queryKey: ["telefone"] });
  }

  return (
    <div className="space-y-4">
      {/* Telefones existentes */}
      <div>
        {telefones.length > 0 && (<h3 className="font-semibold mb-2">Telefones existentes</h3>)}
        {isLoading ? (
          <p>Carregando...</p>
        ) : telefones.length === 0 ? (
          <p>Nenhum telefone encontrado</p>
        ) : (
          telefones.map((tel) => (
            <div key={tel.id} className="flex items-center gap-2 mb-1">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>{tel.numero} {tel.tipo === "CELULAR" ? (<Smartphone className="inline mr-2 h-4 w-4" /> ): tel.tipo === "WHATSAPP" ? (
                <MessageCircle className="inline mr-2 h-4 w-4 text-green-600" />):(<Phone className="inline mr-2 h-4 w-4" />)}
              </div> 
            </div>
          ))
        )}
      </div>

      {/* Adicionar novos telefones */}
      <div>
        <h3 className="font-semibold mb-2">Adicionar novos telefones</h3>
        {novosTelefones.map((tel, idx) => (
          <div key={idx} className="flex flex-col gap-2 p-2 border rounded-xl mb-2">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={formatarTelefone(tel.numero)}
                maxLength={15}
                placeholder="Digite o telefone"
                onChange={(e) => handleChangeNumero(idx, e.target.value)}
              />
              <Select
                value={tel.tipo}
                onValueChange={(value) => handleChangeTipo(idx, value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CELULAR">
                    <Smartphone className="inline mr-2 h-4 w-4" /> Celular
                  </SelectItem>
                  <SelectItem value="WHATSAPP">
                    <MessageCircle className="inline mr-2 h-4 w-4 text-green-600" /> WhatsApp
                  </SelectItem>
                  <SelectItem value="FIXO">
                    <Phone className="inline mr-2 h-4 w-4" /> Fixo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={salvarTelefones} size="sm">
                Salvar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveTelefone(idx)}
              >
                Remover
              </Button>
            </div>
          </div>
        ))}
        <Button size="sm" onClick={handleAddTelefone}>
          Adicionar Telefone
        </Button>
      </div>
    </div>
  );
}
