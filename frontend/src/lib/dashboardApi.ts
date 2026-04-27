import { authFetch } from "@/lib/api";

export interface DashboardServiceDto {
  id: string;
  nomService: string;
  description: string;
  region: string;
  prix: number;
}

export interface DashboardAppointmentDto {
  id: string | number;
  dateRdv: string;
  heureRdv: string;
  adresseIntervention: string;
  statut: string;
  service: { nomService: string } | null;
  client?: { nom: string; prenom: string } | null;
  providerSpecialite?: string;
}

export interface DashboardReviewDto {
  idAvis: string | number;
  dateAvis: string;
  rating: number;
  comment: string;
  service: { nomService: string } | null;
  client: { nom: string; prenom: string } | null;
}

export interface ProviderDashboardDto {
  serviceCount: number;
  totalAppointments: number;
  averageRating: number | null;
  profileViews: number;
  recentServices: DashboardServiceDto[];
  recentAppointments: DashboardAppointmentDto[];
  recentReviews: DashboardReviewDto[];
  recommendedServices: DashboardServiceDto[];
}

export interface ClientDashboardDto {
  appointmentCount: number;
  pendingAppointments: number;
  reviewCount: number;
  favoriteCount: number;
  recentAppointments: DashboardAppointmentDto[];
  recommendedServices: DashboardServiceDto[];
}

export async function getProviderDashboard(prestataireId: string) {
  console.log("getProviderDashboard API call with ID:", prestataireId);
  const response = await authFetch<ProviderDashboardDto>(`/dashboard/provider/${prestataireId}`, { method: "GET" });
  console.log("getProviderDashboard response:", response);
  return response;
}

export async function getClientDashboard(clientId: string) {
  return authFetch<ClientDashboardDto>(`/dashboard/client/${clientId}`, { method: "GET" });
}
