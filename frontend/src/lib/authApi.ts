import type { AuthUser } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface LoginParams {
  email: string;
  motDePasse: string;
}

export interface RegisterClientParams {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  region?: string;
  adresse?: string;
}

export interface RegisterProviderParams extends RegisterClientParams {
  specialite: string;
  description?: string;
}

export async function login(payload: LoginParams) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerClient(payload: RegisterClientParams) {
  return apiFetch<AuthResponse>("/auth/register-client", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerProvider(payload: RegisterProviderParams) {
  return apiFetch<AuthResponse>("/auth/register-prestataire", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
