import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../../api/customersApi";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers().then((res) => res.data),
  });
}