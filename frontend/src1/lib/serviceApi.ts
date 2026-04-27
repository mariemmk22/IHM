import { apiFetch, authFetch } from "@/lib/api";

export interface ServiceDto {
  id: string;
  nomService: string;
  description: string;
  region: string;
  prix: number;
  prestataire?: {
    id: string;
    nom: string;
    prenom: string;
    specialite?: string;
  };
  sousCategorie?: {
    id: string;
    nom: string;
  };
}

export interface ServiceSearchParams {
  nomService?: string;
  region?: string;
}

export async function getServices(params: ServiceSearchParams = {}) {
  if (params.nomService || params.region) {
    return apiFetch<ServiceDto[]>("/services/search", { method: "GET" }, params);
  }

  return apiFetch<ServiceDto[]>("/services", { method: "GET" });
}

export async function getServiceById(id: string) {
  return apiFetch<ServiceDto>(`/services/${id}`, { method: "GET" });
}

export async function createService(payload: {
  nomService: string;
  description: string;
  region: string;
  prix: number;
  prestataireId: string | number;
  sousCategorieId: string | number;
}) {
  return authFetch<{ message: string; service: ServiceDto }>("/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
