export type PreferenciasExportProps = {
  id: string;
  tipo: "TEMA" | "IDIOMA" | "NOTIFICACAOEMAIL" | "NOTIFICACAOSMS";
  valor: string;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};
export type TraducoesFooter = {
  [key: string]: {
    footer: {
      infSobreEmpresa: string;
      institucional: string;
      institucionalSobre: string;
      institucionalTrabalhe: string;
      institucionalTermos: string;
      institucionalPolitica: string;
      contato: string;
      email: string;
      endereco: string;
      direitos: string;
    };
  };
};
export type TraducoesHeader = {
  [key: string]: {
    header: {
      button: string;
    };
  };
};
export type TraducoesHeaderAdmin = {
  [key: string]: {
    headerAdmin: {
      dashboardPage: string;
      perfilPage: string;
      faturasPage: string;
      configPage: string;
      assiPage: string;
      docPage: string;
    };
  };
};
export type TraducoesDashboard = {
  [key: string]: {
    dashboard: {
      apresentacao: string;
      apresentacao1: string;
      descricao: string;
      widgetPerfil: string;
      perfiltext: string;
      perfilLink: string;
      widgetAssi: string;
      assitext: string;
      assiLink: string;
      widgetFaturas: string;
      faturastext: string;
      faturasLink: string;
      widgetDocumentos: string;
      documentostext: string;
      documentosLink: string;
      widgetConfiguracoes: string;
      configuracoestext: string;
      configuracoesLink: string;
    };
  };
};
export type TraducoesPerfil = {
  [key: string]: {
    perfil: {
      titulo: string;  
      subTitulo: string;  
      inf: string;
      banner: string;
      perfilT: string;
      buttonCancel: string;
      buttonEdit: string;
      profileBannerErro: string;
      fieldValueErro: string;
    };
  };
};
export type TraducoesFatura = {
 [key: string]: {
    fatura: {
      titulo: string;  
      subTitulo: string;  
      isLoadingFatura : string;
      errorFatura : string;
      errorFaturaVazio : string;
      tabBoletoFatura : string;
      contratoFatura : string;
      vencimentoFatura : string;
      valorFatura : string;
      valorDescricaoFatura : string;
      valorCalculoLocalFatura : string;
      valorCalculoFatura : string;
      statusFatura : string;
      detalhesFatura : string;
      exibirFatura : string;
      baixarFatura: string;
      baixarFaturaErro: string;
      codigobarrasFatura: string;
      chavePixFatura: string;      
      baixarBoletoFatura: string;      
      situacaoAtrasadaFatura: string;      
      situacaoAbertoFatura: string;      
      tituloPixFatura: string;
      carregandoPixFatura: string;
    };
  };
};
export type TraducoesDocumentos = {
 [key: string]: {
    documentos: {
      titulo: string;  
      subTitulo: string;
      isLoadingDoc: string;
      erroDoc: string;
      erroReDoc: string;
      erroReDescDoc: string;
      sussecTitleDoc: string;
      sussecMessDoc: string;
      erroProcDoc: string;
      statusAguardandoDoc: string;
      statusDocumentacaoDoc: string;
      statusDocumentacaoRecusadaDoc: string;
      tiposDocumentosRecusadaDoc: string;
      buttonEnviarDocumentacaoDoc: string;
      nessageEnviarDocumentacaoDoc: string;
      buttonReEnviarDocumentacaoDoc: string;
    };
  };
};
export type TraducoesConfiguracao = {
 [key: string]: {
    configuracao: {
      titulo: string;  
      tituloPreferencia: string;  
      tituloContaPreferencia: string;  
      tituloIdiomaConfiguracao: string;
      tituloNotificaçõesConfiguracao: string;
      receberNotificaçõesEmailConfiguracao: string;
      receberNotificaçõesSMSConfiguracao: string;
      subTitulo: string;
      erroPreferencia: string;
      sussecPreferencia: string;
      modoEscuroConfiguracao: string;      
      excluirContaConfiguracao: string;      
      alterarSenhaConfiguracao: string;      
    };
  };
};