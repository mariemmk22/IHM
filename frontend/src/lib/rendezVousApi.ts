import { authFetch } from "@/lib/api";

export interface ClientRendezVousDto {
  id: string | number;
  dateRdv: string;
  heureRdv: string;
  adresseIntervention: string;
  description?: string;
  statut: "en_attente" | "accepte" | "annule";
  providerSpecialite?: string;
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
    telephone?: string;
    region?: string;
  } | null;
}

export interface ProviderAppointmentDto {
  id: string | number;
  dateRdv: string;
  heureRdv: string;
  adresseIntervention: string;
  description?: string;
  statut: "en_attente" | "accepte" | "annule";
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
    telephone?: string;
    region?: string;
  } | null;
}

export async function getClientRendezVous(clientId: string | number) {
  return authFetch<ClientRendezVousDto[]>(`/rendez-vous/client/${clientId}`, { method: "GET" });
}

export async function createClientRendezVous(payload: {
  serviceId: string | number;
  dateRdv: string;
  heureRdv: string;
  adresseIntervention: string;
  description?: string;
}) {
  return authFetch<{ message: string; rendezVous: ClientRendezVousDto }>("/rendez-vous", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getPrestataireRendezVous(prestataireId: string | number) {
  return authFetch<ProviderAppointmentDto[]>(`/rendez-vous/prestataire/${prestataireId}`, { method: "GET" });
}

export async function updateRendezVousStatus(
  id: string | number,
  statut: "en_attente" | "accepte" | "annule",
) {
  return authFetch<{ message: string; rendezVous: { id: number; statut: string } }>(`/rendez-vous/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ statut }),
  });
}
