import { TraducoesConfiguracao, TraducoesDocumentos, TraducoesFatura, TraducoesFooter, TraducoesHeader, TraducoesHeaderAdmin } from './../types/traducao';
// lib/hooks/useDashboardTraducoes.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import pt from "@/locales/pt.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import { PreferenciasExportProps, TraducoesDashboard, TraducoesPerfil } from "@/types/traducao";

export function useDashboardTraducoes() {

  const { data: preferencias } = useQuery<PreferenciasExportProps[]>({
      queryKey: ["config-perfil"],
      queryFn: () => fetcher<PreferenciasExportProps[]>("/api/config/perfil"),
    });
  
    const idiomaPref = preferencias?.find((p) => p.tipo === "IDIOMA");
    const idioma = idiomaPref?.valor ?? "pt";
  
    const traducoes: TraducoesDashboard = { pt, en, es };
      return traducoes[idioma].dashboard;
    

}
export function usePerfilTraducoes() {

  const { data: preferencias } = useQuery<PreferenciasExportProps[]>({
      queryKey: ["config-perfil"],
      queryFn: () => fetcher<PreferenciasExportProps[]>("/api/config/perfil"),
    });
  
    const idiomaPref = preferencias?.find((p) => p.tipo === "IDIOMA");
    const idioma = idiomaPref?.valor ?? "pt";
  
    const traducoes: TraducoesPerfil = { pt, en, es };
      return traducoes[idioma].perfil;
    

}
export function useHeaderTraducoes() {

  const { data: preferencias } = useQuery<PreferenciasExportProps[]>({
      queryKey: ["config-perfil"],
      queryFn: () => fetcher<PreferenciasExportProps[]>("/api/config/perfil"),
    });
  
    const idiomaPref = preferencias?.find((p) => p.tipo === "IDIOMA");
    const idioma = idiomaPref?.valor ?? "pt";
  
    const traducoes: TraducoesHeader = { pt, en, es };
      return traducoes[idioma].header;
    

}
export function useHeaderAdminTraducoes() {

  const { data: preferencias } = useQuery<PreferenciasExportProps[]>({
      queryKey: ["config-perfil"],
      queryFn: () => fetcher<PreferenciasExportProps[]>("/api/config/perfil"),
    });
  
    const idiomaPref = preferencias?.find((p) => p.tipo === "IDIOMA");
    const idioma = idiomaPref?.valor ?? "pt";
  
    const traducoes: TraducoesHeaderAdmin = { pt, en, es };
      return traducoes[idioma].headerAdmin;
    

}
export function useFooterTraducoes() {

  const { data: preferencias } = useQuery<PreferenciasExportProps[]>({
      queryKey: ["config-perfil"],
      queryFn: () => fetcher<PreferenciasExportProps[]>("/api/config/perfil"),
    });
  
    const idiomaPref = preferencias?.find((p) => p.tipo === "IDIOMA");
    const idioma = idiomaPref?.valor ?? "pt";
  
    const traducoes: TraducoesFooter = { pt, en, es };
      return traducoes[idioma].footer;
    

}
export function useFaturaTraducoes() {

  const { data: preferencias } = useQuery<PreferenciasExportProps[]>({
      queryKey: ["config-perfil"],
      queryFn: () => fetcher<PreferenciasExportProps[]>("/api/config/perfil"),
    });
  
    const idiomaPref = preferencias?.find((p) => p.tipo === "IDIOMA");
    const idioma = idiomaPref?.valor ?? "pt";
  
    const traducoes: TraducoesFatura = { pt, en, es };
      return traducoes[idioma].fatura;
    

}
export function useDocumentosTraducoes() {

  const { data: preferencias } = useQuery<PreferenciasExportProps[]>({
      queryKey: ["config-perfil"],
      queryFn: () => fetcher<PreferenciasExportProps[]>("/api/config/perfil"),
    });
  
    const idiomaPref = preferencias?.find((p) => p.tipo === "IDIOMA");
    const idioma = idiomaPref?.valor ?? "pt";
  
    const traducoes: TraducoesDocumentos = { pt, en, es };
      return traducoes[idioma].documentos;
    

}
export function useConfiguracaoTraducoes() {

  const { data: preferencias } = useQuery<PreferenciasExportProps[]>({
      queryKey: ["config-perfil"],
      queryFn: () => fetcher<PreferenciasExportProps[]>("/api/config/perfil"),
    });
  
    const idiomaPref = preferencias?.find((p) => p.tipo === "IDIOMA");
    const idioma = idiomaPref?.valor ?? "pt";
  
    const traducoes: TraducoesConfiguracao = { pt, en, es };
      return traducoes[idioma].configuracao;
    

}
