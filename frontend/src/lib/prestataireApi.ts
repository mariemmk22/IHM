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
  return authFetch<{ message: string }>(`/prestataires/${id}`, { method: "DELETE" });
}

export interface DocumentDto {
  id: number;
  fichier: string;
  dateDepot: string;
  statut: "en_attente" | "accepte" | "refuse";
  prestataireId: number;
}

export async function uploadPrestataireDocument(
  prestataireId: string | number,
  file: File,
  tokenOverride?: string,
): Promise<{ message: string; document: DocumentDto }> {
  const formData = new FormData();
  formData.append("cv", file);
  formData.append("prestataireId", String(prestataireId));

  const token = tokenOverride ?? sessionStorage.getItem("servidom_token");
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:5000/api";

  const response = await fetch(`${base}/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? "Erreur upload CV");
  }

  return response.json();
}