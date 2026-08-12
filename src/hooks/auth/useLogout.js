import { useMutation } from "@tanstack/react-query";
import { logout } from "../../api/authApi";

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}