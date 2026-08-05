import { useQuery } from "@tanstack/react-query";
import { getTransfers } from "../../api/transfersApi";

export function useTransfers() {
  return useQuery({
    queryKey: ["transfers"],
    queryFn: () => getTransfers().then((res) => res.data),
  });
}