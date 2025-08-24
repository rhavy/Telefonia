export type ResponseData<T> = {
  ok: boolean;
  error?: string;
  data?: T;
};
