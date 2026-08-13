import { useMutation } from "@tanstack/react-query";
import { exportReport } from "../../api/reportsApi";

export function useExportReport() {
  return useMutation({
    mutationFn: (params) => exportReport(params).then((res) => res.data),
  });
}