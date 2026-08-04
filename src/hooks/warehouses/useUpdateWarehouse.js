import { useMutation } from "@tanstack/react-query";
import { updateWarehouse } from "../../api/warehousesApi";

export function useUpdateWarehouse() {
  return useMutation({
    mutationFn: ({ id, data }) => updateWarehouse(id, data),
  });
}