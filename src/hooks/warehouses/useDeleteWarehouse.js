import { useMutation } from "@tanstack/react-query";
import { deleteWarehouse } from "../../api/warehousesApi";

export function useDeleteWarehouse() {
  return useMutation({
    mutationFn: deleteWarehouse,
  });
}