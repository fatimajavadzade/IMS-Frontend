import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStock } from "../../api/stocksApi";

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateStock(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stock", id] });
    },
  });
}