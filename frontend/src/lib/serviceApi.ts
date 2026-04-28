import { apiFetch, authFetch } from "@/lib/api";

export interface ServiceDto {
  id: string;
  nomService: string;
  description: string;
  region: string;
  prix: number;
  prestataire?: {
    id: string;
    nom?: string;
    prenom?: string;
    specialite?: string;
    disponibilite?: boolean;
    client?: {
      nom?: string;
      prenom?: string;
    };
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

export async function getServicesByPrestataire(prestataireId: string | number) {
  return authFetch<ServiceDto[]>(`/services/prestataire/${prestataireId}`, { method: "GET" });
}

export async function createService(payload: {
  nomService: string;
  description: string;
  region: string;
  prix: number;
  prestataireId: string | number;
  sousCategorieId: string | number;
}) {
  // Ensure IDs are sent as numbers or strings consistently
  return authFetch<{ message: string; service: ServiceDto }>("/services", {
    method: "POST",
    body: JSON.stringify({
      nomService: payload.nomService,
      description: payload.description,
      region: payload.region,
      prix: payload.prix,
      prestataireId: payload.prestataireId ? Number(payload.prestataireId) : undefined,
      sousCategorieId: payload.sousCategorieId ? Number(payload.sousCategorieId) : undefined,
    }),
  });
}
