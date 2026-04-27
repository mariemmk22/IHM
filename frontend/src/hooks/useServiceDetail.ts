import { useQuery } from "@tanstack/react-query";
import { getServiceById, ServiceDto } from "@/lib/serviceApi";

export function useServiceDetail(id: string | undefined) {
  return useQuery<ServiceDto, Error>({
    queryKey: ["service", id],
    queryFn: () => getServiceById(id ?? ""),
    enabled: Boolean(id),
  });
}
