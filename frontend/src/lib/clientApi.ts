import type { AuthUser } from "@/context/AuthContext";
import { authFetch } from "@/lib/api";

export interface UpdateClientProfilePayload {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  region?: string;
}

interface UpdateClientProfileResponse {
  message: string;
  client: Partial<AuthUser>;
}

export async function updateClientProfile(
  clientId: string | number,
  payload: UpdateClientProfilePayload
) {
  return authFetch<UpdateClientProfileResponse>(`/clients/${clientId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
