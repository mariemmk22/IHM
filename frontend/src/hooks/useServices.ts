import { useQuery } from "@tanstack/react-query";
import { getServices, ServiceDto, ServiceSearchParams } from "@/lib/serviceApi";

export function useServices(params: ServiceSearchParams) {
  return useQuery<ServiceDto[], Error>({
    queryKey: ["services", params.nomService ?? "", params.region ?? ""],
    queryFn: () => getServices(params),
    keepPreviousData: true,
  });
}
