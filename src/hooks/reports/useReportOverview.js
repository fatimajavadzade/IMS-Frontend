import { useQuery } from "@tanstack/react-query";
import { getReportOverview } from "../../api/reportsApi";

export function useReportOverview(params) {
  return useQuery({
    queryKey: ["reports", "overview", params],
    queryFn: () => getReportOverview(params).then((res) => res.data),
  });
}