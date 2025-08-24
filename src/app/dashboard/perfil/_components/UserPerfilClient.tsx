"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, CalendarDays, Fingerprint, Flag, Globe, Hash, Mail, Map, MapPin, StickyNote, User, Venus, } from "lucide-react";
import {  useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { useState } from "react";
import Field from "./fields";
import { useEnderecoAutoSave } from "../_actions/useEnderecoAutoSave";
import { useUserAutoSave } from "../_actions/useUserAutoSave";
import { usePerfilAutoSave } from "../_actions/usePerfilAutoSave";
import { ProfileBanner } from "./ProfileBanner";
import { AddPhoneModal } from "./AddPhoneModal";

type PerfilProps = {
  cpf: string;
  nascimento: string;
  genero: string;
};

type userProps = {
  id: string;
  name: string;
  email: string;
  image?: string;
  banner?: string;
  role: string;
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

export function UserPerfil() {
  const [edit, setEdit] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const fieldsConfigUse = [
    { key: "name", icon: <User /> },
    { key: "email", icon: <Mail /> },
  ];
  const fieldsConfigPerfil = [
    { key: "cpf", icon: <Fingerprint /> },
    { key: "genero", icon: <Venus /> },
    { key: "nascimento", icon: <CalendarDays /> },
  ];

  const fieldsConfigEndereco = [
    { key: "cep", icon: <MapPin /> },
    { key: "logradouro", icon: <MapPin /> },
    { key: "numero", icon: <Hash /> },
    { key: "complemento", icon: <StickyNote /> },
    { key: "bairro", icon: <Map /> },
    { key: "cidade", icon: <Building /> },
    { key: "estado", icon: <Flag /> },
    { key: "pais", icon: <Globe /> },
  ];

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetcher<userProps>("/api/user"),
    refetchInterval: 10000,
  });

  const { data: perfil } = useQuery({
    queryKey: ["perfil"],
    queryFn: () => fetcher<PerfilProps>("/api/perfil"),
    refetchInterval: 10000,
  });

  const { data: logadouro } = useQuery({
    queryKey: ["logadouro"],
    queryFn: () => fetcher<LogadouroProps>("/api/logadouro"),
    refetchInterval: 10000,
  });

  const formData: Record<string, string> = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: user?.image ?? "",
    role: user?.role ?? "",
    cpf: perfil?.cpf ?? "",
    nascimento: perfil?.nascimento ?? "",
    genero: perfil?.genero ?? "",
    cep: logadouro?.cep ?? "",
    logradouro: logadouro?.logradouro ?? "",
    numero: logadouro?.numero ?? "",
    complemento: logadouro?.complemento ?? "",
    bairro: logadouro?.bairro ?? "",
    cidade: logadouro?.cidade ?? "",
    estado: logadouro?.estado ?? "",
    pais: logadouro?.pais ?? "",
  };

  const { mutate: salvarEndereco } = useEnderecoAutoSave();

  function handleChangeEndereco(key: string, value: string) {
    // Atualiza estado local para refletir instantaneamente no input
    setFormValues((prev) => ({ ...prev, [key]: value }));

    // Dispara auto-save no backend
    salvarEndereco({ key, value });
  }
  const { mutate: salvarPerfil } = usePerfilAutoSave();

  function handleChangePerfil(key: string, value: string) {
    // Atualiza estado local para refletir instantaneamente no input
    setFormValues((prev) => ({ ...prev, [key]: value }));

    // Dispara auto-save no backend
    salvarPerfil({ key, value });
  }
  const { mutate: salvarUser } = useUserAutoSave();

  function handleChangeUser(key: string, value: string) {
    // Atualiza estado local para refletir instantaneamente no input
    setFormValues((prev) => ({ ...prev, [key]: value }));

    // Dispara auto-save no backend
    salvarUser({ key, value });
  }
  return (
    <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md transition rounded-2xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" /> Informações do Usuário
        </CardTitle>
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => setEdit(!edit)}
        >
          {edit ? "Cancelar" : "Editar"}
        </Button>
      </CardHeader>

      <CardContent>
        <ProfileBanner
          imageBanner={user?.banner || "https://github.com/rhavy.png" }
          imageUrl={user?.image || "https://github.com/rhavy.png"}
          name={user?.name || "User"}
          email={user?.email || "sem E-mail cadastrado"}
        />

        {/* Campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6 mb-6">
          {/* Perfil */}
          <div className="space-y-4">
            {fieldsConfigUse.map(({ key, icon }) => (
              <Field
                key={key}
                icon={icon}
                value={formData[key] || "Não informado"}
                editValue={formData[key]}
                fieldName={key}
                editMode={edit}
                onChange={handleChangeUser}
              />
            ))}
            <AddPhoneModal/>
            {fieldsConfigPerfil.map(({ key, icon }) => (
              <Field
                key={key}
                icon={icon}
                value={formData[key] || "Não informado"}
                editValue={formData[key]}
                fieldName={key}
                editMode={edit}
                onChange={handleChangePerfil} // <-- CORREÇÃO
              />
            ))}
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            {fieldsConfigEndereco.map(({ key, icon }) => (
              <Field
                key={key}
                icon={icon}
                value={formData[key] || "Não informado"}
                editValue={formData[key]}
                fieldName={key}
                editMode={edit}
                onChange={handleChangeEndereco} // <-- CORREÇÃO
              />
            ))}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
