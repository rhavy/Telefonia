import {
  User, Mail, Fingerprint, CalendarDays, MapPin, Hash,
  StickyNote, Map, Building, Flag, Globe
} from "lucide-react";
import { GenderIntersex } from "@phosphor-icons/react";
import { fetcher } from "@/lib/fetcher";
import Field from "./fields";
import UserTelefones from "./UserTelefones";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type PerfilProps = {
  cpf: string;
  nascimento: string;
  genero: string;
};

type LogadouroProps = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
};

type TelefoneItem = {
  id: string;
  numero: string;
  tipo: string;
};

export async function UserPerfilServer() {
  // Obter sessão no servidor
  const sessionRes = await auth.api.getSession({
    headers: headers(),
  });
  const session: SessionUser = sessionRes?.user ?? {};

  // Buscar dados do usuário
  const perfil = await fetcher<PerfilProps>("/api/perfil");
  const logadouro = await fetcher<LogadouroProps>("/api/logadouro");
  const telefones = await fetcher<TelefoneItem[]>("/api/telefone");

  // Combinar dados para o formulário
  const formData: Record<string, string> = {
    name: session.name ?? perfil?.name ?? "",
    email: session.email ?? "",
    avatar: session.image ?? "",
    role: session.role ?? "vazio",
    cpf: perfil?.cpf ?? "",
    nascimento: perfil?.nascimento ?? "",
    genero: perfil?.genero ?? "",
    logradouro: logadouro?.logradouro ?? "",
    numero: logadouro?.numero ?? "",
    complemento: logadouro?.complemento ?? "",
    bairro: logadouro?.bairro ?? "",
    cidade: logadouro?.cidade ?? "",
    estado: logadouro?.estado ?? "",
    pais: logadouro?.pais ?? "",
    ...telefones.reduce((acc, tel) => {
      acc[`tel-${tel.id}`] = tel.numero;
      return acc;
    }, {} as Record<string, string>),
  };

  const fieldsConfig = [
    { key: "name", icon: <User /> },
    { key: "email", icon: <Mail /> },
    { key: "cpf", icon: <Fingerprint /> },
    { key: "genero", icon: <GenderIntersex /> },
    { key: "nascimento", icon: <CalendarDays /> },
    { key: "logradouro", icon: <MapPin /> },
    { key: "numero", icon: <Hash /> },
    { key: "complemento", icon: <StickyNote /> },
    { key: "bairro", icon: <Map /> },
    { key: "cidade", icon: <Building /> },
    { key: "estado", icon: <Flag /> },
    { key: "pais", icon: <Globe /> },
  ];

  return (
    <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md transition rounded-2xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" /> Informações do Usuário
        </CardTitle>
        {/* Botão de edição precisaria ser Client Component */}
        <Button variant="outline" disabled className="text-sm">
          Editar
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-3 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.avatar} />
            <AvatarFallback>{formData.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <p className="text-lg font-semibold">{formData.name || "Usuário"}</p>
        </div>

        <div className="space-y-4">
          <UserTelefones
            telefones={telefones}
            formData={formData}
            editMode={false} // apenas leitura no server
            onChange={() => {}}
          />

          {fieldsConfig.map(({ key, icon }) => (
            <Field
              key={key}
              icon={icon}
              value={formData[key] || "Não informado"}
              editValue={formData[key]}
              fieldName={key}
              editMode={false}
              onChange={() => {}}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
