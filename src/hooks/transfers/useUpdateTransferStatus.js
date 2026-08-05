import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransferStatus } from "../../api/transfersApi";

export function useUpdateTransferStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateTransferStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["transfer", id] });
    },
  });
}