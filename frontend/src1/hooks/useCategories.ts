import { useQuery } from "@tanstack/react-query";
import { getCategories, CategoryDto } from "@/lib/categoryApi";

export function useCategories() {
  return useQuery<CategoryDto[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}
