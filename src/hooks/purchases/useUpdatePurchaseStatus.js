import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePurchaseStatus } from "../../api/purchasesApi";

export function useUpdatePurchaseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePurchaseStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["purchase", id] });
    },
  });
}