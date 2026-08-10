import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "../../api/customersApi";

export function useCustomer(id) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id).then((res) => res.data),
    enabled: !!id,
  });
}