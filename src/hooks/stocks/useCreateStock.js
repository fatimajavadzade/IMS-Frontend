import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStock } from "../../api/stocksApi";

export function useCreateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
}