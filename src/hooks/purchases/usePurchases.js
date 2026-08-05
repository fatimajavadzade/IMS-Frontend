import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "../../api/purchasesApi";

export function usePurchases() {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: () => getPurchases().then((res) => res.data),
  });
}