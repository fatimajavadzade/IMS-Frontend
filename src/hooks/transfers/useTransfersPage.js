import { useQuery } from "@tanstack/react-query";
import { getTransfersPage } from "../../api/transfersApi";

export function useTransfersPage(params) {
  return useQuery({
    queryKey: ["transfers", "page", params],
    queryFn: () => getTransfersPage(params).then((res) => res.data),
  });
}