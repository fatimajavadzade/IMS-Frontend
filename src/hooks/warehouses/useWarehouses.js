import { useQuery } from "@tanstack/react-query";
import { getWarehouses } from "../../api/warehousesApi";

export function useWarehouses() {
  return useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses().then((res) => res.data),
  });
}