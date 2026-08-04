import { useQuery } from "@tanstack/react-query";
import { getWarehouseById } from "../../api/warehousesApi";

export function useWarehouse(id) {
  return useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => getWarehouseById(id).then((res) => res.data),
    enabled: !!id,
  });
}