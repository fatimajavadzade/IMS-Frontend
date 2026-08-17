import { useQuery } from "@tanstack/react-query";
import { getOrdersPage } from "../../api/ordersApi";

export function useOrdersPage(params) {
  return useQuery({
    queryKey: ["orders", "page", params],
    queryFn: () => getOrdersPage(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });
}