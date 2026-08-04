import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBrand } from "../../api/brandsApi";

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}