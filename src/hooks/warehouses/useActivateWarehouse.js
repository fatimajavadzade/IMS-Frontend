import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateWarehouse } from "../../api/warehousesApi";

export function useActivateWarehouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateWarehouse,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse", id] });
    },
  });
}