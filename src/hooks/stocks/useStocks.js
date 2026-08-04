import { useQuery } from "@tanstack/react-query";
import { getStocks } from "../../api/stocksApi";

export function useStocks() {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: () => getStocks().then((res) => res.data),
  });
}