import { useQuery } from "@tanstack/react-query";
import { getManagers } from "../../api/usersApi";

export function useManagers() {
  return useQuery({
    queryKey: ["managers"],
    queryFn: () => getManagers().then((res) => res.data),
  });
}