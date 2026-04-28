import { useEffect, useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  Shield,
  Briefcase,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  User,
  AlertCircle,
  Search,
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  Grid3X3,
  List,
  Layers,
  Filter,
  UserCog,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { useAuth } from "@/context/AuthContext";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { useCategories } from "@/hooks/useCategories";
import { createService, getServicesByPrestataire, type ServiceDto } from "@/lib/serviceApi";
import { getPrestataireRendezVous, updateRendezVousStatus, type ProviderAppointmentDto } from "@/lib/rendezVousApi";
import { getAvisByPrestataire, type ProviderAvisDto } from "@/lib/avisApi";
import { getServiceImage } from "@/lib/serviceImages";
import type { DashboardReviewDto } from "@/lib/dashboardApi";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AptFilters { search: string; status: string; dateFrom: string; dateTo: string; perPage: number }
interface RevFilters { search: string; minRating: number; sortBy: "date_desc"|"date_asc"|"rating_desc"|"rating_asc"; dateFrom: string; perPage: number }
interface ProfileData { name: string; title: string; avatar: string; bio: string; location: string; phone: string; email: string; memberSince: string; verified: boolean }
interface ServiceForm  { nomService: string; description: string; region: string; prix: string; categorieId: string; sousCategorieId: string }

const defaultAptFilters: AptFilters = { search: "", status: "", dateFrom: "", dateTo: "", perPage: 4 };
const defaultRevFilters: RevFilters = { search: "", minRating: 0, sortBy: "date_desc", dateFrom: "", perPage: 4 };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(v: string) {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v
    : new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
}

function buildProfile(user: ReturnType<typeof useAuth>["user"]): ProfileData {
  const fullName = [user?.prenom, user?.nom].filter(Boolean).join(" ").trim();
  return {
    name: fullName || "Prestataire",
    title: user?.specialite || "Prestataire professionnel",
    avatar: `${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}`.toUpperCase() || "PR",
    bio: user?.description || "",
    location: user?.region || "",
    phone: user?.telephone || "",
    email: user?.email || "",
    memberSince: new Date().getFullYear().toString(),
    verified: false,
  };
}

// ─── Micro-components ──────────────────────────────────────────────────────────
function Avatar({ initials, size = "md", gradient = false }: { initials: string; size?: "xs"|"sm"|"md"|"lg"|"xl"; gradient?: boolean }) {
  const sizes: Record<string, string> = {
    xs: "w-6 h-6 text-[10px]",
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    en_attente: { label: "En attente", color: "#f59e0b" },
    accepte:    { label: "Confirmé",   color: "#10b981" },
    annule:     { label: "Annulé",     color: "#ef4444" },
  };
  const cfg = map[status] ?? { label: status, color: "#6b7280" };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: `${cfg.color}18`, color: cfg.color }}
    >
      {status === "en_attente" && <Clock size={10} />}
      {status === "accepte"    && <CheckCircle size={10} />}
      {status === "annule"     && <X size={10} />}
      {!["en_attente","accepte","annule"].includes(status) && <AlertCircle size={10} />}
      {cfg.label}
    </span>
  );
}

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map((v) => (
        <Star key={v} size={size} color={v <= rating ? "#f59e0b" : "#e0e7ff"} fill={v <= rating ? "#f59e0b" : "none"} />
      ))}
    </span>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e0e7ff", background: "white", color: page === 1 ? "#9ca3af" : "#4f46e5", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}
      >
        <ChevronLeft size={16} /> Précédent
      </button>
      <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Page {page} / {totalPages}</div>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid #e0e7ff", background: "white", color: page === totalPages ? "#9ca3af" : "#4f46e5", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}
      >
        Suivant <ChevronRight size={16} />
      </button>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: "relative" }}>
      <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Rechercher…"}
        className="input-field"
        style={{ paddingLeft: 36, paddingRight: value ? 32 : 12 }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
          <X size={13} />
        </button>
      )}
    </div>
  );
}

