import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStock } from "../../api/stocksApi";

export function useDeleteStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
  });
}