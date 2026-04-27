import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  Shield,
  Briefcase,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  User,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { useCategories } from "@/hooks/useCategories";
import { createService, getServicesByPrestataire, type ServiceDto } from "@/lib/serviceApi";
import { getPrestataireRendezVous, updateRendezVousStatus, type ProviderAppointmentDto } from "@/lib/rendezVousApi";
import { getAvisByPrestataire, type ProviderAvisDto } from "@/lib/avisApi";
import type { DashboardReviewDto } from "@/lib/dashboardApi";
import { toast } from "sonner";

// Composant Badge amélioré
function Badge({ children, color = "#6366f1", variant = "solid" }: { children: React.ReactNode; color?: string; variant?: "solid" | "outline" }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
      style={
        variant === "solid"
          ? { background: color, color: "white" }
          : { background: `${color}10`, color, border: `1px solid ${color}20` }
      }
    >
      {children}
    </span>
  );
}

// Composant Stars amélioré
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={size}
          className={`transition-all ${value <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

// Composant StatusBadge amélioré
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; icon: any }> = {
    en_attente: { label: "En attente", color: "#f59e0b", icon: Clock },
    accepte: { label: "Confirmé", color: "#10b981", icon: CheckCircle },
    annule: { label: "Annulé", color: "#ef4444", icon: X },
  };

  const current = map[status] ?? { label: status, color: "#6b7280", icon: AlertCircle };
  const Icon = current.icon;

  return (
    <Badge color={current.color} variant="outline">
      <Icon size={12} />
      {current.label}
    </Badge>
  );
}

// Formatage des dates amélioré
function formatAppointmentDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("fr-FR", { 
    day: "2-digit", 
    month: "long", 
    year: "numeric" 
  }).format(date);
}

// Composant Avatar amélioré
function Avatar({
  initials,
  size = "md",
  gradient = false,
  imageUrl,
}: {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  gradient?: boolean;
  imageUrl?: string;
}) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-28 h-28 text-2xl",
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={initials}
        className={`${sizes[size]} rounded-2xl object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-2xl flex items-center justify-center font-bold flex-shrink-0 transition-all duration-300`}
      style={
        gradient
          ? { background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)", color: "white" }
          : { background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", color: "#4f46e5" }
      }
    >
      <span className={gradient ? "text-white" : ""}>{initials}</span>
    </div>
  );
}

// Composant de pagination
function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
      >
        <ChevronLeft size={18} />
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === -1 ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg font-medium transition-all ${
              currentPage === page
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

// Types
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

interface ServiceFormState {
  nomService: string;
  description: string;
  region: string;
  prix: string;
  categorieId: string;
  sousCategorieId: string;
}

// Helper functions
function buildProfileData(userName: string, user: ReturnType<typeof useAuth>["user"]): ProfileData {
  const fullName = [user?.prenom, user?.nom].filter(Boolean).join(" ").trim();
  const initials = `${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}`.trim().toUpperCase() || "PR";

  return {
    name: fullName || userName || "Prestataire",
    title: user?.specialite || "Prestataire professionnel",
    avatar: initials,
    bio: user?.description || "",
    rating: 0,
    reviews: 0,
    completedJobs: 0,
    responseTime: "",
    location: user?.region || "",
    phone: user?.telephone || "",
    email: user?.email || "",
    memberSince: new Date().getFullYear().toString(),
    verified: false,
    badge: "",
  };
}

// Composant principal
export default function ProviderDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const activeTab = tab === "profile" || tab === "services" || tab === "appointments" || tab === "reviews" ? tab : "dashboard";
  
  // États de pagination
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const itemsPerPage = 5;

  // Queries
  const dashboardQuery = useProviderDashboard(user?.prestataireId ?? undefined);
  const dashboardData = dashboardQuery.data;

  const appointmentsQuery = useQuery<ProviderAppointmentDto[], Error>({
    queryKey: ["rendez-vous", "prestataire", user?.prestataireId],
    queryFn: () => getPrestataireRendezVous(user?.prestataireId ?? ""),
    enabled: Boolean(user?.prestataireId),
  });

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

  const { data: categories = [] } = useCategories();

  // États locaux
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(() => buildProfileData(user?.prenom ?? "", user));
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState<ServiceFormState>({
    nomService: "",
    description: "",
    region: "",
    prix: "",
    categorieId: categories[0]?.id ?? "",
    sousCategorieId: categories[0]?.sousCategories?.[0]?.id ?? "",
  });

  // Effets
  useEffect(() => {
    setProfileData(buildProfileData(user?.prenom ?? "", user));
  }, [user]);

  useEffect(() => {
    if (!serviceForm.categorieId && categories.length > 0) {
      setServiceForm((current) => ({
        ...current,
        categorieId: categories[0].id,
        sousCategorieId: categories[0].sousCategories?.[0]?.id ?? "",
      }));
    }
  }, [categories, serviceForm.categorieId]);

  // Données paginées
  const appointmentsData = appointmentsQuery.data ?? dashboardData?.recentAppointments ?? [];
  const paginatedAppointments = appointmentsData.slice(
    (appointmentsPage - 1) * itemsPerPage,
    appointmentsPage * itemsPerPage
  );
  const appointmentsTotalPages = Math.ceil(appointmentsData.length / itemsPerPage);

  const reviewsData: DashboardReviewDto[] =
    providerAvis.length > 0
      ? providerAvis.map((avis) => ({
          idAvis: avis.idAvis,
          dateAvis: avis.dateAvis,
          rating: avis.rating,
          comment: avis.comment,
          service: avis.service ? { nomService: avis.service.nomService } : null,
          client: avis.client ? { nom: avis.client.nom, prenom: avis.client.prenom } : null,
        }))
      : dashboardData?.recentReviews ?? [];
  
  const paginatedReviews = reviewsData.slice(
    (reviewsPage - 1) * itemsPerPage,
    reviewsPage * itemsPerPage
  );
  const reviewsTotalPages = Math.ceil(reviewsData.length / itemsPerPage);

  const providerServices = providerServicesQuery.data ?? dashboardData?.recentServices ?? [];

  // Mutations
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string | number; status: "accepte" | "annule" }) =>
      updateRendezVousStatus(appointmentId, status),
    onSuccess: () => {
      toast.success("Statut du rendez-vous mis à jour");
      queryClient.invalidateQueries({ queryKey: ["rendez-vous", "prestataire", user?.prestataireId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "provider", user?.prestataireId] });
    },
    onError: (error: Error) => toast.error(error.message || "Impossible de mettre à jour le rendez-vous"),
  });

  const createServiceMutation = useMutation({
    mutationFn: async () => {
      if (!user?.prestataireId) throw new Error("Aucun compte prestataire lié à ce profil.");
      if (!serviceForm.nomService.trim() || !serviceForm.description.trim() || !serviceForm.region.trim() || !serviceForm.prix.trim() || !serviceForm.sousCategorieId) {
        throw new Error("Veuillez remplir tous les champs du formulaire.");
      }

      return createService({
        nomService: serviceForm.nomService.trim(),
        description: serviceForm.description.trim(),
        region: serviceForm.region.trim(),
        prix: Number(serviceForm.prix),
        prestataireId: user.prestataireId,
        sousCategorieId: serviceForm.sousCategorieId,
      });
    },
    onSuccess: () => {
      toast.success("Service ajouté avec succès");
      setShowServiceForm(false);
      setServiceForm({
        nomService: "",
        description: "",
        region: "",
        prix: "",
        categorieId: categories[0]?.id ?? "",
        sousCategorieId: categories[0]?.sousCategories?.[0]?.id ?? "",
      });
      queryClient.invalidateQueries({ queryKey: ["services", "prestataire", user?.prestataireId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "provider", user?.prestataireId] });
    },
    onError: (error: Error) => toast.error(error.message || "Impossible d'ajouter le service"),
  });

  const handleTabChange = (newTab: string) => {
    setSearchParams({ tab: newTab });
    // Reset pagination when changing tabs
    setAppointmentsPage(1);
    setReviewsPage(1);
  };

  const dashboardCards = [
    { label: "Note moyenne", value: dashboardData?.averageRating ?? 0, icon: Star, color: "#f59e0b", suffix: "/5" },
    { label: "Rendez-vous", value: dashboardData?.totalAppointments ?? appointmentsData.length, icon: Calendar, color: "#10b981" },
    { label: "Services", value: providerServices.length, icon: Briefcase, color: "#6366f1" },
    { label: "Avis", value: reviewsData.length, icon: MessageSquare, color: "#8b5cf6" },
  ];

  const displayName = profileData.name || "Prestataire";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation par onglets améliorée */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex gap-1 overflow-x-auto">
              {[
                { id: "dashboard", label: "Tableau de bord", icon: Award },
                { id: "profile", label: "Profil", icon: User },
                { id: "services", label: "Services", icon: Briefcase },
                { id: "appointments", label: "Rendez-vous", icon: Calendar },
                { id: "reviews", label: "Avis", icon: MessageSquare },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`px-4 py-3 font-medium text-sm transition-all relative ${
                      activeTab === item.id
                        ? "text-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={16} />
                      {item.label}
                    </div>
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Cartes statistiques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardCards.map(({ label, value, icon: Icon, color, suffix }) => (
                    <motion.div
                      key={label}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${color}15` }}
                        >
                          <Icon size={20} color={color} />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                          {typeof value === "number" ? value.toFixed(1) : value}
                          {suffix}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Section rendez-vous et profil */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Rendez-vous récents */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800">Prochains rendez-vous</h3>
                      <span className="text-xs text-gray-500">{appointmentsData.length} éléments</span>
                    </div>
                    <div className="space-y-3">
                      {appointmentsData.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">
                                {appointment.client ? `${appointment.client.prenom} ${appointment.client.nom}` : "Client"}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {appointment.service?.nomService ?? "Service"}
                              </p>
                            </div>
                            <StatusBadge status={appointment.statut} />
                          </div>
                          <p className="text-xs text-indigo-600 mt-2">
                            <Calendar size={12} className="inline mr-1" />
                            {formatAppointmentDate(appointment.dateRdv)} {appointment.heureRdv && `• ${appointment.heureRdv}`}
                          </p>
                        </div>
                      ))}
                      {appointmentsData.length === 0 && (
                        <p className="text-center text-gray-500 py-8">Aucun rendez-vous à venir</p>
                      )}
                    </div>
                  </div>

                  {/* Aperçu du profil */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
                    <h3 className="font-semibold text-gray-800 mb-4">Aperçu du profil</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar initials={profileData.avatar} size="lg" gradient />
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{displayName}</p>
                        <p className="text-sm text-gray-500">{profileData.title || "—"}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        {profileData.location || "—"}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        {profileData.phone || "—"}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        {profileData.email || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profil */}
            {activeTab === "profile" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar initials={profileData.avatar} size="xl" gradient />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{displayName}</h2>
                      <p className="text-gray-500">{profileData.title || "Prestataire"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {editingProfile ? <X size={16} /> : <Edit3 size={16} />}
                    {editingProfile ? "Annuler" : "Modifier"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-800">{profileData.email || "—"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                    <p className="text-gray-800">{profileData.phone || "—"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Région</p>
                    <p className="text-gray-800">{profileData.location || "—"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Membre depuis</p>
                    <p className="text-gray-800">{profileData.memberSince || "—"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Bio</p>
                  <p className="text-gray-800">{profileData.bio || "—"}</p>
                </div>

                {editingProfile && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-3">Modifier le profil</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={profileData.name}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nom complet"
                      />
                      <input
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={profileData.title}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Spécialité"
                      />
                      <input
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Téléphone"
                      />
                      <input
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={profileData.location}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="Région"
                      />
                      <textarea
                        className="md:col-span-2 px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={profileData.bio}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Bio"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="px-4 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => {
                          toast.success("Profil mis à jour");
                          setEditingProfile(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Save size={16} />
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Services */}
            {activeTab === "services" && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowServiceForm(!showServiceForm)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} />
                  {showServiceForm ? "Fermer" : "Ajouter un service"}
                </button>

                {showServiceForm && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                    <h3 className="font-semibold text-gray-800 mb-4">Nouveau service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={serviceForm.nomService}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, nomService: e.target.value }))}
                        placeholder="Nom du service"
                      />
                      <input
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={serviceForm.region}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, region: e.target.value }))}
                        placeholder="Région"
                      />
                      <input
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        type="number"
                        value={serviceForm.prix}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, prix: e.target.value }))}
                        placeholder="Prix (DT)"
                      />
                      <select
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={serviceForm.categorieId}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, categorieId: e.target.value, sousCategorieId: "" }))}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.nomCategorie}</option>
                        ))}
                      </select>
                      <select
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={serviceForm.sousCategorieId}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, sousCategorieId: e.target.value }))}
                      >
                        {categories
                          .find((c) => c.id === serviceForm.categorieId)
                          ?.sousCategories?.map((sub) => (
                            <option key={sub.id} value={sub.id}>{sub.nomSousCategorie}</option>
                          ))}
                      </select>
                      <textarea
                        className="md:col-span-2 px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Description"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => setShowServiceForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => createServiceMutation.mutate()}
                        disabled={createServiceMutation.isPending}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {createServiceMutation.isPending ? "Ajout..." : "Créer"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {providerServices.length > 0 ? (
                    providerServices.map((service) => (
                      <div key={service.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{service.nomService}</h3>
                            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                            <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1">
                              <MapPin size={12} />
                              {service.region}
                            </p>
                          </div>
                          <Badge color="#10b981" variant="solid">
                            {service.prix} DT
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center">
                      <Briefcase size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Aucun service pour le moment</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rendez-vous avec pagination */}
            {activeTab === "appointments" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {paginatedAppointments.length > 0 ? (
                    paginatedAppointments.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50"
                      >
                        <div className="flex flex-wrap justify-between items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar initials={appointment.client ? `${appointment.client.prenom?.[0] || ''}${appointment.client.nom?.[0] || ''}` : "C"} size="sm" />
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {appointment.client ? `${appointment.client.prenom} ${appointment.client.nom}` : "Client"}
                                </p>
                                <p className="text-xs text-gray-500">{appointment.service?.nomService ?? "Service"}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm">
                              <span className="text-gray-600 flex items-center gap-1">
                                <Calendar size={14} className="text-indigo-500" />
                                {formatAppointmentDate(appointment.dateRdv)}
                              </span>
                              {appointment.heureRdv && (
                                <span className="text-gray-600 flex items-center gap-1">
                                  <Clock size={14} className="text-indigo-500" />
                                  {appointment.heureRdv}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={appointment.statut} />
                            {appointment.statut === "en_attente" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateAppointmentMutation.mutate({ appointmentId: appointment.id, status: "accepte" })}
                                  disabled={updateAppointmentMutation.isPending}
                                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
                                >
                                  Accepter
                                </button>
                                <button
                                  onClick={() => updateAppointmentMutation.mutate({ appointmentId: appointment.id, status: "annule" })}
                                  disabled={updateAppointmentMutation.isPending}
                                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                                >
                                  Refuser
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center">
                      <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Aucun rendez-vous</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination des rendez-vous */}
                <Pagination
                  currentPage={appointmentsPage}
                  totalPages={appointmentsTotalPages}
                  onPageChange={setAppointmentsPage}
                />
              </div>
            )}

            {/* Avis avec pagination */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {paginatedReviews.length > 0 ? (
                    paginatedReviews.map((review) => (
                      <motion.div
                        key={review.idAvis}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50"
                      >
                        <div className="flex justify-between items-start flex-wrap gap-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar initials={review.client ? `${review.client.prenom?.[0] || ''}${review.client.nom?.[0] || ''}` : "C"} size="sm" />
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {review.client ? `${review.client.prenom} ${review.client.nom}` : "Client"}
                                </p>
                                <p className="text-xs text-gray-500">{review.service?.nomService ?? "Service"}</p>
                              </div>
                            </div>
                            <Stars rating={review.rating} size={16} />
                            {review.comment && (
                              <p className="text-gray-600 mt-3 text-sm">{review.comment}</p>
                            )}
                          </div>
                          <Badge color="#6366f1" variant="outline">
                            {new Date(review.dateAvis).toLocaleDateString("fr-FR")}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center">
                      <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Aucun avis pour le moment</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination des avis */}
                <Pagination
                  currentPage={reviewsPage}
                  totalPages={reviewsTotalPages}
                  onPageChange={setReviewsPage}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}