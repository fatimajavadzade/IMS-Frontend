import { useQuery } from "@tanstack/react-query";
import { getProductsPage } from "../../api/productsApi";

export function useProductsPage(params) {
  return useQuery({
    queryKey: ["products", "page", params],
    queryFn: () => getProductsPage(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });
}