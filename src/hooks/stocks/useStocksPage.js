import { useQuery } from "@tanstack/react-query";
import { getStocksPage } from "../../api/stocksApi";

export function useStocksPage(params) {
  return useQuery({
    queryKey: ["stocks", "page", params],
    queryFn: () => getStocksPage(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });
}