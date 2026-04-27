import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Camera,
  Plus,
  Trash2,
  TrendingUp,
  Calendar,
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  BarChart3,
  Settings,
  Bell,
  ChevronRight,
  Zap,
  Shield,
  Heart,
  Briefcase,
  X,
  Save,
  User,
  LogOut,
  Home,
  Menu,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { useCategories } from "@/hooks/useCategories";
import { createService, getServicesByPrestataire, type ServiceDto } from "@/lib/serviceApi";
import { getPrestataireRendezVous, updateRendezVousStatus, type ProviderAppointmentDto } from "@/lib/rendezVousApi";
import { getAvisByPrestataire, type ProviderAvisDto } from "@/lib/avisApi";
import type { AuthUser } from "@/context/AuthContext";
import type {
  DashboardReviewDto,
  DashboardServiceDto,
  ProviderDashboardDto,
} from "@/lib/dashboardApi";
import { toast } from "sonner";

const DEFAULT_PROVIDER = {
  name: "Prestataire",
  title: "Prestataire professionnel",
  avatar: "PR",
  bio: "Professionnel certifié proposant des interventions soignées et un service transparent.",
  rating: 4.9,
  reviews: 127,
  completedJobs: 342,
  responseTime: "< 30 min",
  location: "Tunis, Tunisie",
  phone: "+216 22 345 678",
  email: "karim.mansouri@email.com",
  memberSince: "2021",
  verified: true,
  badge: "Top Prestataire",
};



const SERVICES = [
  { id: 1, name: "Plomberie d'urgence", price: "80 DT/h", category: "Plomberie", active: true, bookings: 89 },
  { id: 2, name: "Installation électrique", price: "95 DT/h", category: "Électricité", active: true, bookings: 74 },
  { id: 3, name: "Débouchage canalisation", price: "60 DT", category: "Plomberie", active: true, bookings: 112 },
  { id: 4, name: "Tableau électrique", price: "150 DT", category: "Électricité", active: false, bookings: 23 },
];

const REVIEWS = [
  { id: 1, client: "Amine B.", rating: 5, comment: "Travail impeccable, rapide et propre. Je recommande vivement !", date: "Il y a 2 jours", avatar: "AB" },
  { id: 2, client: "Sana K.", rating: 5, comment: "Très professionnel, est arrivé à l'heure et a résolu le problème en moins d'une heure.", date: "Il y a 5 jours", avatar: "SK" },
  { id: 3, client: "Rania F.", rating: 4, comment: "Bon travail, tarifs raisonnables. Reviendrai si besoin.", date: "Il y a 1 semaine", avatar: "RF" },
];

const TABS = [
  { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
  { id: "profile", label: "Mon Profil", icon: User },
  { id: "services", label: "Mes Services", icon: Briefcase },
  { id: "appointments", label: "Rendez-vous", icon: Calendar },
  { id: "reviews", label: "Avis clients", icon: MessageSquare },
];

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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    en_attente: { label: "En attente", color: "#f59e0b" },
    accepte: { label: "Confirmé", color: "#10b981" },
    annule: { label: "Annulé", color: "#ef4444" },
    confirmed: { label: "Confirmé", color: "#10b981" },
    pending: { label: "En attente", color: "#f59e0b" },
    cancelled: { label: "Annulé", color: "#ef4444" },
  };
  const s = map[status] ?? { label: status, color: "#6b7280" };
  return <Badge color={s.color}>{s.label}</Badge>;
}

function formatAppointmentDate(dateValue: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateValue);
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
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
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-24 h-24 text-2xl" };
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

interface ProfileData {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  responseTime: string;
  location: string;
  phone: string;
  email: string;
  memberSince: string;
  verified: boolean;
  badge: string;
}

interface ProfileTabProps {
  data: ProfileData;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: string) => void;
  isMobile: boolean;
}

interface ServiceFormState {
  nomService: string;
  description: string;
  region: string;
  prix: string;
  categorieId: string;
  sousCategorieId: string;
}

