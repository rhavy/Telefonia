import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEnderecoAutoSave() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      return fetch("/api/logadouro", {
        method: "PUT", // ou PATCH dependendo da sua rota
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [data.key]: data.value }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logadouro"] });
    },
  });

  return mutation;
}
