import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Star,
  LogOut,
  Clock,
  Heart as HeartIcon,
  MessageSquare,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { createAvis, getMyAvis, type ClientAvisDto } from "@/lib/avisApi";
import { getClientRendezVous, type ClientRendezVousDto } from "@/lib/rendezVousApi";
import { type DashboardAppointmentDto } from "@/lib/dashboardApi";
import { toast } from "sonner";

interface ReviewFormState {
  rendezVousId: string;
  rating: number;
  comment: string;
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

function Badge({ children, color = "#6366f1" }: { children: React.ReactNode; color?: string }) {
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
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
  const { user, logout } = useAuth();
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
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [appointmentsFilter, setAppointmentsFilter] = useState("all");
  const [reviewsFilter, setReviewsFilter] = useState("all");
  const [settingsFilter, setSettingsFilter] = useState("all");
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [settingsPage, setSettingsPage] = useState(1);

  const pageSize = 4;

  const displayName = user?.prenom?.trim() || user?.nom?.trim() || "Client";
  const initials = `${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}`.trim() || "CL";

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!reviewForm.rendezVousId) {
        throw new Error("Sélectionnez un rendez-vous accepté");
      }

      return createAvis({
        rendezVousId: reviewForm.rendezVousId,
        nbstart: reviewForm.rating,
        comment: reviewForm.comment,
      });
    },
    onSuccess: () => {
      toast.success("Avis envoyé avec succès");
      setReviewForm({ rendezVousId: "", rating: 5, comment: "" });
      setIsReviewModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "client", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["rendez-vous", "client", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["avis", "me"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Impossible d'envoyer l'avis");
    },
  });

  const reviewedAppointmentIds = useMemo(
    () => new Set(clientAvis.map((avis) => String((avis as any).rendezVous?.id ?? (avis as any).rendezVousId ?? ""))),
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

  const settingsItems = useMemo(
    () => [
      {
        type: "notification",
        title: "Notifications",
        description: "Recevoir des notifications pour les confirmations de rendez-vous",
        control: (
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked style={{ cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: "#6b7280" }}>Activer les notifications</span>
          </label>
        ),
      },
      {
        type: "privacy",
        title: "Confidentialité",
        description: "Contrôler qui peut voir votre profil",
        control: (
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked style={{ cursor: "pointer" }} />
            <span style={{ fontSize: 12, color: "#6b7280" }}>Profil visible publiquement</span>
          </label>
        ),
      },
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
    []
  );

  const filteredSettings = useMemo(() => {
    if (settingsFilter === "all") return settingsItems;
    return settingsItems.filter((item) => item.type === settingsFilter);
  }, [settingsItems, settingsFilter]);

  const paginatedAppointments = paginate(filteredAppointments, appointmentsPage, pageSize);
  const paginatedReviews = paginate(filteredReviews, reviewsPage, pageSize);
  const paginatedSettings = paginate(filteredSettings, settingsPage, 2);

  const appointmentsTotalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize));
  const reviewsTotalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const settingsTotalPages = Math.max(1, Math.ceil(filteredSettings.length / 2));



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

        .stat-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 2px 16px rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
          min-width: 0;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.14);
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
          .card, .stat-card { border-radius: 16px; }
          .btn-primary { padding: 9px 14px; font-size: 13px; }
        }
      `}</style>

      <Navbar />

      <main style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "24px 16px 40px" }}>
        {/* <section style={{ marginBottom: 28 }}>
          {dashboardQuery.isLoading && !dashboardData ? (
            <div style={{ padding: 22 }}>Chargement du tableau de bord...</div>
          ) : null}

        </section> */}

        <section style={{ marginBottom: 28 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
              <Avatar initials={`${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}` || "CL"} size="lg" gradient />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: "#1e1b4b" }}>{displayName}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Client ServiDom</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
                  {user?.email && <div style={{ color: "#6b7280" }}>📧 {user.email}</div>}
                  {user?.telephone && <div style={{ color: "#6b7280" }}>📞 {user.telephone}</div>}
                  {user?.region && <div style={{ color: "#6b7280" }}>📍 {user.region}</div>}
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  toast.success("Déconnexion réussie");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(239,68,68,0.2)",
                  background: "white",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
              Soyez assuré de bénéficier des meilleurs services. Explorez nos prestataires de confiance et réservez facilement vos rendez-vous.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Avis</h2>
            <button className="btn-primary" onClick={() => setIsReviewModalOpen(true)}>
              <MessageSquare size={16} />
              Déposer un avis
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20, alignItems: "start" }}>
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
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
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="card" style={{ padding: 22, textAlign: "center", color: "#6b7280", boxShadow: "none", background: "rgba(255,255,255,0.7)" }}>
                    Aucun rendez-vous pour ce filtre.
                  </div>
                )}
              </div>

              <Pagination page={appointmentsPage} totalPages={appointmentsTotalPages} onChange={setAppointmentsPage} />
            </div>

            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
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
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <Avatar
                            initials={review.prestataire ? `${review.prestataire.prenom?.[0] ?? ""}${review.prestataire.nom?.[0] ?? ""}`.trim() || "PR" : "PR"}
                            size="md"
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
                              {review.service?.nomService ?? "Service"}
                            </div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                              {review.prestataire ? `${review.prestataire.prenom} ${review.prestataire.nom}` : "Prestataire"}
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
                      </div>
                      {review.comment && (
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#4b5563", marginTop: 10 }}>
                          "{review.comment}"
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="card" style={{ padding: 22, textAlign: "center", color: "#6b7280", boxShadow: "none", background: "rgba(255,255,255,0.7)" }}>
                    Aucun avis pour ce filtre.
                  </div>
                )}
              </div>

              <Pagination page={reviewsPage} totalPages={reviewsTotalPages} onChange={setReviewsPage} />
            </div>
          </div>
        </section>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Paramètres</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Filter size={14} color="#6366f1" />
              <select
                className="input-field"
                value={settingsFilter}
                onChange={(e) => {
                  setSettingsFilter(e.target.value);
                  setSettingsPage(1);
                }}
                style={{ width: 180, padding: "10px 12px" }}
              >
                <option value="all">Tous</option>
                <option value="notification">Notifications</option>
                <option value="privacy">Confidentialité</option>
                <option value="danger">Zone de danger</option>
              </select>
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {paginatedSettings.map((item, index) => (
                <div
                  key={item.type}
                  style={{
                    paddingBottom: index !== paginatedSettings.length - 1 ? 16 : 0,
                    borderBottom: index !== paginatedSettings.length - 1 ? "1px solid rgba(99,102,241,0.1)" : "none",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: item.type === "danger" ? "#ef4444" : "#1e1b4b" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{item.description}</div>
                  {item.control}
                </div>
              ))}
            </div>

            <Pagination page={settingsPage} totalPages={settingsTotalPages} onChange={setSettingsPage} />
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
                background: "rgba(15, 23, 42, 0.45)",
                zIndex: 90,
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(92vw, 620px)",
                maxHeight: "85vh",
                overflowY: "auto",
                zIndex: 100,
              }}
            >
              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 18, color: "#6366f1" }}>Déposer un avis</h3>
                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: "1px solid #e0e7ff",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6366f1",
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                      Service confirmé
                    </label>
                    <select
                      className="input-field"
                      value={reviewForm.rendezVousId}
                      onChange={(event) => setReviewForm({ ...reviewForm, rendezVousId: event.target.value })}
                    >
                      <option value="">Choisir un service déjà confirmé</option>
                      {reviewableAppointments.map((apt) => (
                        <option key={apt.id} value={apt.id}>
                          {apt.service?.nomService ?? "Service"} - {formatAppointmentDate(apt.dateRdv)}
                        </option>
                      ))}
                    </select>
                    {reviewableAppointments.length === 0 && (
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
                        Aucun service confirmé disponible pour un nouvel avis.
                      </div>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                        Note
                      </label>
                      <select
                        className="input-field"
                        value={reviewForm.rating}
                        onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <option key={value} value={value}>{value} / 5</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                        Aperçu
                      </label>
                      <div style={{ display: "flex", gap: 4, alignItems: "center", height: 44 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={20}
                            color={i <= reviewForm.rating ? "#f59e0b" : "#e0e7ff"}
                            fill={i <= reviewForm.rating ? "#f59e0b" : "none"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                      Votre avis
                    </label>
                    <textarea
                      className="input-field"
                      placeholder="Partagez votre expérience..."
                      value={reviewForm.comment}
                      onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
                      style={{ minHeight: 120, padding: "12px 16px", fontFamily: "inherit" }}
                    />
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => reviewMutation.mutate()}
                    disabled={reviewMutation.isPending || !reviewForm.rendezVousId}
                    style={{
                      opacity: reviewMutation.isPending || !reviewForm.rendezVousId ? 0.6 : 1,
                      cursor: reviewMutation.isPending || !reviewForm.rendezVousId ? "not-allowed" : "pointer",
                    }}
                  >
                    <MessageSquare size={16} />
                    {reviewMutation.isPending ? "Envoi en cours..." : "Envoyer mon avis"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
