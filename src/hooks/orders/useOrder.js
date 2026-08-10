import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../../api/ordersApi";

export function useOrder(id) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id).then((res) => res.data),
    enabled: !!id,
  });
}