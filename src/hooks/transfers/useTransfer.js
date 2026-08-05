import { useQuery } from "@tanstack/react-query";
import { getTransferById } from "../../api/transfersApi";

export function useTransfer(id) {
  return useQuery({
    queryKey: ["transfer", id],
    queryFn: () => getTransferById(id).then((res) => res.data),
    enabled: !!id,
  });
}