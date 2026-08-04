import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../../api/categoriesApi";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}