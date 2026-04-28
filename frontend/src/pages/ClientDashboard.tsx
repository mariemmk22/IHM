import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquare,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  UserCog,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { createAvis, getMyAvis, type ClientAvisDto } from "@/lib/avisApi";
import {
  getClientRendezVous,
  updateRendezVousStatus,
  type ClientRendezVousDto,
} from "@/lib/rendezVousApi";
import { type DashboardAppointmentDto } from "@/lib/dashboardApi";
import { updateClientProfile, type UpdateClientProfilePayload } from "@/lib/clientApi";
import { toast } from "sonner";

interface ReviewFormState {
  rendezVousId: string;
  rating: number;
  comment: string;
  editReviewId?: string | number | null;
}

interface ProfileFormState {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  region: string;
}

interface DashboardData {
  appointmentCount: number;
  favoriteCount: number;
  reviewCount: number;
  pendingAppointments: number;
  recentAppointments: DashboardAppointmentDto[];
}

const statusLabels = {
  en_attente: "En attente",
  accepte: "Accepté",
  annule: "Annulé",
};

function formatAppointmentDate(dateValue: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateValue);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(dateValue);

  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function Badge({
  children,
  color = "#6366f1",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: `${color}18`, color }}
    >
      {children}
    </span>
  );
}

function Avatar({
  initials,
  size = "md",
  gradient = false,
}: {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  gradient?: boolean;
}) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-24 h-24 text-2xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-2xl flex items-center justify-center font-bold flex-shrink-0`}
      style={
        gradient
          ? { background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)" }
          : { background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", color: "#4f46e5" }
      }
    >
      <span className={gradient ? "text-white" : ""}>{initials}</span>
    </div>
  );
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 16,
      }}
    >
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid #e0e7ff",
          background: "white",
          color: page === 1 ? "#9ca3af" : "#4f46e5",
          cursor: page === 1 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
        }}
      >
        <ChevronLeft size={16} /> Précédent
      </button>

      <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
        Page {page} / {totalPages}
      </div>

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid #e0e7ff",
          background: "white",
          color: page === totalPages ? "#9ca3af" : "#4f46e5",
          cursor: page === totalPages ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
        }}
      >
        Suivant <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function ClientDashboard() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const dashboardQuery = useClientDashboard(user?.id ?? undefined);
  const dashboardData = dashboardQuery.data as DashboardData | undefined;

  const appointmentsQuery = useQuery<ClientRendezVousDto[], Error>({
    queryKey: ["rendez-vous", "client", user?.id],
    queryFn: () => getClientRendezVous(user?.id ?? ""),
    enabled: Boolean(user?.id),
  });

  const clientAppointments =
    (appointmentsQuery.data ??
      (dashboardData?.recentAppointments as ClientRendezVousDto[] | undefined) ??
      []) as ClientRendezVousDto[];

  const { data: clientAvis = [] } = useQuery<ClientAvisDto[], Error>({
    queryKey: ["avis", "me"],
    queryFn: () => getMyAvis(),
    enabled: Boolean(user?.id),
  });

  const [reviewForm, setReviewForm] = useState<ReviewFormState>({
    rendezVousId: "",
    rating: 5,
    comment: "",
    editReviewId: null,
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    nom: user?.nom ?? "",
    prenom: user?.prenom ?? "",
    email: user?.email ?? "",
    telephone: user?.telephone ?? "",
    region: user?.region ?? "",
  });
  const [appointmentsFilter, setAppointmentsFilter] = useState("all");
  const [reviewsFilter, setReviewsFilter] = useState("all");
  const [settingsFilter, setSettingsFilter] = useState("all");
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);

  const pageSizeAppointments = 4;
  const pageSizeReviews = 3;

  const displayName = user?.prenom?.trim() || user?.nom?.trim() || "Client";

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!reviewForm.rendezVousId) {
        throw new Error("Sélectionnez un rendez-vous accepté");
      }

      if (reviewForm.editReviewId) {
        toast.info("Aucune API de modification d'avis n'a été fournie. Bouton UI ajouté.");
        return null;
      }

      return createAvis({
        rendezVousId: reviewForm.rendezVousId,
        nbstart: reviewForm.rating,
        comment: reviewForm.comment,
      });
    },
    onSuccess: () => {
      if (!reviewForm.editReviewId) {
        toast.success("Avis envoyé avec succès");
      }
      setReviewForm({
        rendezVousId: "",
        rating: 5,
        comment: "",
        editReviewId: null,
      });
      setIsReviewModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "client", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["rendez-vous", "client", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["avis", "me"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Impossible d'envoyer l'avis");
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: async (rendezVousId: string | number) => {
      return updateRendezVousStatus(rendezVousId, "annule");
    },
    onSuccess: () => {
      toast.success("Rendez-vous annulé avec succès");
      queryClient.invalidateQueries({ queryKey: ["dashboard", "client", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["rendez-vous", "client", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Impossible d'annuler le rendez-vous");
    },
  });

  const profileMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("Utilisateur non connecté");
      }

      const payload: UpdateClientProfilePayload = {
        nom: profileForm.nom.trim(),
        prenom: profileForm.prenom.trim(),
        email: profileForm.email.trim(),
        telephone: profileForm.telephone.trim(),
        region: profileForm.region.trim(),
      };

      return updateClientProfile(user.id, payload);
    },
    onSuccess: (result) => {
      const updatedClient = result?.client ?? {};

      updateUser({
        nom: typeof updatedClient.nom === "string" ? updatedClient.nom : profileForm.nom,
        prenom:
          typeof updatedClient.prenom === "string" ? updatedClient.prenom : profileForm.prenom,
        email: typeof updatedClient.email === "string" ? updatedClient.email : profileForm.email,
        telephone:
          typeof updatedClient.telephone === "string"
            ? updatedClient.telephone
            : profileForm.telephone,
        region: typeof updatedClient.region === "string" ? updatedClient.region : profileForm.region,
      });

      toast.success("Profil mis à jour avec succès");
      setIsProfileModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "client", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Impossible de mettre à jour le profil");
    },
  });

  const reviewedAppointmentIds = useMemo(
    () => new Set(clientAvis.map((avis) => String((avis as any).rendezVous?.id ?? avis.rendezVousId ?? ""))),
    [clientAvis]
  );

  const acceptedAppointments = useMemo(
    () => clientAppointments.filter((apt) => apt.statut === "accepte"),
    [clientAppointments]
  );

  const reviewableAppointments = useMemo(
    () => acceptedAppointments.filter((apt) => !reviewedAppointmentIds.has(String(apt.id))),
    [acceptedAppointments, reviewedAppointmentIds]
  );

  const filteredAppointments = useMemo(() => {
    if (appointmentsFilter === "all") return clientAppointments;
    return clientAppointments.filter((apt) => apt.statut === appointmentsFilter);
  }, [clientAppointments, appointmentsFilter]);

  const filteredReviews = useMemo(() => {
    if (reviewsFilter === "all") return clientAvis;
    const target = Number(reviewsFilter);
    return clientAvis.filter((review) => review.rating === target);
  }, [clientAvis, reviewsFilter]);

  const openProfileModal = () => {
    setProfileForm({
      nom: user?.nom ?? "",
      prenom: user?.prenom ?? "",
      email: user?.email ?? "",
      telephone: user?.telephone ?? "",
      region: user?.region ?? "",
    });
    setIsProfileModalOpen(true);
  };

  const settingsItems = useMemo(
    () => [
       
      {
        type: "danger",
        title: "Zone de danger",
        description: "Supprimer définitivement votre compte",
        control: (
          <button
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "1.5px solid #ef4444",
              background: "transparent",
              color: "#ef4444",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Supprimer mon compte
          </button>
        ),
      },
    ],
    [openProfileModal]
  );

  const filteredSettings = useMemo(() => {
    if (settingsFilter === "all") return settingsItems;
    return settingsItems.filter((item) => item.type === settingsFilter);
  }, [settingsItems, settingsFilter]);

  const paginatedAppointments = paginate(filteredAppointments, appointmentsPage, pageSizeAppointments);
  const paginatedReviews = paginate(filteredReviews, reviewsPage, pageSizeReviews);

  const appointmentsTotalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / pageSizeAppointments)
  );
  const reviewsTotalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSizeReviews));

  const openCreateReviewModal = () => {
    setReviewForm({
      rendezVousId: "",
      rating: 5,
      comment: "",
      editReviewId: null,
    });
    setIsReviewModalOpen(true);
  };

  const openEditReviewModal = (review: ClientAvisDto) => {
    setReviewForm({
      rendezVousId: String(review.rendezVousId ?? ""),
      rating: review.rating,
      comment: review.comment ?? "",
      editReviewId: review.idAvis,
    });
    setIsReviewModalOpen(true);
  };

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf2f8 100%)",
        color: "#1e1b4b",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; max-width: 100%; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }

        .card {
          background: rgba(255,255,255,0.84);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.92);
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04);
          min-width: 0;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
          white-space: nowrap;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
        }

        .btn-secondary {
          background: white;
          color: #4f46e5;
          border: 1px solid #dbe4ff;
          border-radius: 12px;
          padding: 9px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-danger-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid #fecaca;
          background: #fff5f5;
          color: #ef4444;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-danger-icon:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-field {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #e0e7ff;
          background: #fafafe;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: inherit;
          color: #1e1b4b;
        }

        .input-field:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1e1b4b;
        }

        @media (max-width: 768px) {
          .card { border-radius: 16px; }
          .btn-primary { padding: 9px 14px; font-size: 13px; }
        }
      `}</style>

      <Navbar />

      <main style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "40px 250px" }}>
        <section style={{ marginBottom: 28 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
              <Avatar initials={`${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}` || "CL"} size="lg" gradient />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: "#1e1b4b" }}>
                  {displayName}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
                  {user?.email && <div style={{ color: "#6b7280" }}>📧 {user.email}</div>}
                  {user?.telephone && <div style={{ color: "#6b7280" }}>📞 {user.telephone}</div>}
                  {user?.region && <div style={{ color: "#6b7280" }}>📍 {user.region}</div>}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={openProfileModal}
              >
                <UserCog size={16} />
                Modifier profil
              </button>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <button className="btn-primary" onClick={openCreateReviewModal}>
              <MessageSquare size={16} />
              Déposer un avis
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "stretch",
            }}
          >
            <div className="card" style={{ padding: 22 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Mes rendez-vous</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Filter size={14} color="#6366f1" />
                  <select
                    className="input-field"
                    value={appointmentsFilter}
                    onChange={(e) => {
                      setAppointmentsFilter(e.target.value);
                      setAppointmentsPage(1);
                    }}
                    style={{ width: 160, padding: "10px 12px" }}
                  >
                    <option value="all">Tous</option>
                    <option value="accepte">Acceptés</option>
                    <option value="en_attente">En attente</option>
                    <option value="annule">Annulés</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map((apt, i) => (
                    <motion.div
                      key={apt.id}
                      className="card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ padding: "18px 18px", boxShadow: "none", background: "rgba(255,255,255,0.7)" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <Avatar initials={apt.service?.nomService?.[0]?.toUpperCase() ?? "RD"} size="md" />

                        <div style={{ flex: 1, minWidth: 180 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
                            {apt.service?.nomService ?? "Service"}
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>{apt.adresseIntervention}</div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#6366f1" }}>
                            {formatAppointmentDate(apt.dateRdv)} {apt.heureRdv ? `• ${apt.heureRdv}` : ""}
                          </div>
                          <Badge
                            color={
                              apt.statut === "accepte"
                                ? "#10b981"
                                : apt.statut === "en_attente"
                                ? "#f59e0b"
                                : "#ef4444"
                            }
                          >
                            {statusLabels[apt.statut as keyof typeof statusLabels]}
                          </Badge>
                        </div>

                        <button
                          className="btn-danger-icon"
                          title="Supprimer / annuler le rendez-vous"
                          onClick={() => cancelAppointmentMutation.mutate(apt.id)}
                          disabled={cancelAppointmentMutation.isPending || apt.statut === "annule"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div
                    className="card"
                    style={{
                      padding: 22,
                      textAlign: "center",
                      color: "#6b7280",
                      boxShadow: "none",
                      background: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Aucun rendez-vous pour ce filtre.
                  </div>
                )}
              </div>

              <Pagination
                page={appointmentsPage}
                totalPages={appointmentsTotalPages}
                onChange={setAppointmentsPage}
              />
            </div>

            <div className="card" style={{ padding: 22 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Mes avis</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Filter size={14} color="#6366f1" />
                  <select
                    className="input-field"
                    value={reviewsFilter}
                    onChange={(e) => {
                      setReviewsFilter(e.target.value);
                      setReviewsPage(1);
                    }}
                    style={{ width: 160, padding: "10px 12px" }}
                  >
                    <option value="all">Toutes les notes</option>
                    <option value="5">5 étoiles</option>
                    <option value="4">4 étoiles</option>
                    <option value="3">3 étoiles</option>
                    <option value="2">2 étoiles</option>
                    <option value="1">1 étoile</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {paginatedReviews.length > 0 ? (
                  paginatedReviews.map((review, i) => (
                    <motion.div
                      key={review.idAvis}
                      className="card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{ padding: "18px 18px", boxShadow: "none", background: "rgba(255,255,255,0.7)" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar
                            initials={
                              review.prestataire
                                ? `${review.prestataire.prenom?.[0] ?? ""}${review.prestataire.nom?.[0] ?? ""}`.trim() || "PR"
                                : "PR"
                            }
                            size="md"
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                              {review.service?.nomService ?? "Service"}
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                              {review.prestataire
                                ? `${review.prestataire.prenom} ${review.prestataire.nom}`
                                : "Prestataire"}
                            </div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                              {new Date(review.dateAvis).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                size={14}
                                color={index < review.rating ? "#f59e0b" : "#e0e7ff"}
                                fill={index < review.rating ? "#f59e0b" : "none"}
                              />
                            ))}
                          </div>
                          <button
                            className="btn-secondary"
                            onClick={() => openEditReviewModal(review)}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Pencil size={15} />

                          </button>
                        </div>
                      </div>

                      {review.comment && (
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#4b5563", marginTop: 10 }}>
                          "{review.comment}"
                        </p>
                      )}

                      
                    </motion.div>
                  ))
                ) : (
                  <div
                    className="card"
                    style={{
                      padding: 22,
                      textAlign: "center",
                      color: "#6b7280",
                      boxShadow: "none",
                      background: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Aucun avis pour ce filtre.
                  </div>
                )}
              </div>

              <Pagination
                page={reviewsPage}
                totalPages={reviewsTotalPages}
                onChange={setReviewsPage}
              />
            </div>
          </div>
        </section>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <h2 className="section-title" style={{ marginBottom: 0 }}>Paramètres</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }} />
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredSettings.map((item, index) => (
                <div
                  key={item.type}
                  style={{
                    paddingBottom: index !== filteredSettings.length - 1 ? 16 : 0,
                    borderBottom:
                      index !== filteredSettings.length - 1
                        ? "1px solid rgba(99,102,241,0.1)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      marginBottom: 6,
                      color: item.type === "danger" ? "#ef4444" : "#1e1b4b",
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                    {item.description}
                  </div>
                  {item.control}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isReviewModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.5)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 90,
              }}
            />

            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                pointerEvents: "none",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                onClick={(event) => event.stopPropagation()}
                className="card"
                style={{
                  width: "min(100%, 640px)",
                  maxHeight: "min(88vh, 760px)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "18px 20px",
                    borderBottom: "1px solid rgba(99,102,241,0.12)",
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, color: "#6366f1", marginBottom: 4 }}>
                      {reviewForm.editReviewId ? "Modifier un avis" : "Déposer un avis"}
                    </h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>
                      {reviewForm.editReviewId
                        ? "Mettez à jour votre avis."
                        : "Sélectionnez un service confirmé puis partagez votre expérience."}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      border: "1px solid #e0e7ff",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6366f1",
                      flexShrink: 0,
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div
                  style={{
                    padding: 20,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6b7280",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Service confirmé
                    </label>
                    <select
                      className="input-field"
                      value={reviewForm.rendezVousId}
                      onChange={(event) =>
                        setReviewForm({ ...reviewForm, rendezVousId: event.target.value })
                      }
                      disabled={Boolean(reviewForm.editReviewId)}
                    >
                      <option value="">Choisir un service déjà confirmé</option>
                      {reviewableAppointments.map((apt) => (
                        <option key={apt.id} value={apt.id}>
                          {apt.service?.nomService ?? "Service"} - {formatAppointmentDate(apt.dateRdv)}
                        </option>
                      ))}
                    </select>

                    {!reviewForm.editReviewId && reviewableAppointments.length === 0 && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          marginTop: 8,
                          padding: 12,
                          borderRadius: 12,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        Aucun service confirmé disponible pour un nouvel avis.
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 16,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#6b7280",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Note
                      </label>
                      <select
                        className="input-field"
                        value={reviewForm.rating}
                        onChange={(event) =>
                          setReviewForm({ ...reviewForm, rating: Number(event.target.value) })
                        }
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <option key={value} value={value}>
                            {value} / 5
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#6b7280",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Aperçu
                      </label>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                          minHeight: 46,
                          padding: "0 4px",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={22}
                            color={i <= reviewForm.rating ? "#f59e0b" : "#e0e7ff"}
                            fill={i <= reviewForm.rating ? "#f59e0b" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6b7280",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Votre avis
                    </label>
                    <textarea
                      className="input-field"
                      placeholder="Partagez votre expérience..."
                      value={reviewForm.comment}
                      onChange={(event) =>
                        setReviewForm({ ...reviewForm, comment: event.target.value })
                      }
                      style={{
                        minHeight: 140,
                        padding: "12px 16px",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 12,
                    padding: "16px 20px 20px",
                    borderTop: "1px solid rgba(99,102,241,0.12)",
                    background: "rgba(255,255,255,0.92)",
                    flexShrink: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1px solid #dbe4ff",
                      background: "white",
                      color: "#4f46e5",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Annuler
                  </button>

                  <button
                    className="btn-primary"
                    onClick={() => reviewMutation.mutate()}
                    disabled={reviewMutation.isPending || !reviewForm.rendezVousId}
                    style={{
                      opacity: reviewMutation.isPending || !reviewForm.rendezVousId ? 0.6 : 1,
                      cursor:
                        reviewMutation.isPending || !reviewForm.rendezVousId
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    <MessageSquare size={16} />
                    {reviewMutation.isPending
                      ? "Envoi en cours..."
                      : reviewForm.editReviewId
                      ? "Enregistrer les modifications"
                      : "Envoyer mon avis"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.5)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 90,
              }}
            />

            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                pointerEvents: "none",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                onClick={(event) => event.stopPropagation()}
                className="card"
                style={{
                  width: "min(100%, 620px)",
                  maxHeight: "min(88vh, 760px)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  pointerEvents: "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "18px 20px",
                    borderBottom: "1px solid rgba(99,102,241,0.12)",
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    flexShrink: 0,
                  }}
                >
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, color: "#6366f1", marginBottom: 4 }}>
                      Modifier le profil
                    </h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>
                      Mettez à jour vos informations puis enregistrez.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsProfileModalOpen(false)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      border: "1px solid #e0e7ff",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6366f1",
                      flexShrink: 0,
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div
                  style={{
                    padding: 20,
                    overflowY: "auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                  }}
                >
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                      Nom
                    </label>
                    <input
                      className="input-field"
                      value={profileForm.nom}
                      onChange={(event) => setProfileForm({ ...profileForm, nom: event.target.value })}
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                      Prénom
                    </label>
                    <input
                      className="input-field"
                      value={profileForm.prenom}
                      onChange={(event) => setProfileForm({ ...profileForm, prenom: event.target.value })}
                      placeholder="Votre prénom"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                      Email
                    </label>
                    <input
                      className="input-field"
                      type="email"
                      value={profileForm.email}
                      onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                      placeholder="exemple@email.com"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                      Téléphone
                    </label>
                    <input
                      className="input-field"
                      value={profileForm.telephone}
                      onChange={(event) => setProfileForm({ ...profileForm, telephone: event.target.value })}
                      placeholder="Votre numéro"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                      Région
                    </label>
                    <input
                      className="input-field"
                      value={profileForm.region}
                      onChange={(event) => setProfileForm({ ...profileForm, region: event.target.value })}
                      placeholder="Votre région"
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 12,
                    padding: "16px 20px 20px",
                    borderTop: "1px solid rgba(99,102,241,0.12)",
                    background: "rgba(255,255,255,0.92)",
                    flexShrink: 0,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => setIsProfileModalOpen(false)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1px solid #dbe4ff",
                      background: "white",
                      color: "#4f46e5",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Annuler
                  </button>

                  <button
                    className="btn-primary"
                    onClick={() => profileMutation.mutate()}
                    disabled={
                      profileMutation.isPending ||
                      !profileForm.nom.trim() ||
                      !profileForm.prenom.trim() ||
                      !profileForm.email.trim()
                    }
                    style={{
                      opacity:
                        profileMutation.isPending ||
                        !profileForm.nom.trim() ||
                        !profileForm.prenom.trim() ||
                        !profileForm.email.trim()
                          ? 0.6
                          : 1,
                      cursor:
                        profileMutation.isPending ||
                        !profileForm.nom.trim() ||
                        !profileForm.prenom.trim() ||
                        !profileForm.email.trim()
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    <UserCog size={16} />
                    {profileMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}