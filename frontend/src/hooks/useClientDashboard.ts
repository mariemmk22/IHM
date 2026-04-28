import { useQuery } from "@tanstack/react-query";
import { getClientDashboard, ClientDashboardDto } from "@/lib/dashboardApi";

export function useClientDashboard(clientId?: string) {
  return useQuery<ClientDashboardDto, Error>({
    queryKey: ["dashboard", "client", clientId],
    queryFn: () => getClientDashboard(clientId ?? ""),
    enabled: Boolean(clientId),
  });
}
