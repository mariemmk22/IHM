import { useQuery } from "@tanstack/react-query";
import { getPrestataires, PrestataireDto } from "@/lib/prestataireApi";

export function usePrestataires() {
  return useQuery<PrestataireDto[], Error>({
    queryKey: ["prestataires"],
    queryFn: getPrestataires,
  });
}
