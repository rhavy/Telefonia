// utils/translateServer.ts
import pt from "@/locales/pt.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import { PreferenciasExportProps } from "@/types/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Traducoes } from "@/types/traducao";

// fetcher adaptado para server-side
const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json() as Promise<T>;
};

export async function getDashboardTraducoes(): Promise<{ apresentacao: string }> {
  // 1️⃣ Verifica sessão
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Não autenticado");

  // 2️⃣ URL absoluta do server
  const baseUrl = process.env.HOST_URL || "http://localhost:3000";

  // 3️⃣ Cookies da requisição atual
  const cookieHeader = (await headers()).get("cookie") || "";

  // 4️⃣ Busca preferências do usuário
  const preferenciasResponse = await fetcher<PreferenciasExportProps[]>(
    `${baseUrl}/api/config/perfil`,
    {
      headers: { cookie: cookieHeader },
    }
  );

  // 5️⃣ Garante que seja um array
  const preferencias: PreferenciasExportProps[] = Array.isArray(preferenciasResponse)
    ? preferenciasResponse
    : [];

  // 6️⃣ Seleciona idioma
  const idiomaPref = preferencias.find((p) => p.tipo === "IDIOMA");
  const idioma = idiomaPref?.valor ?? "pt";

  // 7️⃣ Retorna traduções
  const traducoes: Traducoes = { pt, en, es };
  return traducoes[idioma].dashboard;
}