// ─── Advanced Filter Panels ────────────────────────────────────────────────────
function AdvancedAptPanel({ show, filters, onChange, onReset }: { show: boolean; filters: AptFilters; onChange: (f: AptFilters) => void; onReset: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div style={{ marginTop: 12, borderRadius: 16, padding: 20, border: "1px solid #c7d2fe", background: "rgba(238,242,255,0.7)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#4f46e5", display: "flex", alignItems: "center", gap: 6 }}>
                <SlidersHorizontal size={14} /> Filtres avancés
              </p>
              <button onClick={onReset} style={{ fontSize: 12, color: "#4f46e5", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <RefreshCw size={11} /> Réinitialiser
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Statut</label>
                <select className="input-field" value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value })} style={{ padding: "10px 12px" }}>
                  <option value="">Tous les statuts</option>
                  <option value="en_attente">En attente</option>
                  <option value="accepte">Confirmé</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Date de début</label>
                <input type="date" className="input-field" value={filters.dateFrom} onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })} style={{ padding: "10px 12px" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Date de fin</label>
                <input type="date" className="input-field" value={filters.dateTo} onChange={(e) => onChange({ ...filters, dateTo: e.target.value })} style={{ padding: "10px 12px" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Par page</label>
                <select className="input-field" value={filters.perPage} onChange={(e) => onChange({ ...filters, perPage: Number(e.target.value) })} style={{ padding: "10px 12px" }}>
                  {[4,5,10,20,50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AdvancedRevPanel({ show, filters, onChange, onReset }: { show: boolean; filters: RevFilters; onChange: (f: RevFilters) => void; onReset: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div style={{ marginTop: 12, borderRadius: 16, padding: 20, border: "1px solid #ddd6fe", background: "rgba(245,243,255,0.7)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed", display: "flex", alignItems: "center", gap: 6 }}>
                <SlidersHorizontal size={14} /> Filtres avancés
              </p>
              <button onClick={onReset} style={{ fontSize: 12, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <RefreshCw size={11} /> Réinitialiser
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Note minimale</label>
                <select className="input-field" value={filters.minRating} onChange={(e) => onChange({ ...filters, minRating: Number(e.target.value) })} style={{ padding: "10px 12px" }}>
                  <option value={0}>Toutes les notes</option>
                  {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}+ étoile{n>1?"s":""}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Trier par</label>
                <select className="input-field" value={filters.sortBy} onChange={(e) => onChange({ ...filters, sortBy: e.target.value as RevFilters["sortBy"] })} style={{ padding: "10px 12px" }}>
                  <option value="date_desc">Plus récent</option>
                  <option value="date_asc">Plus ancien</option>
                  <option value="rating_desc">Meilleure note</option>
                  <option value="rating_asc">Note la plus basse</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Depuis</label>
                <input type="date" className="input-field" value={filters.dateFrom} onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })} style={{ padding: "10px 12px" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Par page</label>
                <select className="input-field" value={filters.perPage} onChange={(e) => onChange({ ...filters, perPage: Number(e.target.value) })} style={{ padding: "10px 12px" }}>
                  {[4,5,10,20,50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProviderDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab = ["profile","services","appointments","reviews"].includes(rawTab ?? "") ? rawTab! : "profile";

  // Pagination
  const [aptPage, setAptPage] = useState(1);
  const [revPage, setRevPage] = useState(1);

  // Filters
  const [aptFilters, setAptFilters] = useState<AptFilters>(defaultAptFilters);
  const [revFilters, setRevFilters] = useState<RevFilters>(defaultRevFilters);
  const [showAptAdv, setShowAptAdv] = useState(false);
  const [showRevAdv, setShowRevAdv] = useState(false);

  // Services UI
  const [servicesView,  setServicesView]  = useState<"grid"|"list">("grid");
  const [serviceSearch, setServiceSearch] = useState("");
  const [svcPage,       setSvcPage]       = useState(1);
  const SVC_PER_PAGE = 4;
  const [svcForm, setSvcForm] = useState<ServiceForm>({ nomService: "", description: "", region: "", prix: "", categorieId: "", sousCategorieId: "" });

  // Profile
  const [editProfile,    setEditProfile]    = useState(false);
  const [profileData,    setProfileData]    = useState<ProfileData>(() => buildProfile(user));
  const [profileDraft,   setProfileDraft]   = useState<ProfileData>(() => buildProfile(user));

  // Service modal
  const [showSvcModal, setShowSvcModal] = useState(false);

  // Expanded comments
  const [expandedReviews, setExpandedReviews] = useState<Set<string|number>>(new Set());

  // Queries
  const { data: dashboardData } = useProviderDashboard(user?.prestataireId ?? undefined);
  const { data: rawAppointments = [] } = useQuery<ProviderAppointmentDto[]>({
    queryKey: ["rendez-vous", "prestataire", user?.prestataireId],
    queryFn: () => getPrestataireRendezVous(user?.prestataireId ?? ""),
    enabled: Boolean(user?.prestataireId),
  });
  const { data: rawServices = [] } = useQuery<ServiceDto[]>({
    queryKey: ["services", "prestataire", user?.prestataireId],
    queryFn: () => getServicesByPrestataire(user?.prestataireId ?? ""),
    enabled: Boolean(user?.prestataireId),
  });
  const { data: rawAvis = [] } = useQuery<ProviderAvisDto[]>({
    queryKey: ["avis", "prestataire", user?.prestataireId],
    queryFn: () => getAvisByPrestataire(user?.prestataireId ?? ""),
    enabled: Boolean(user?.prestataireId),
  });
  const { data: categories = [] } = useCategories();

  useEffect(() => { setProfileData(buildProfile(user)); }, [user]);
  useEffect(() => {
    if (!svcForm.categorieId && categories.length > 0)
      setSvcForm((p) => ({ ...p, categorieId: categories[0].id, sousCategorieId: categories[0].sousCategories?.[0]?.id ?? "" }));
  }, [categories, svcForm.categorieId]);

  // Normalise data
  const allAppointments = rawAppointments.length > 0 ? rawAppointments : (dashboardData?.recentAppointments ?? []);
  const allServices     = rawServices.length     > 0 ? rawServices     : (dashboardData?.recentServices     ?? []);
  const allReviews: DashboardReviewDto[] = rawAvis.length > 0
    ? rawAvis.map((a) => ({ idAvis: a.idAvis, dateAvis: a.dateAvis, rating: a.rating, comment: a.comment, service: a.service ? { nomService: a.service.nomService } : null, client: a.client ? { nom: a.client.nom, prenom: a.client.prenom } : null }))
    : (dashboardData?.recentReviews ?? []);

  // Filtered appointments
  const filteredApt = useMemo(() => {
    let arr = [...allAppointments];
    if (aptFilters.search) {
      const q = aptFilters.search.toLowerCase();
      arr = arr.filter((a) => (`${a.client?.prenom ?? ""} ${a.client?.nom ?? ""} ${a.service?.nomService ?? ""}`).toLowerCase().includes(q));
    }
    if (aptFilters.status)   arr = arr.filter((a) => a.statut === aptFilters.status);
    if (aptFilters.dateFrom) arr = arr.filter((a) => new Date(a.dateRdv) >= new Date(aptFilters.dateFrom));
    if (aptFilters.dateTo)   arr = arr.filter((a) => new Date(a.dateRdv) <= new Date(aptFilters.dateTo));
    return arr;
  }, [allAppointments, aptFilters]);

  const pApt     = filteredApt.slice((aptPage-1)*aptFilters.perPage, aptPage*aptFilters.perPage);
  const aptPages = Math.ceil(filteredApt.length / aptFilters.perPage);

  // Filtered reviews
  const filteredRev = useMemo(() => {
    let arr = [...allReviews];
    if (revFilters.search) {
      const q = revFilters.search.toLowerCase();
      arr = arr.filter((r) => (`${r.client?.prenom ?? ""} ${r.client?.nom ?? ""} ${r.service?.nomService ?? ""} ${r.comment ?? ""}`).toLowerCase().includes(q));
    }
    if (revFilters.minRating) arr = arr.filter((r) => r.rating >= revFilters.minRating);
    if (revFilters.dateFrom)  arr = arr.filter((r) => new Date(r.dateAvis) >= new Date(revFilters.dateFrom));
    arr.sort((a, b) => {
      if (revFilters.sortBy === "date_asc")    return new Date(a.dateAvis).getTime() - new Date(b.dateAvis).getTime();
      if (revFilters.sortBy === "rating_desc") return b.rating - a.rating;
      if (revFilters.sortBy === "rating_asc")  return a.rating - b.rating;
      return new Date(b.dateAvis).getTime() - new Date(a.dateAvis).getTime();
    });
    return arr;
  }, [allReviews, revFilters]);

  const pRev     = filteredRev.slice((revPage-1)*revFilters.perPage, revPage*revFilters.perPage);
  const revPages = Math.ceil(filteredRev.length / revFilters.perPage);

  // Filtered services
  const filteredSvc = useMemo(() =>
    serviceSearch
      ? allServices.filter((s) => (`${s.nomService} ${s.region ?? ""}`).toLowerCase().includes(serviceSearch.toLowerCase()))
      : allServices,
    [allServices, serviceSearch]);

  const svcPages = Math.ceil(filteredSvc.length / SVC_PER_PAGE);
  const pSvc     = filteredSvc.slice((svcPage - 1) * SVC_PER_PAGE, svcPage * SVC_PER_PAGE);

  // Mutations
  const updateAptMutation = useMutation({
    mutationFn: ({ id, status }: { id: string|number; status: "accepte"|"annule" }) => updateRendezVousStatus(id, status),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["rendez-vous", "prestataire", user?.prestataireId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard",   "provider",    user?.prestataireId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createSvcMutation = useMutation({
    mutationFn: async () => {
      if (!user?.prestataireId) throw new Error("Aucun compte prestataire.");
      if (!svcForm.nomService.trim() || !svcForm.description.trim() || !svcForm.region.trim() || !svcForm.prix || !svcForm.sousCategorieId)
        throw new Error("Remplissez tous les champs.");
      return createService({ nomService: svcForm.nomService.trim(), description: svcForm.description.trim(), region: svcForm.region.trim(), prix: Number(svcForm.prix), prestataireId: user.prestataireId, sousCategorieId: svcForm.sousCategorieId });
    },
    onSuccess: () => {
      toast.success("Service créé avec succès");
      setShowSvcModal(false);
      setSvcForm({ nomService: "", description: "", region: "", prix: "", categorieId: categories[0]?.id ?? "", sousCategorieId: categories[0]?.sousCategories?.[0]?.id ?? "" });
      queryClient.invalidateQueries({ queryKey: ["services",  "prestataire", user?.prestataireId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "provider",    user?.prestataireId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleTab = (tab: string) => {
    setSearchParams({ tab });
    setAptPage(1);
    setRevPage(1);
  };

  const avgRating = allReviews.length ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0;

  const TABS = [
    { id: "profile",      label: "Profil",      icon: User },
    { id: "services",     label: "Services",    icon: Briefcase },
    { id: "appointments", label: "Rendez-vous", icon: Calendar },
    { id: "reviews",      label: "Avis",        icon: MessageSquare },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif", background: "linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 50%, #fdf2f8 100%)", color: "#1e1b4b", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
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
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: 12px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 14px hsl(var(--primary) / 0.3);
          white-space: nowrap;
          font-family: inherit;
        }

        .btn-primary:hover {
          background: hsl(var(--primary) / 0.9);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px hsl(var(--primary) / 0.4);
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-secondary {
          background: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 9px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: hsl(var(--secondary) / 0.8);
          border-color: hsl(var(--primary));
        }

        .btn-success {
          background: hsl(var(--success));
          color: hsl(var(--success-foreground));
          border: none;
          border-radius: 12px;
          padding: 9px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 2px 8px hsl(var(--success) / 0.25);
        }

        .btn-success:hover {
          background: hsl(var(--success) / 0.9);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px hsl(var(--success) / 0.35);
        }
        .btn-success:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-danger {
          background: hsl(var(--destructive));
          color: hsl(var(--destructive-foreground));
          border: none;
          border-radius: 12px;
          padding: 9px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 2px 8px hsl(var(--destructive) / 0.25);
        }

        .btn-danger:hover {
          background: hsl(var(--destructive) / 0.9);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px hsl(var(--destructive) / 0.35);
        }
        .btn-danger:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-info {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
          border-radius: 12px;
          padding: 9px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 2px 8px hsl(var(--primary) / 0.25);
        }

        .btn-info:hover {
          background: hsl(var(--primary) / 0.9);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px hsl(var(--primary) / 0.35);
        }
        .btn-info:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-warning {
          background: hsl(var(--warning));
          color: hsl(var(--warning-foreground));
          border: none;
          border-radius: 12px;
          padding: 9px 14px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 2px 8px hsl(var(--warning) / 0.25);
        }

        .btn-warning:hover {
          background: hsl(var(--warning) / 0.9);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px hsl(var(--warning) / 0.35);
        }
        .btn-warning:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

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

        .tab-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          background: transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.2s;
          font-family: inherit;
        }

        /* ── Service card hover actions ── */
        .service-card-wrapper {
          transition: all 0.3s ease;
        }

        .service-card-wrapper:hover {
          box-shadow: 0 8px 24px rgba(99,102,241,0.15) !important;
          transform: translateY(-2px);
        }

        .service-card-wrapper:hover .service-card-actions {
          opacity: 1 !important;
        }

        @media (max-width: 768px) {
          .card { border-radius: 16px; }
          .btn-primary { padding: 9px 14px; font-size: 13px; }
        }
      `}</style>

      <Navbar />

      <main style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "40px 180px" }}>

        {/* ── Profile header card ── */}
        <section style={{ marginBottom: 24 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <Avatar initials={profileData.avatar} size="lg" gradient />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: "#1e1b4b" }}>{profileData.name}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12 }}>
                  {profileData.email    && <span style={{ color: "#6b7280" }}>📧 {profileData.email}</span>}
                  {profileData.phone    && <span style={{ color: "#6b7280" }}>📞 {profileData.phone}</span>}
                  {profileData.location && <span style={{ color: "#6b7280" }}>📍 {profileData.location}</span>}
                  {profileData.title    && <span style={{ color: "#6b7280" }}>💼 {profileData.title}</span>}
                </div>
              </div>
              <button className="btn-primary" onClick={() => { setProfileDraft({ ...profileData }); setEditProfile(true); }}>
                <UserCog size={15} /> Modifier profil
              </button>
            </div>
          </div>
        </section>

        {/* ── Tab bar ── */}
        <section style={{ marginBottom: 24 }}>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <nav style={{ display: "flex", overflowX: "auto" }}>
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    className="tab-btn"
                    onClick={() => handleTab(id)}
                    style={{ color: active ? "#6366f1" : "#6b7280", background: active ? "rgba(99,102,241,0.06)" : "transparent" }}
                  >
                    <Icon size={16} />
                    {label}
                    {active && (
                      <motion.span
                        layoutId="provider-tab-line"
                        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: "2px 2px 0 0" }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </section>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >

            {/* ────────── PROFILE TAB ────────── */}
            {activeTab === "profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Info cards */}
                <div className="card" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#1e1b4b" }}>Informations</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
                    {[
                      { label: "Email",        val: profileData.email,       icon: "📧" },
                      { label: "Téléphone",    val: profileData.phone,       icon: "📞" },
                      { label: "Région",       val: profileData.location,    icon: "📍" },
                      { label: "Membre depuis",val: profileData.memberSince, icon: "🏅" },
                    ].map(({ label, val, icon }) => (
                      <div key={label} style={{ padding: 16, borderRadius: 14, background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.08)" }}>
                        <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{icon} {label}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b" }}>{val || "—"}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 16, borderRadius: 14, background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.08)" }}>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>📝 Bio</p>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{profileData.bio || "Aucune description."}</p>
                  </div>
                  {profileData.verified && (
                    <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#4f46e5" }}>
                      <Shield size={13} /> Profil vérifié
                    </div>
                  )}
                </div>

                {/* Edit form — now in modal */}
              </div>
            )}

            {/* ────────── SERVICES TAB ────────── */}
            {activeTab === "services" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Toolbar */}
                <div className="card" style={{ padding: 18 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <SearchInput value={serviceSearch} onChange={(v) => { setServiceSearch(v); setSvcPage(1); }} placeholder="Rechercher un service…" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                      <button
                        onClick={() => setServicesView("grid")}
                        style={{ padding: 8, borderRadius: 10, border: "none", cursor: "pointer", background: servicesView === "grid" ? "rgba(99,102,241,0.1)" : "transparent", color: servicesView === "grid" ? "#6366f1" : "#9ca3af" }}
                      >
                        <Grid3X3 size={16} />
                      </button>
                      <button
                        onClick={() => setServicesView("list")}
                        style={{ padding: 8, borderRadius: 10, border: "none", cursor: "pointer", background: servicesView === "list" ? "rgba(99,102,241,0.1)" : "transparent", color: servicesView === "list" ? "#6366f1" : "#9ca3af" }}
                      >
                        <List size={16} />
                      </button>
                      <div style={{ width: 1, height: 20, background: "#e0e7ff" }} />
                      <button className="btn-primary" onClick={() => { setSvcForm({ nomService: "", description: "", region: "", prix: "", categorieId: categories[0]?.id ?? "", sousCategorieId: categories[0]?.sousCategories?.[0]?.id ?? "" }); setShowSvcModal(true); }}>
                        <Plus size={14} /> Nouveau service
                      </button>
                    </div>
                  </div>
                </div>

                {/* Service creation form — now in modal */}

                {/* Service list */}
                {filteredSvc.length === 0 ? (
                  <div className="card" style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
                    <Briefcase size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                    <p style={{ fontSize: 14 }}>{serviceSearch ? "Aucun résultat" : "Aucun service pour le moment"}</p>
                  </div>
                ) : servicesView === "grid" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                    {pSvc.map((s) => {
                      const svc = s as ServiceDto;
                      return (
                        <div key={svc.id} style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.3s" }} className="service-card-wrapper">
                          <ServiceCard
                            id={String(svc.id)}
                            title={svc.nomService}
                            provider={
                              svc.prestataire
                                ? `${svc.prestataire.prenom ?? ""} ${svc.prestataire.nom ?? ""}`.trim() || "Prestataire"
                                : profileData.name
                            }
                            category={svc.sousCategorie?.nom ?? "Service"}
                            region={svc.region ?? "—"}
                            price={`${svc.prix} DT`}
                            rating={0}
                            reviewCount={0}
                            image={getServiceImage({
                              nomService: svc.nomService,
                              category: svc.sousCategorie?.nom,
                              description: svc.description,
                            })}
                          />
                          {/* Overlay d'actions au survol */}
                          <div className="service-card-actions" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", display: "flex", gap: 6, justifyContent: "center", opacity: 0, transition: "opacity 0.3s" }}>
                            <button
                              className="btn-info"
                              style={{ padding: "8px 12px", fontSize: 12 }}
                              onClick={() => {/* TODO: Navigate to service detail */}}
                            >
                              <Eye size={13} /> Voir
                            </button>
                            <button
                              className="btn-warning"
                              style={{ padding: "8px 12px", fontSize: 12 }}
                              onClick={() => {/* TODO: Open edit modal */}}
                            >
                              <Edit size={13} /> Modifier
                            </button>
                            <button
                              className="btn-danger"
                              style={{ padding: "8px 12px", fontSize: 12 }}
                              onClick={() => {/* TODO: Confirm and delete */}}
                            >
                              <Trash2 size={13} /> Supprimer
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="card" style={{ overflow: "hidden", padding: 0 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                      <thead>
                        <tr style={{ background: "rgba(99,102,241,0.04)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                          {["Service", "Description", "Région", "Prix", "Actions"].map((h) => (
                            <th key={h} style={{ padding: "12px 20px", textAlign: h === "Actions" ? "right" : "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pSvc.map((s, i) => (
                          <tr key={s.id} style={{ borderBottom: i < pSvc.length - 1 ? "1px solid rgba(99,102,241,0.06)" : "none" }}>
                            <td style={{ padding: "14px 20px", fontWeight: 600, color: "#1e1b4b" }}>{s.nomService}</td>
                            <td style={{ padding: "14px 20px", color: "#6b7280", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description}</td>
                            <td style={{ padding: "14px 20px", color: "#6b7280" }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{s.region}</span></td>
                            <td style={{ padding: "14px 20px", fontWeight: 700, color: "#059669" }}>{s.prix} DT</td>
                            <td style={{ padding: "14px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                                <button
                                  className="btn-info"
                                  style={{ padding: "6px 10px", fontSize: 11 }}
                                  onClick={() => {/* TODO: Navigate to service detail */}}
                                  title="Voir les détails"
                                >
                                  <Eye size={11} />
                                </button>
                                <button
                                  className="btn-warning"
                                  style={{ padding: "6px 10px", fontSize: 11 }}
                                  onClick={() => {/* TODO: Open edit modal */}}
                                  title="Modifier"
                                >
                                  <Edit size={11} />
                                </button>
                                <button
                                  className="btn-danger"
                                  style={{ padding: "6px 10px", fontSize: 11 }}
                                  onClick={() => {/* TODO: Confirm and delete */}}
                                  title="Supprimer"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {svcPages > 1 && (
                  <div className="card" style={{ padding: "0 20px" }}>
                    <Pagination page={svcPage} totalPages={svcPages} onChange={setSvcPage} />
                  </div>
                )}
              </div>
            )}

            {/* ────────── APPOINTMENTS TAB ────────── */}
            {activeTab === "appointments" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Filter bar */}
                <div className="card" style={{ padding: 18 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <SearchInput
                        value={aptFilters.search}
                        onChange={(v) => { setAptFilters((p) => ({ ...p, search: v })); setAptPage(1); }}
                        placeholder="Rechercher client ou service…"
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {["", "en_attente", "accepte", "annule"].map((s) => (
                        <button
                          key={s}
                          onClick={() => { setAptFilters((p) => ({ ...p, status: s })); setAptPage(1); }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 10,
                            border: "none",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: "inherit",
                            background: aptFilters.status === s ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.06)",
                            color: aptFilters.status === s ? "#fff" : "#6b7280",
                          }}
                        >
                          {s === "" ? "Tous" : s === "en_attente" ? "En attente" : s === "accepte" ? "Confirmés" : "Annulés"}
                        </button>
                      ))}
                    </div>
                    <button
                      className="btn-secondary"
                      onClick={() => setShowAptAdv(!showAptAdv)}
                      style={{ gap: 6 }}
                    >
                      <Filter size={14} /> Avancé
                      <ChevronDown size={12} style={{ transform: showAptAdv ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                    </button>
                  </div>
                  <AdvancedAptPanel
                    show={showAptAdv}
                    filters={aptFilters}
                    onChange={(f) => { setAptFilters(f); setAptPage(1); }}
                    onReset={() => { setAptFilters(defaultAptFilters); setAptPage(1); }}
                  />
                </div>

                <p style={{ fontSize: 13, color: "#6b7280", paddingLeft: 4 }}>
                  <span style={{ fontWeight: 700, color: "#1e1b4b" }}>{filteredApt.length}</span> rendez-vous
                </p>

                {/* Appointments list */}
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {pApt.length === 0 ? (
                    <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
                      <Calendar size={36} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                      <p style={{ fontSize: 14 }}>Aucun rendez-vous trouvé</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", padding: "12px 20px", borderBottom: "1px solid rgba(99,102,241,0.08)", background: "rgba(99,102,241,0.03)" }}>
                        <div style={{ flex: 4, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>Client · Service</div>
                        <div style={{ flex: 2, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>Date</div>
                        <div style={{ flex: 1, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>Heure</div>
                        <div style={{ flex: 2, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af" }}>Statut</div>
                        <div style={{ flex: 3, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#9ca3af", textAlign: "right" }}>Actions</div>
                      </div>
                      <div>
                        {pApt.map((a, i) => (
                          <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "16px 20px",
                              borderBottom: i < pApt.length - 1 ? "1px solid rgba(99,102,241,0.06)" : "none",
                              flexWrap: "wrap",
                              gap: 8,
                            }}
                          >
                            <div style={{ flex: 4, display: "flex", alignItems: "center", gap: 12, minWidth: 180 }}>
                              <Avatar initials={`${a.client?.prenom?.[0]??''}${a.client?.nom?.[0]??''}`||"C"} size="sm" />
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {a.client ? `${a.client.prenom} ${a.client.nom}` : "Client"}
                                </p>
                                <p style={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.service?.nomService ?? "Service"}</p>
                              </div>
                            </div>
                            <div style={{ flex: 2, fontSize: 13, color: "#374151", fontWeight: 500 }}>{fmtDate(a.dateRdv)}</div>
                            <div style={{ flex: 1, fontSize: 13, color: "#9ca3af" }}>{a.heureRdv || "—"}</div>
                            <div style={{ flex: 2 }}><StatusBadge status={a.statut} /></div>
                            <div style={{ flex: 3, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                              {a.statut === "en_attente" && (
                                <>
                                  <button
                                    className="btn-success"
                                    style={{ padding: "7px 14px", fontSize: 12 }}
                                    onClick={() => updateAptMutation.mutate({ id: a.id, status: "accepte" })}
                                    disabled={updateAptMutation.isPending}
                                  >
                                    <CheckCircle size={12} /> Accepter
                                  </button>
                                  <button
                                    className="btn-danger"
                                    style={{ padding: "7px 14px", fontSize: 12 }}
                                    onClick={() => updateAptMutation.mutate({ id: a.id, status: "annule" })}
                                    disabled={updateAptMutation.isPending}
                                  >
                                    <X size={12} /> Refuser
                                  </button>
                                </>
                              )}
                              {a.statut !== "en_attente" && (
                                <button
                                  className="btn-info"
                                  style={{ padding: "7px 14px", fontSize: 12 }}
                                  onClick={() => {/* TODO: Navigate to detail */}}
                                >
                                  <Eye size={12} /> Voir plus
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div style={{ padding: "0 20px 20px" }}>
                        <Pagination page={aptPage} totalPages={aptPages} onChange={setAptPage} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ────────── REVIEWS TAB ────────── */}
            {activeTab === "reviews" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* ── Summary bar ── */}
                {allReviews.length > 0 && (
                  <div className="card" style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 36, fontWeight: 800, color: "#1e1b4b", lineHeight: 1 }}>{avgRating.toFixed(1)}</span>
                      <div>
                        <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                          {[1,2,3,4,5].map((v) => (
                            <Star key={v} size={14} color={v <= Math.round(avgRating) ? "#f59e0b" : "#e0e7ff"} fill={v <= Math.round(avgRating) ? "#f59e0b" : "#e0e7ff"} />
                          ))}
                        </div>
                        <p style={{ fontSize: 12, color: "#9ca3af" }}>{allReviews.length} avis</p>
                      </div>
                    </div>
                    <div style={{ width: 1, height: 36, background: "rgba(99,102,241,0.12)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 5 }}>
                      {[5,4,3,2,1].map((n) => {
                        const count = allReviews.filter((r) => r.rating === n).length;
                        const pct   = allReviews.length ? (count / allReviews.length) * 100 : 0;
                        return (
                          <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: "#9ca3af", width: 8, textAlign: "right" }}>{n}</span>
                            <Star size={9} color="#f59e0b" fill="#f59e0b" />
                            <div style={{ flex: 1, height: 5, borderRadius: 4, background: "rgba(99,102,241,0.08)", overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 4, background: "#f59e0b", width: `${pct}%`, transition: "width 0.5s" }} />
                            </div>
                            <span style={{ fontSize: 11, color: "#9ca3af", width: 14, textAlign: "right" }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Filter bar ── */}
                <div className="card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <SearchInput
                        value={revFilters.search}
                        onChange={(v) => { setRevFilters((p) => ({ ...p, search: v })); setRevPage(1); }}
                        placeholder="Rechercher dans les avis…"
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {[0,5,4,3,2,1].map((n) => (
                        <button
                          key={n}
                          onClick={() => { setRevFilters((p) => ({ ...p, minRating: n })); setRevPage(1); }}
                          style={{
                            padding: "5px 11px",
                            borderRadius: 8,
                            border: "1px solid",
                            borderColor: revFilters.minRating === n ? "#f59e0b" : "rgba(99,102,241,0.15)",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            background: revFilters.minRating === n ? "rgba(245,158,11,0.1)" : "transparent",
                            color: revFilters.minRating === n ? "#b45309" : "#6b7280",
                            transition: "all 0.15s",
                          }}
                        >
                          {n === 0 ? "Tous" : <><Star size={9} color="#f59e0b" fill="#f59e0b" />{n}+</>}
                        </button>
                      ))}
                    </div>
                    <button className="btn-secondary" onClick={() => setShowRevAdv(!showRevAdv)} style={{ gap: 6 }}>
                      <Filter size={14} /> Avancé
                      <ChevronDown size={12} style={{ transform: showRevAdv ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                    </button>
                  </div>
                  <AdvancedRevPanel
                    show={showRevAdv}
                    filters={revFilters}
                    onChange={(f) => { setRevFilters(f); setRevPage(1); }}
                    onReset={() => { setRevFilters(defaultRevFilters); setRevPage(1); }}
                  />
                </div>

                <p style={{ fontSize: 13, color: "#6b7280", paddingLeft: 2 }}>
                  <span style={{ fontWeight: 700, color: "#1e1b4b" }}>{filteredRev.length}</span> avis
                </p>

                {/* ── Review list ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {pRev.length === 0 ? (
                    <div className="card" style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
                      <MessageSquare size={32} style={{ margin: "0 auto 10px", opacity: 0.25 }} />
                      <p style={{ fontSize: 14 }}>Aucun avis correspondant</p>
                    </div>
                  ) : pRev.map((r, i) => (
                    <motion.div
                      key={r.idAvis}
                      className="card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{ padding: "16px 20px" }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        {/* Avatar */}
                        <Avatar initials={`${r.client?.prenom?.[0] ?? ""}${r.client?.nom?.[0] ?? ""}` || "C"} size="md" />

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Top row */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                            <div>
                              <span style={{ fontWeight: 700, fontSize: 14, color: "#1e1b4b" }}>
                                {r.client ? `${r.client.prenom} ${r.client.nom}` : "Client"}
                              </span>
                              <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>
                                · {r.service?.nomService ?? "Service"}
                              </span>
                            </div>
                            <span style={{ fontSize: 11, color: "#c4b5fd", flexShrink: 0 }}>
                              {new Date(r.dateAvis).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          </div>

                          {/* Stars */}
                          <div style={{ display: "flex", gap: 2, marginBottom: r.comment ? 8 : 0 }}>
                            {[1,2,3,4,5].map((v) => (
                              <Star key={v} size={13} color={v <= r.rating ? "#f59e0b" : "#e0e7ff"} fill={v <= r.rating ? "#f59e0b" : "#e0e7ff"} />
                            ))}
                          </div>

                          {/* Comment */}
                          {r.comment && (
                            <div>
                              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, marginTop: 6 }}>
                                {expandedReviews.has(r.idAvis) ? r.comment : r.comment.length > 150 ? r.comment.substring(0, 150) + "…" : r.comment}
                              </p>
                              {r.comment.length > 150 && (
                                <button
                                  onClick={() => {
                                    const newExpanded = new Set(expandedReviews);
                                    if (newExpanded.has(r.idAvis)) {
                                      newExpanded.delete(r.idAvis);
                                    } else {
                                      newExpanded.add(r.idAvis);
                                    }
                                    setExpandedReviews(newExpanded);
                                  }}
                                  style={{
                                    marginTop: 8,
                                    background: "none",
                                    border: "none",
                                    color: "#6366f1",
                                    cursor: "pointer",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    padding: 0,
                                    fontFamily: "inherit",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    transition: "color 0.2s"
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = "#4f46e5")}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
                                >
                                  {expandedReviews.has(r.idAvis) ? (
                                    <>
                                      <ChevronLeft size={14} /> Voir moins
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight size={14} /> Voir plus
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {pRev.length > 0 && (
                  <div className="card" style={{ padding: "0 20px" }}>
                    <Pagination page={revPage} totalPages={revPages} onChange={setRevPage} />
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* ══════════════════════════════════════════════════════════
          MODAL — Modifier le profil
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditProfile(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 90 }}
            />
            <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                onClick={(e) => e.stopPropagation()}
                className="card"
                style={{ width: "min(100%, 620px)", maxHeight: "min(88vh, 760px)", display: "flex", flexDirection: "column", overflow: "hidden", pointerEvents: "auto" }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "18px 22px", borderBottom: "1px solid rgba(99,102,241,0.12)", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", flexShrink: 0 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, color: "#6366f1", marginBottom: 4 }}>Modifier le profil</h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>Mettez à jour vos informations puis enregistrez.</p>
                  </div>
                  <button onClick={() => setEditProfile(false)} style={{ width: 38, height: 38, borderRadius: 12, border: "1px solid #e0e7ff", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: 22, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                  {[
                    { key: "name",     label: "Nom complet" },
                    { key: "title",    label: "Spécialité" },
                    { key: "phone",    label: "Téléphone" },
                    { key: "location", label: "Région" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>{label}</label>
                      <input
                        className="input-field"
                        value={(profileDraft as unknown as Record<string, string>)[key]}
                        onChange={(e) => setProfileDraft((p) => ({ ...p, [key]: e.target.value }))}
                        placeholder={label}
                      />
                    </div>
                  ))}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Bio</label>
                    <textarea
                      className="input-field"
                      rows={4}
                      value={profileDraft.bio}
                      onChange={(e) => setProfileDraft((p) => ({ ...p, bio: e.target.value }))}
                      placeholder="Décrivez votre activité…"
                      style={{ resize: "vertical", minHeight: 90 }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "16px 22px 20px", borderTop: "1px solid rgba(99,102,241,0.12)", background: "rgba(255,255,255,0.92)", flexShrink: 0, flexWrap: "wrap" }}>
                  <button onClick={() => setEditProfile(false)} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid #dbe4ff", background: "white", color: "#4f46e5", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Annuler
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => { setProfileData({ ...profileDraft }); toast.success("Profil mis à jour"); setEditProfile(false); }}
                  >
                    <Save size={15} /> Sauvegarder
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          MODAL — Créer un service
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSvcModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSvcModal(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", zIndex: 90 }}
            />
            <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                onClick={(e) => e.stopPropagation()}
                className="card"
                style={{ width: "min(100%, 640px)", maxHeight: "min(88vh, 780px)", display: "flex", flexDirection: "column", overflow: "hidden", pointerEvents: "auto" }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "18px 22px", borderBottom: "1px solid rgba(99,102,241,0.12)", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", flexShrink: 0 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, color: "#6366f1", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                      <Layers size={18} /> Créer un service
                    </h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>Remplissez les informations du nouveau service.</p>
                  </div>
                  <button onClick={() => setShowSvcModal(false)} style={{ width: 38, height: 38, borderRadius: 12, border: "1px solid #e0e7ff", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: 22, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                    {[
                      { key: "nomService", label: "Nom du service", type: "text" },
                      { key: "region",     label: "Région",         type: "text" },
                      { key: "prix",       label: "Prix (DT)",      type: "number" },
                    ].map(({ key, label, type }) => (
                      <div key={key}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>{label}</label>
                        <input
                          type={type}
                          className="input-field"
                          value={(svcForm as unknown as Record<string, string>)[key]}
                          onChange={(e) => setSvcForm((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={label}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Catégorie</label>
                      <select className="input-field" value={svcForm.categorieId} onChange={(e) => setSvcForm((p) => ({ ...p, categorieId: e.target.value, sousCategorieId: "" }))}>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.nomCategorie}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Sous-catégorie</label>
                      <select className="input-field" value={svcForm.sousCategorieId} onChange={(e) => setSvcForm((p) => ({ ...p, sousCategorieId: e.target.value }))}>
                        {categories.find((c) => c.id === svcForm.categorieId)?.sousCategories?.map((s) => (
                          <option key={s.id} value={s.id}>{s.nomSousCategorie}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Description</label>
                    <textarea
                      className="input-field"
                      rows={4}
                      value={svcForm.description}
                      onChange={(e) => setSvcForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Décrivez le service…"
                      style={{ resize: "vertical", minHeight: 100 }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: "16px 22px 20px", borderTop: "1px solid rgba(99,102,241,0.12)", background: "rgba(255,255,255,0.92)", flexShrink: 0, flexWrap: "wrap" }}>
                  <button onClick={() => setShowSvcModal(false)} style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid #dbe4ff", background: "white", color: "#4f46e5", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Annuler
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => createSvcMutation.mutate()}
                    disabled={createSvcMutation.isPending}
                  >
                    <Plus size={15} />
                    {createSvcMutation.isPending ? "Création…" : "Créer le service"}
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
