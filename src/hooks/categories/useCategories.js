import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/categoriesApi";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories().then((res) => res.data),
  });
}