interface DashboardTabProps {
  dashboardData?: ProviderDashboardDto;
  isLoading: boolean;
  firstName: string;
  appointments: ProviderAppointmentDto[];
  profileData: ProfileData;
}

interface ServicesTabProps {
  isMobile: boolean;
  prestataireId?: string;
  services: DashboardServiceDto[];
  onServiceCreated: () => void;
}

interface AppointmentsTabProps {
  isMobile: boolean;
  appointments: ProviderAppointmentDto[];
  onUpdateStatus: (appointmentId: string | number, status: "accepte" | "annule") => void;
  loadingAppointmentId?: string | number | null;
}

interface ReviewsTabProps {
  reviews: DashboardReviewDto[];
}

function buildProfileData(userName: string, user: AuthUser | null): ProfileData {
  const fullName = [user?.prenom, user?.nom].filter(Boolean).join(" ").trim();
  const initials = `${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}`.trim().toUpperCase() || DEFAULT_PROVIDER.avatar;

  return {
    ...DEFAULT_PROVIDER,
    avatar: initials,
    name: fullName || userName || DEFAULT_PROVIDER.name,
    title: user?.specialite || DEFAULT_PROVIDER.title,
    bio: user?.description || DEFAULT_PROVIDER.bio,
    location: user?.region || DEFAULT_PROVIDER.location,
    phone: user?.telephone || DEFAULT_PROVIDER.phone,
    email: user?.email || DEFAULT_PROVIDER.email,
  };
}

