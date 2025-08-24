import { ResponseData } from "@/types/api";

export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });
  const json: ResponseData<T> = await response.json();

  if (!response.ok || !json.ok) {
    throw new Error(json.error || "Erro na requisição");
  }

  return json.data as T;
}
