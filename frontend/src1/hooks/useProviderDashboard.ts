import { useQuery } from "@tanstack/react-query";
import { getProviderDashboard, ProviderDashboardDto } from "@/lib/dashboardApi";

export function useProviderDashboard(prestataireId?: string) {
  return useQuery<ProviderDashboardDto, Error>({
    queryKey: ["dashboard", "provider", prestataireId],
    queryFn: () => getProviderDashboard(prestataireId ?? ""),
    enabled: Boolean(prestataireId),
  });
}
