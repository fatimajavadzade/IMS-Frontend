import { useQuery } from "@tanstack/react-query";
import { getStockById } from "../../api/stocksApi";

export function useStock(id) {
  return useQuery({
    queryKey: ["stock", id],
    queryFn: () => getStockById(id).then((res) => res.data),
    enabled: !!id,
  });
}