import { useQuery } from "@tanstack/react-query";
import { getPurchaseById } from "../../api/purchasesApi";

export function usePurchase(id) {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: () => getPurchaseById(id).then((res) => res.data),
    enabled: !!id,
  });
}