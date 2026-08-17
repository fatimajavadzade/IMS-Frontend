import { useQuery } from "@tanstack/react-query";
import { getCustomersPage } from "../../api/customersApi";

export function useCustomersPage(params) {
  return useQuery({
    queryKey: ["customers", "page", params],
    queryFn: () => getCustomersPage(params).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });
}