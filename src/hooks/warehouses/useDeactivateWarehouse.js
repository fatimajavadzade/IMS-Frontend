import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateWarehouse } from "../../api/warehousesApi";

export function useDeactivateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateWarehouse,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse", id] });
    },
  });
}