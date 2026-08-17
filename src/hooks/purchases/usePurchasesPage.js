import { useQuery } from "@tanstack/react-query";
import { getPurchasesPage } from "../../api/purchasesApi";

export function usePurchasesPage(params) {
  return useQuery({
    queryKey: ["purchases", "page", params],
    queryFn: () => getPurchasesPage(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });
}