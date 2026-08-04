import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../../api/brandsApi";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands().then((res) => res.data),
  });
}