export default function ProviderDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dashboardQuery = useProviderDashboard(user?.prestataireId ?? undefined);
  const dashboardData = dashboardQuery.data;
  const appointmentsQuery = useQuery<ProviderAppointmentDto[], Error>({
    queryKey: ["rendez-vous", "prestataire", user?.prestataireId],
    queryFn: () => getPrestataireRendezVous(user?.prestataireId ?? ""),
    enabled: Boolean(user?.prestataireId),
  });
  const appointmentsData = appointmentsQuery.data ?? [];
  const providerServicesQuery = useQuery<ServiceDto[], Error>({
    queryKey: ["services", "prestataire", user?.prestataireId],
    queryFn: () => getServicesByPrestataire(user?.prestataireId ?? ""),
    enabled: Boolean(user?.prestataireId),
  });
  
  const { data: providerAvis = [] } = useQuery<ProviderAvisDto[], Error>({
    queryKey: ["avis", "prestataire", user?.prestataireId],
    queryFn: () => getAvisByPrestataire(user?.prestataireId ?? ""),
    enabled: Boolean(user?.prestataireId),
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string | number; status: "accepte" | "annule" }) =>
      updateRendezVousStatus(appointmentId, status),
    onSuccess: () => {
      toast.success("Statut du rendez-vous mis à jour");
      queryClient.invalidateQueries({ queryKey: ["rendez-vous", "prestataire", user?.prestataireId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "provider", user?.prestataireId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Impossible de mettre à jour le rendez-vous");
    },
  });

  const reviewsData: DashboardReviewDto[] = providerAvis.length > 0 
    ? providerAvis.map((avis) => ({
        idAvis: avis.idAvis,
        dateAvis: avis.dateAvis,
        rating: avis.rating,
        comment: avis.comment,
        service: avis.service ? { nomService: avis.service.nomService } : null,
        client: avis.client ? { nom: avis.client.nom, prenom: avis.client.prenom } : null,
      }))
    : (dashboardData?.recentReviews ?? REVIEWS.map((review) => ({
        idAvis: review.id,
        dateAvis: review.date,
        rating: review.rating,
        comment: review.comment,
        service: { nomService: "Service" },
        client: { nom: review.client, prenom: "" },
      })));
  const providerServices = providerServicesQuery.data ?? dashboardData?.recentServices ?? [];

  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(() => buildProfileData(user?.prenom ?? "Prestataire", user));
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setProfileData(buildProfileData(user?.prenom ?? "Prestataire", user));
  }, [user]);

  const welcomeName = user?.prenom?.trim() || profileData.name.split(" ")[0] || DEFAULT_PROVIDER.name;

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf2f8 100%)",
        color: "#1e1b4b",
        display: "flex",
        flexDirection: "column",
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
        .glass {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.85);
        }
        .card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.9);
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
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(99,102,241,0.14); }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.18s;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          min-height: 46px;
        }
        .sidebar-item:hover { background: rgba(99,102,241,0.08); color: #4f46e5; }
        .sidebar-item.active {
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
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
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
        .btn-outline {
          background: transparent;
          border: 1.5px solid #e0e7ff;
          color: #4f46e5;
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
          white-space: nowrap;
        }
        .btn-outline:hover { background: #eef2ff; border-color: #6366f1; }
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
        .input-field:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .tag {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #eef2ff;
          color: #4f46e5;
        }
        .progress-bar {
          height: 6px;
          border-radius: 99px;
          background: #e0e7ff;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #6366f1, #a78bfa);
          transition: width 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        textarea.input-field { resize: vertical; min-height: 100px; }

        @media (max-width: 1024px) {
          .stat-card { border-radius: 18px; }
        }

        @media (max-width: 768px) {
          .card, .stat-card { border-radius: 16px; }
          .btn-primary, .btn-outline { padding: 9px 14px; font-size: 13px; }
          .sidebar-item { padding: 12px 14px; }
        }

        @media (max-width: 640px) {
          .btn-primary, .btn-outline { width: 100%; }
        }
      `}</style>

      <Navbar />

      <div
        style={{
          display: "flex",
          flex: 1,
          position: "relative",
          minWidth: 0,
        }}
      >
        <AnimatePresence>
          {isMobile && sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.35)",
                zIndex: 60,
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {(!isMobile || sidebarOpen) && (
            <motion.aside
              initial={isMobile ? { x: -320, opacity: 0 } : false}
              animate={
                isMobile
                  ? { x: 0, opacity: 1 }
                  : { width: sidebarOpen ? 260 : 84 }
              }
              exit={isMobile ? { x: -320, opacity: 0 } : undefined}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              style={{
                position: isMobile ? "fixed" : "sticky",
                top: isMobile ? 0 : 64,
                left: 0,
                height: isMobile ? "100vh" : "calc(100vh - 64px)",
                width: isMobile ? 280 : undefined,
                zIndex: isMobile ? 70 : 20,
                flexShrink: 0,
                background: "white",
                borderRight: "1px solid rgba(99,102,241,0.1)",
                overflowX: "hidden",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                boxShadow: "2px 0 20px rgba(99,102,241,0.06)",
              }}
            >
              <div style={{ padding: "24px 18px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            

       
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      marginLeft: "auto",
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                {TABS.map((tab) => (
                  <div
                    key={tab.id}
                    className={`sidebar-item ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    title={tab.label}
                  >
                    <tab.icon size={18} style={{ flexShrink: 0 }} />
                    {(sidebarOpen || isMobile) && <span>{tab.label}</span>}
                  </div>
                ))}
              </nav>

              <div style={{ padding: "10px 10px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
                <div className="sidebar-item" title="Paramètres">
                  <Settings size={18} style={{ flexShrink: 0 }} />
                  {(sidebarOpen || isMobile) && <span>Paramètres</span>}
                </div>
                <div className="sidebar-item" style={{ color: "#ef4444" }} title="Déconnexion">
                  <LogOut size={18} style={{ flexShrink: 0 }} />
                  {(sidebarOpen || isMobile) && <span>Déconnexion</span>}
                </div>
              </div>

              {!isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{
                    position: "absolute",
                    top: 28,
                    right: -13,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "white",
                    border: "1.5px solid #e0e7ff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    zIndex: 10,
                  }}
                >
                  <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                    <ChevronRight size={12} color="#6366f1" />
                  </motion.div>
                </button>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        <main
          style={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            className="glass"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 40,
              padding: isMobile ? "0 16px" : "0 28px",
              minHeight: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              borderBottom: "1px solid rgba(99,102,241,0.1)",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    border: "1.5px solid #e0e7ff",
                    background: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                </button>
              )}

              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    fontWeight: 800,
                    fontSize: isMobile ? 16 : 18,
                    color: "#1e1b4b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {TABS.find((t) => t.id === activeTab)?.label}
                </h1>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>
                  Bienvenue, {welcomeName} 👋
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <button
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  border: "1.5px solid #e0e7ff",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Bell size={16} color="#6366f1" />
                <span
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#ef4444",
                    border: "2px solid white",
                  }}
                />
              </button>
              <Avatar initials={profileData.avatar} size="sm" gradient />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: isMobile ? "16px" : "28px",
              minWidth: 0,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {activeTab === "dashboard" && (
                  <DashboardTab
                    dashboardData={dashboardData}
                    isLoading={dashboardQuery.isLoading}
                    firstName={welcomeName}
                    appointments={appointmentsData}
                    profileData={profileData}
                  />
                )}
                {activeTab === "profile" && (
                  <ProfileTab
                    data={profileData}
                    editing={editingProfile}
                    isMobile={isMobile}
                    onEdit={() => setEditingProfile(true)}
                    onSave={() => setEditingProfile(false)}
                    onCancel={() => setEditingProfile(false)}
                    onChange={(field: string, val: string) => setProfileData({ ...profileData, [field]: val })}
                  />
                )}
                {activeTab === "services" && (
                  <ServicesTab
                    isMobile={isMobile}
                    prestataireId={user?.prestataireId ?? undefined}
                    services={providerServices}
                    onServiceCreated={() => {
                      queryClient.invalidateQueries({ queryKey: ["dashboard", "provider", user?.prestataireId] });
                      queryClient.invalidateQueries({ queryKey: ["services", "prestataire", user?.prestataireId] });
                      queryClient.invalidateQueries({ queryKey: ["services"] });
                    }}
                  />
                )}
                {activeTab === "appointments" && (
                  <AppointmentsTab
                    isMobile={isMobile}
                    appointments={appointmentsData}
                    onUpdateStatus={(appointmentId, status) => updateAppointmentMutation.mutate({ appointmentId, status })}
                    loadingAppointmentId={updateAppointmentMutation.variables?.appointmentId ?? null}
                  />
                )}
                {activeTab === "reviews" && (
                  <ReviewsTab reviews={reviewsData} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardTab({ dashboardData, isLoading, firstName, appointments, profileData }: DashboardTabProps) {
  
  const recentReviews = dashboardData?.recentReviews ?? REVIEWS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
      {isLoading && !dashboardData ? (
        <div className="card" style={{ padding: 22 }}>Chargement du tableau de bord de {firstName}...</div>
      ) : null}

   

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>Prochains rendez-vous</h3>
            <button className="btn-outline" style={{ padding: "6px 14px", fontSize: 12 }}>
              Voir tout <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {appointments.slice(0, 3).map((appt) => (
              <div
                key={appt.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: "#fafafe",
                  border: "1px solid #f0f4ff",
                  flexWrap: "wrap",
                }}
              >
                <Avatar initials={((appt.client?.prenom?.[0] ?? "") + (appt.client?.nom?.[0] ?? "") || "RD").trim()} size="sm" />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {appt.client ? `${appt.client.prenom} ${appt.client.nom}` : "Client"}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{appt.service?.nomService ?? "Service"}</div>
                </div>
                <div style={{ textAlign: "right", marginLeft: "auto" }}>
                  <div style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>
                    {appt.dateRdv} • {appt.heureRdv}
                  </div>
                  <StatusBadge status={appt.statut} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Profil en un coup d'œil</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Avatar initials={profileData.avatar} size="lg" gradient />
              {profileData.verified && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "2px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle size={11} color="white" />
                </div>
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{profileData.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{profileData.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                <Star size={12} className="fill-amber-400" color="#f59e0b" />
                <span style={{ fontSize: 12, fontWeight: 700 }}>{dashboardData?.averageRating ?? profileData.rating}</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>({recentReviews.length} avis)</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: MapPin, text: profileData.location, color: "#6366f1" },
              { icon: Clock, text: `Réponse ${profileData.responseTime}`, color: "#10b981" },
              { icon: Award, text: profileData.badge, color: "#f59e0b" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={13} color={color} />
                </div>
                <span style={{ fontSize: 13, color: "#374151" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function ProfileTab({ data, editing, onEdit, onSave, onCancel, onChange, isMobile }: ProfileTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", minWidth: 0 }}>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            height: 120,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              backgroundImage:
                "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div style={{ padding: isMobile ? "0 16px 20px" : "0 28px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "flex-end",
              marginBottom: 16,
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ position: "relative", marginTop: -40 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 22,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "white",
                  border: "3px solid white",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
                }}
              >
                {data.avatar}
              </div>
              {editing && (
                <button
                  style={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: "#6366f1",
                    border: "2px solid white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera size={12} color="white" />
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
              {editing ? (
                <>
                  <button className="btn-outline" onClick={onCancel}>
                    <X size={14} />Annuler
                  </button>
                  <button className="btn-primary" onClick={onSave}>
                    <Save size={14} />Sauvegarder
                  </button>
                </>
              ) : (
                <button className="btn-primary" onClick={onEdit}>
                  <Edit3 size={14} />Modifier le profil
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#1e1b4b" }}>{data.name}</div>
              <div style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>{data.title}</div>
            </div>
            {data.verified && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: "#ecfdf5",
                  color: "#059669",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <Shield size={12} /> Profil vérifié
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                borderRadius: 20,
                background: "#fffbeb",
                color: "#d97706",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Award size={12} /> {data.badge}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 18, color: "#6366f1" }}>Informations personnelles</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Nom complet", field: "name", icon: User },
              { label: "Spécialité", field: "title", icon: Briefcase },
              { label: "Localisation", field: "location", icon: MapPin },
              { label: "Téléphone", field: "phone", icon: Phone },
              { label: "Email", field: "email", icon: Mail },
            ].map(({ label, field, icon: Icon }) => (
              <div key={field}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 6,
                  }}
                >
                  <Icon size={11} /> {label}
                </label>
                {editing ? (
                  <input
                    className="input-field"
                    value={(data[field as keyof ProfileData] || "") as string}
                    onChange={(e) => onChange(field, e.target.value)}
                  />
                ) : (
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#1e1b4b" }}>{data[field as keyof ProfileData]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#6366f1" }}>Biographie</h3>
            {editing ? (
              <textarea className="input-field" value={data.bio} onChange={(e) => onChange("bio", e.target.value)} />
            ) : (
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#374151" }}>{data.bio}</p>
            )}
          </div>

          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#6366f1" }}>Performance</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Satisfaction client", value: 98, color: "#10b981" },
                { label: "Ponctualité", value: 95, color: "#6366f1" },
                { label: "Qualité du travail", value: 97, color: "#8b5cf6" },
                { label: "Communication", value: 92, color: "#f59e0b" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesTab({ isMobile, prestataireId, services, onServiceCreated }: ServicesTabProps) {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ServiceFormState>({
    nomService: "",
    description: "",
    region: "",
    prix: "",
    categorieId: "",
    sousCategorieId: "",
  });

  useEffect(() => {
    if (categories.length > 0 && !form.categorieId) {
      const firstCategory = categories[0];
      setForm((current) => ({
        ...current,
        categorieId: firstCategory.id,
        sousCategorieId: firstCategory.sousCategories?.[0]?.id ?? "",
      }));
    }
  }, [categories, form.categorieId]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.categorieId) ?? categories[0],
    [categories, form.categorieId],
  );

  const subCategories = useMemo(() => selectedCategory?.sousCategories ?? [], [selectedCategory]);

  useEffect(() => {
    if (!selectedCategory) return;
    const currentIsValid = subCategories.some((subCategory) => subCategory.id === form.sousCategorieId);
    if (!currentIsValid) {
      setForm((current) => ({
        ...current,
        sousCategorieId: subCategories[0]?.id ?? "",
      }));
    }
  }, [form.sousCategorieId, selectedCategory, subCategories]);

  const createServiceMutation = useMutation({
    mutationFn: async () => {
      if (!prestataireId) {
        throw new Error("Aucun compte prestataire lié à ce profil.");
      }

      if (!form.nomService.trim() || !form.description.trim() || !form.region.trim() || !form.prix.trim() || !form.sousCategorieId) {
        throw new Error("Veuillez remplir tous les champs du formulaire.");
      }

      return createService({
        nomService: form.nomService.trim(),
        description: form.description.trim(),
        region: form.region.trim(),
        prix: Number(form.prix),
        prestataireId,
        sousCategorieId: form.sousCategorieId,
      });
    },
    onSuccess: () => {
      toast.success("Service ajouté avec succès");
      setShowForm(false);
      setForm({
        nomService: "",
        description: "",
        region: "",
        prix: "",
        categorieId: categories[0]?.id ?? "",
        sousCategorieId: categories[0]?.sousCategories?.[0]?.id ?? "",
      });
      onServiceCreated();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Impossible d'ajouter le service");
    },
  });

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 16 }}>Mes services</h2>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
            {services.length} service{services.length > 1 ? "s" : ""} synchronisé{services.length > 1 ? "s" : ""} avec le backend
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((current) => !current)}>
          <Plus size={15} />{showForm ? "Fermer le formulaire" : "Ajouter un service"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="card"
            style={{ padding: 22, marginBottom: 18 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Nouveau service</h3>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Le service sera ajouté au compte du prestataire connecté.</p>
              </div>
              {categoriesLoading ? <Badge color="#9ca3af">Chargement des catégories...</Badge> : null}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Nom du service</label>
                <input
                  className="input-field"
                  value={form.nomService}
                  onChange={(event) => setForm((current) => ({ ...current, nomService: event.target.value }))}
                  placeholder="Ex. Installation électrique"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Région</label>
                <input
                  className="input-field"
                  value={form.region}
                  onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))}
                  placeholder="Ex. Tunis"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Prix</label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  value={form.prix}
                  onChange={(event) => setForm((current) => ({ ...current, prix: event.target.value }))}
                  placeholder="Ex. 95"
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Description</label>
                <textarea
                  className="input-field"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Décrivez le service et ses détails"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Catégorie</label>
                <select
                  className="input-field"
                  value={form.categorieId}
                  onChange={(event) => setForm((current) => ({ ...current, categorieId: event.target.value, sousCategorieId: "" }))}
                >
                  <option value="">Choisir une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nomCategorie}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Sous-catégorie</label>
                <select
                  className="input-field"
                  value={form.sousCategorieId}
                  onChange={(event) => setForm((current) => ({ ...current, sousCategorieId: event.target.value }))}
                  disabled={!selectedCategory}
                >
                  <option value="">Choisir une sous-catégorie</option>
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.nomSousCategorie}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button className="btn-outline" onClick={() => setShowForm(false)} type="button">
                Annuler
              </button>
              <button className="btn-primary" onClick={() => createServiceMutation.mutate()} type="button" disabled={createServiceMutation.isPending}>
                <Plus size={15} />{createServiceMutation.isPending ? "Ajout en cours..." : "Créer le service"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {services.length > 0 ? (
          services.map((service, i) => (
            <motion.div
              key={service.id}
              className="card"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ padding: "18px 22px" }}
            >
              <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 16, flexWrap: "wrap" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    flexShrink: 0,
                    background: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Briefcase size={18} color="#6366f1" />
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{service.nomService}</span>
                    <span className="tag">{service.region}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <DollarSign size={11} /> {service.prix} DT
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={11} /> {service.region}
                    </span>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="card" style={{ padding: 22, textAlign: "center", color: "#6b7280" }}>
            Aucun service pour le moment. Ajoutez votre premier service avec le formulaire ci-dessus.
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentsTab({ isMobile, appointments, onUpdateStatus, loadingAppointmentId }: AppointmentsTabProps) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? appointments : appointments.filter((appointment) => appointment.statut === filter);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {[
          { id: "all", label: "Tous" },
          { id: "accepte", label: "Confirmés" },
          { id: "en_attente", label: "En attente" },
          { id: "annule", label: "Annulés" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: "8px 18px",
              borderRadius: 12,
              border: "1.5px solid",
              borderColor: filter === f.id ? "#6366f1" : "#e0e7ff",
              background: filter === f.id ? "#eef2ff" : "white",
              color: filter === f.id ? "#4f46e5" : "#6b7280",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((appt, i) => (
          <motion.div
            key={appt.id}
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{ padding: "18px 22px" }}
          >
            <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 16, flexWrap: "wrap" }}>
              <Avatar initials={appt.client ? `${appt.client.prenom?.[0] ?? ""}${appt.client.nom?.[0] ?? ""}`.trim() || "RD" : "RD"} size="md" />
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
                  {appt.client ? `${appt.client.prenom} ${appt.client.nom}` : "Client"}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{appt.service?.nomService ?? "Service"}</div>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: isMobile ? "flex-start" : "flex-end", gap: 8 }}>
              {appt.statut === "en_attente" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
                  <button
                    onClick={() => onUpdateStatus(appt.id, "accepte")}
                    disabled={loadingAppointmentId === appt.id}
                    style={{ padding: "7px 14px", borderRadius: 10, background: "#ecfdf5", color: "#059669", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: loadingAppointmentId === appt.id ? 0.7 : 1 }}
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => onUpdateStatus(appt.id, "annule")}
                    disabled={loadingAppointmentId === appt.id}
                    style={{ padding: "7px 14px", borderRadius: 10, background: "#fff1f2", color: "#e11d48", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: loadingAppointmentId === appt.id ? 0.7 : 1 }}
                  >
                    Refuser
                  </button>
                </div>
              )}
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6366f1", display: "flex", alignItems: "center", gap: 4, justifyContent: isMobile ? "flex-start" : "flex-end" }}>
                  <Calendar size={11} /> {formatAppointmentDate(appt.dateRdv)} {appt.heureRdv ? `• ${appt.heureRdv}` : ""}
                </div>
                <StatusBadge status={appt.statut} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <div style={{ width: "100%" }}>
      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#1e1b4b", lineHeight: 1 }}>
              {reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : DEFAULT_PROVIDER.rating}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
              <Stars rating={5} />
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{reviews.length} avis</div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", width: 10 }}>{star}</span>
                <Star size={11} color="#f59e0b" fill="#f59e0b" />
                <div className="progress-bar" style={{ flex: 1 }}>
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: star === 5 ? "80%" : star === 4 ? "15%" : "3%" }}
                    transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                    style={{ background: "linear-gradient(90deg, #f59e0b, #fcd34d)" }}
                  />
                </div>
                <span style={{ fontSize: 11, color: "#9ca3af", width: 24, textAlign: "right" }}>
                  {star === 5 ? "102" : star === 4 ? "19" : "6"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {reviews.map((review, i) => (
          <motion.div
            key={review.idAvis}
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ padding: "20px 22px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar initials={review.client ? `${review.client.prenom?.[0] ?? ""}${review.client.nom?.[0] ?? ""}`.trim() || "AV" : "AV"} size="sm" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>
                    {review.client ? `${review.client.prenom} ${review.client.nom}` : "Client"}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{review.dateAvis}</div>
                </div>
              </div>
              <Stars rating={review.rating} />
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#374151" }}>{review.comment}</p>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 10, background: "#f0f4ff", border: "none", color: "#4f46e5", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <MessageSquare size={11} /> Répondre
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 10, background: "#fff0f0", border: "none", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                <Heart size={11} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
