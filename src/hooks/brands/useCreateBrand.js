import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrand } from "../../api/brandsApi";

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}