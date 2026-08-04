import { useQuery } from "@tanstack/react-query";
import { getWarehousesPage } from "../../api/warehousesApi";

export function useWarehousesPage(params) {
  return useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => getWarehousesPage(params).then((res) => res.data),
  });
}