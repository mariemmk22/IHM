import { apiFetch, authFetch } from "@/lib/api";

export type AdminUser = {
  id: string;
  rawId: number;
  clientId: number;
  name: string;
  email: string;
  role: "Client" | "Prestataire";
  status: "active" | "blocked";
  joined: string;
  specialite?: string | null;
  disponibilite?: boolean;
};

export type AdminDocument = {
  id: number;
  fichier: string;
  dateDepot: string;
  statut: "en_attente" | "accepte" | "refuse";
  prestataireId: number;
  prestataire?: {
    id: number;
    specialite: string;
    client?: {
      id: number;
      nom: string;
      prenom: string;
      email: string;
      telephone?: string;
      region?: string;
    };
  };
};

export type AdminService = {
  id: number;
  nomService: string;
  description?: string;
  region?: string;
  prix?: number;
  prestataire?: {
    id: number;
    nom: string;
    prenom: string;
    specialite?: string;
  };
  sousCategorie?: {
    id: number;
    nom: string;
  };
};

export type AdminAvis = {
  idAvis: number;
  dateAvis: string;
  rating: number;
  comment: string;
  client?: { nom: string; prenom: string } | null;
  prestataire?: { nom: string; prenom: string; specialite?: string } | null;
  service?: { nomService: string } | null;
};

// ── Users ──
export async function getAdminUsers() {
  return apiFetch<AdminUser[]>("/admin/users", { method: "GET" });
}

export async function blockClient(id: number) {
  return apiFetch(`/admin/clients/${id}/block`, { method: "PATCH" });
}

export async function blockPrestataire(id: number) {
  return apiFetch(`/admin/prestataires/${id}/block`, { method: "PATCH" });
}

export async function activatePrestataire(id: number) {
  return apiFetch(`/admin/prestataires/${id}/activate`, { method: "PATCH" });
}

// ── Documents ──
export async function getAllDocuments() {
  return authFetch<AdminDocument[]>("/documents", { method: "GET" });
}

export async function verifyDocument(documentId: number, statut: "accepte" | "refuse") {
  return authFetch<{ message: string; document: AdminDocument }>(`/documents/${documentId}/verify`, {
    method: "PUT",
    body: JSON.stringify({ statut }),
  });
}

// ── Services ──
export async function getAllServices() {
  return apiFetch<AdminService[]>("/services", { method: "GET" });
}

// ── Avis ──
export async function getAllAvis() {
  return apiFetch<AdminAvis[]>("/avis", { method: "GET" });
}

export async function deleteAvis(id: number) {
  return authFetch<{ message: string }>(`/avis/${id}`, { method: "DELETE" });
}
