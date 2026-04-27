import { authFetch, apiFetch } from "@/lib/api";
import type { AuthUser } from "@/context/AuthContext";

export interface PrestataireDto {
  id: string;
  clientId: number;
  specialite: string;
  description?: string;
  disponibilite: boolean;
  client?: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    region?: string;
    adresse?: string;
    statutCompte?: string;
  };
  services?: unknown[];
}

export async function getPrestataires() {
  return apiFetch<PrestataireDto[]>("/prestataires", { method: "GET" });
}

export async function getPrestataire(id: string) {
  return apiFetch<PrestataireDto>(`/prestataires/${id}`, { method: "GET" });
}

export async function createPrestataire(payload: {
  clientId: string | number;
  specialite: string;
  description: string;
  disponibilite: boolean;
}) {
  return authFetch<{ message: string; token: string; user: AuthUser; prestataire: PrestataireDto }>("/prestataires", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePrestataire(
  id: string | number,
  payload: { specialite: string; description: string; disponibilite: boolean },
) {
  return authFetch<{ message: string; prestataire: PrestataireDto }>(`/prestataires/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updatePrestataireDisponibilite(id: string | number, disponibilite: boolean) {
  return authFetch<{ message: string; prestataire: PrestataireDto }>(`/prestataires/${id}/disponibilite`, {
    method: "PATCH",
    body: JSON.stringify({ disponibilite }),
  });
}

export async function deletePrestataire(id: string | number) {
  return authFetch<{ message: string }>(`/prestataires/${id}`, {
    method: "DELETE",
  });
}
