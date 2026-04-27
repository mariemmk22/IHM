import { authFetch } from "@/lib/api";

export interface ProviderDocumentDto {
  id: string | number;
  fichier: string;
  dateDepot: string;
  statut: "en_attente" | "accepte" | "refuse";
  prestataireId: string | number;
}

export async function getPrestataireDocuments(prestataireId: string | number) {
  return authFetch<ProviderDocumentDto[]>(`/documents/prestataire/${prestataireId}`, { method: "GET" });
}

export async function createProviderDocument(payload: {
  fichier: string;
  prestataireId: string | number;
}) {
  return authFetch<{ message: string; document: ProviderDocumentDto }>("/documents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
