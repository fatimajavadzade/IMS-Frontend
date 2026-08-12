import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../../api/authApi";

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
  });
}