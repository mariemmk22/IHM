import { apiFetch } from "@/lib/api";

export interface SubCategoryDto {
  id: string;
  nomSousCategorie: string;
  description?: string;
  categorieId: string;
}

export interface CategoryDto {
  id: string;
  nomCategorie: string;
  description?: string;
  sousCategories?: SubCategoryDto[];
}

export async function getCategories() {
  return apiFetch<CategoryDto[]>("/categories", { method: "GET" });
}

export async function getCategoryById(id: string) {
  return apiFetch<CategoryDto>(`/categories/${id}`, { method: "GET" });
}
