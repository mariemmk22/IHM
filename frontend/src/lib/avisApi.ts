import { authFetch, apiFetch } from "@/lib/api";

export interface ServiceAvisDto {
  idAvis: string | number;
  dateAvis: string;
  rating: number;
  comment: string;
  rendezVousId: string | number;
  service: {
    id: string | number;
    nomService: string;
    region: string;
    prix: number;
  } | null;
  client: {
    id: string | number;
    nom: string;
    prenom: string;
  } | null;
}

export interface ClientAvisDto {
  idAvis: string | number;
  dateAvis: string;
  rating: number;
  comment: string;
  rendezVousId: string | number;
  service: {
    id: string | number;
    nomService: string;
    region: string;
    prix: number;
  } | null;
  prestataire: {
    id: string | number;
    nom: string;
    prenom: string;
    specialite: string;
  } | null;
}

export interface ProviderAvisDto {
  idAvis: string | number;
  dateAvis: string;
  rating: number;
  comment: string;
  rendezVousId: string | number;
  service: {
    id: string | number;
    nomService: string;
    region: string;
    prix: number;
  } | null;
  client: {
    id: string | number;
    nom: string;
    prenom: string;
  } | null;
}

export async function getAvisByService(serviceId: string | number) {
  return apiFetch<ServiceAvisDto[]>(`/avis/service/${serviceId}`, { method: "GET" });
}

export async function getAvisByClient(clientId: string | number) {
  return apiFetch<ClientAvisDto[]>(`/avis/client/${clientId}`, { method: "GET" });
}

export async function getMyAvis() {
  return authFetch<ClientAvisDto[]>("/avis/me", { method: "GET" });
}

export async function getAvisByPrestataire(prestataireId: string | number) {
  return apiFetch<ProviderAvisDto[]>(`/avis/prestataire/${prestataireId}`, { method: "GET" });
}

export async function createAvis(payload: {
  rendezVousId: string | number;
  nbstart: number;
  comment: string;
}) {
  return authFetch<{ message: string; avis: ServiceAvisDto }>("/avis", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}