import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../api/ordersApi";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders().then((res) => res.data),
  });
}