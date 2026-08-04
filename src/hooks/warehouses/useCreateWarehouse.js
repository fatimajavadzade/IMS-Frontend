import { useMutation } from "@tanstack/react-query";
import { createWarehouse } from "../../api/warehousesApi";

export function useCreateWarehouse() {
  return useMutation({
    mutationFn: createWarehouse,
  });
}