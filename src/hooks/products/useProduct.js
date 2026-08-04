import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../api/productsApi";

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id).then((res) => res.data),
    enabled: !!id,
  });
}