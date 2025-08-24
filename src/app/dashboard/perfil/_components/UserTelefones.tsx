"use client";

import { MessageCircle, Phone, Smartphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type TelefoneProps = {
  id: string;
  numero: string;
  tipo: string;
  ativo: boolean;
};

export default function UserTelefones() {
  const { data, isLoading } = useQuery({
    queryKey: ["telefone"],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_HOST_URL}/api/telefone`;
      const response = await fetch(url);
      const json = await response.json();
      console.log("API /telefone:", json); // veja o retorno
      return Array.isArray(json) ? json : json.data || [];
    },
    refetchInterval: 10000,
  });

  const telefones: TelefoneProps[] = Array.isArray(data) ? data : [];

  if (isLoading) return <p>Carregando...</p>;

  if (telefones.length === 0) return <p>Nenhum telefone encontrado</p>;

  return (
    <>
      {telefones.map((tel) => (
        <div key={tel.id} className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-gray-500" />
          <div>{tel.numero} {tel.tipo === "CELULAR" ? (<Smartphone className="inline mr-2 h-4 w-4" /> ): tel.tipo === "WHATSAPP" ? (
           <MessageCircle className="inline mr-2 h-4 w-4 text-green-600" />):(<Phone className="inline mr-2 h-4 w-4" />)}</div> 
        </div>
      ))}
    </>
  );
}
