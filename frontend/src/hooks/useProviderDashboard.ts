import { useQuery } from "@tanstack/react-query";
import { getProviderDashboard, ProviderDashboardDto } from "@/lib/dashboardApi";

export function useProviderDashboard(prestataireId?: string) {
  console.log("useProviderDashboard hook called with prestataireId:", prestataireId);
  
  return useQuery<ProviderDashboardDto, Error>({
    queryKey: ["dashboard", "provider", prestataireId],
    queryFn: () => {
      console.log("Fetching dashboard for prestataireId:", prestataireId);
      return getProviderDashboard(prestataireId ?? "");
    },
    enabled: Boolean(prestataireId),
  });
}
