import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransfer } from "../../api/transfersApi";

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}