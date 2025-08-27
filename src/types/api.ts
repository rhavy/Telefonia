export type ResponseData<T> = {
  ok: boolean;
  error?: string;
  data?: T;
};

export type PerfilProps = {
  name: string;
  cpf: string;
  nascimento: string;
  genero: string;
};


