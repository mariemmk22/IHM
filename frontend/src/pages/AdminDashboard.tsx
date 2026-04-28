import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  Check,
  X,
  Eye,
  Ban,
  UserCheck,
  FileText,
  Tag,
  Star,
  Bell,
  TrendingUp,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  Edit,
  FolderTree,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatsCard } from "@/components/StatsCard";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getAdminUsers,
  blockClient,
  blockPrestataire,
  activatePrestataire,
  getAllDocuments,
  verifyDocument,
  getAllServices,
  getAllAvis,
  deleteAvis,
  type AdminUser,
  type AdminDocument,
  type AdminService,
  type AdminAvis,
} from "@/lib/adminApi";

type Provider = {
  id: string;
  name: string;
  specialty: string;
  region: string;
  date: string;
  docs: string;
  status: "en attente" | "accepté" | "refusé";
};

type Category = {
  id: string;
  name: string;
  subCategories: string[];
};

type ServiceItem = {
  id: string;
  title: string;
  provider: string;
  category: string;
  price: string;
  status: "actif" | "inactif";
};

const initialProviders: Provider[] = [
  {
    id: "1",
    name: "Ahmed Benali",
    specialty: "Plomberie",
    region: "Alger",
    date: "2026-04-12",
    docs: "CV, Diplôme",
    status: "en attente",
  },
  {
    id: "2",
    name: "Karim Hadj",
    specialty: "Électricité",
    region: "Oran",
    date: "2026-04-11",
    docs: "CV, Certificat",
    status: "en attente",
  },
  {
    id: "3",
    name: "Youcef Bouzid",
    specialty: "Peinture",
    region: "Constantine",
    date: "2026-04-10",
    docs: "CV",
    status: "en attente",
  },
];

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Maison",
    subCategories: ["Plomberie", "Électricité", "Peinture"],
  },
  {
    id: "2",
    name: "Nettoyage",
    subCategories: ["Nettoyage maison", "Nettoyage bureau"],
  },
  {
    id: "3",
    name: "Jardinage",
    subCategories: ["Tonte gazon", "Entretien jardin"],
  },
];

const initialServices: ServiceItem[] = [
  {
    id: "1",
    title: "Réparation fuite d'eau",
    provider: "Ahmed Benali",
    category: "Plomberie",
    price: "50 DT",
    status: "actif",
  },
  {
    id: "2",
    title: "Installation prise électrique",
    provider: "Karim Hadj",
    category: "Électricité",
    price: "70 DT",
    status: "actif",
  },
  {
    id: "3",
    title: "Peinture chambre",
    provider: "Youcef Bouzid",
    category: "Peinture",
    price: "120 DT",
    status: "inactif",
  },
];

const reportedReviews = [
  {
    id: "1",
    client: "User123",
    provider: "Ahmed B.",
    rating: 1,
    comment: "Contenu inapproprié signalé...",
    service: "Plomberie",
  },
  {
    id: "2",
    client: "User456",
    provider: "Karim H.",
    rating: 2,
    comment: "Spam détecté...",
    service: "Électricité",
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [realServices, setRealServices] = useState<AdminService[]>([]);
  const [avis, setAvis] = useState<AdminAvis[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [searchUser, setSearchUser] = useState("");
  const [searchService, setSearchService] = useState("");

  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("1");

  useEffect(() => {
    loadUsers();
    loadDocuments();
    loadServices();
    loadAvis();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch {
      toast.error("Impossible de charger les utilisateurs");
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await getAllDocuments();
      setDocuments(data);
    } catch {
      toast.error("Impossible de charger les documents");
    }
  };

  const loadServices = async () => {
    try {
      const data = await getAllServices();
      setRealServices(data);
    } catch {
      toast.error("Impossible de charger les services");
    }
  };

  const loadAvis = async () => {
    try {
      const data = await getAllAvis();
      setAvis(data);
    } catch {
      toast.error("Impossible de charger les avis");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.role}`
        .toLowerCase()
        .includes(searchUser.toLowerCase())
    );
  }, [users, searchUser]);

  const filteredServices = useMemo(() => {
    return realServices.filter((s) =>
      `${s.nomService} ${s.prestataire?.nom ?? ""} ${s.sousCategorie?.nom ?? ""}`
        .toLowerCase()
        .includes(searchService.toLowerCase())
    );
  }, [realServices, searchService]);

  const stats = useMemo(() => {
    const clients = users.filter((u) => u.role === "Client").length;
    const prestataires = users.filter((u) => u.role === "Prestataire").length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const blockedUsers = users.filter((u) => u.status === "blocked").length;
    const servicesActifs = realServices.length;
    const documentsAttente = documents.filter((d) => d.statut === "en_attente").length;

    return { clients, prestataires, activeUsers, blockedUsers, servicesActifs, documentsAttente };
  }, [users, realServices, documents]);

  const chartData = useMemo(() => {
    return [
      { label: "Clients", value: stats.clients },
      { label: "Prestataires", value: stats.prestataires },
      { label: "Utilisateurs actifs", value: stats.activeUsers },
      { label: "Comptes bloqués", value: stats.blockedUsers },
      { label: "Services actifs", value: stats.servicesActifs },
      { label: "Docs attente", value: stats.documentsAttente },
    ];
  }, [stats]);

  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1);

  const blockOrActivateUser = async (user: AdminUser) => {
    try {
      if (user.status === "active") {
        if (user.role === "Client") {
          await blockClient(user.rawId);
        } else {
          await blockPrestataire(user.rawId);
        }

        toast.success("Compte bloqué");
      } else {
        if (user.role === "Prestataire") {
          await activatePrestataire(user.rawId);
        } else {
          toast.error("Activation client non configurée dans l’API");
          return;
        }

        toast.success("Compte activé");
      }

      await loadUsers();
    } catch (error) {
      toast.error("Erreur lors de la modification du compte");
    }
  };

  const acceptProvider = async (id: number) => {
    try {
      await verifyDocument(id, "accepte");
      toast.success("Document accepté, compte prestataire activé");
      await loadDocuments();
    } catch {
      toast.error("Erreur lors de l'acceptation");
    }
  };

  const refuseProvider = async (id: number) => {
    try {
      await verifyDocument(id, "refuse");
      toast.error("Document refusé");
      await loadDocuments();
    } catch {
      toast.error("Erreur lors du refus");
    }
  };

  const addCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Écris le nom de la catégorie");
      return;
    }

    setCategories((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newCategory,
        subCategories: [],
      },
    ]);

    setNewCategory("");
    toast.success("Catégorie ajoutée");
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Catégorie supprimée");
  };

  const addSubCategory = () => {
    if (!newSubCategory.trim()) {
      toast.error("Écris le nom de la sous-catégorie");
      return;
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategoryId
          ? {
              ...cat,
              subCategories: [...cat.subCategories, newSubCategory],
            }
          : cat
      )
    );

    setNewSubCategory("");
    toast.success("Sous-catégorie ajoutée");
  };

  const deleteSubCategory = (categoryId: string, subName: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subCategories: cat.subCategories.filter((s) => s !== subName),
            }
          : cat
      )
    );

    toast.success("Sous-catégorie supprimée");
  };

  const navItems = [
    { id: "overview", label: "Tableau de bord", icon: BarChart3 },
    { id: "users", label: "Gérer comptes", icon: Users },
    { id: "providers", label: "Documents prestataires", icon: FileText },
    { id: "categories", label: "Catégories", icon: Tag },
    { id: "subcategories", label: "Sous-catégories", icon: FolderTree },
    { id: "services", label: "Consulter services", icon: Briefcase },
    { id: "reviews", label: "Avis", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex">

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 shadow-sm fixed top-0 left-0 h-full z-40">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900">ServiDom</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Administration</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}`} />
                <span className="truncate">{item.label}</span>
                {item.id === "providers" && stats.documentsAttente > 0 && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>
                    {stats.documentsAttente}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom — user + logout */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-indigo-700">AD</span>
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Admin</p>
              <p className="text-[10px] text-slate-400 truncate">Administrateur</p>
            </div>
          </div>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Déconnexion
          </Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 h-14">
            <div>
              <h1 className="text-base font-bold text-slate-900">
                {navItems.find(n => n.id === activeTab)?.label ?? "Administration"}
              </h1>
              <p className="text-xs text-slate-400">Gestion complète de la plateforme ServiDom</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <Bell className="w-4 h-4 text-slate-500" />
                {stats.documentsAttente > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {stats.documentsAttente}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 md:p-6 space-y-6">
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  icon={Users}
                  label="Clients"
                  value={stats.clients}
                  change={`${users.filter((u) => u.role === "Client" && u.status === "active").length} actifs`}
                  positive
                />

                <StatsCard
                  icon={UserCheck}
                  label="Prestataires"
                  value={stats.prestataires}
                  change={`${users.filter((u) => u.role === "Prestataire" && u.status === "active").length} actifs`}
                  positive
                />

                <StatsCard
                  icon={Briefcase}
                  label="Services actifs"
                  value={stats.servicesActifs}
                  change={`${realServices.length} au total`}
                  positive
                />

                <StatsCard
                  icon={AlertTriangle}
                  label="Documents en attente"
                  value={stats.documentsAttente}
                  change="À vérifier"
                />
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-card">
                <h2 className="text-lg font-semibold text-card-foreground mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Statistiques dynamiques de la plateforme
                </h2>

                <div className="h-64 flex items-end justify-center gap-8">
                  {chartData.map((item, index) => {
                    const height = (item.value / maxChartValue) * 180;

                    return (
                      <div
                        key={item.label}
                        className="flex flex-col items-center gap-3"
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {item.value}
                        </span>

                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ delay: index * 0.08, duration: 0.5 }}
                          className="w-14 rounded-t-xl gradient-primary"
                        />

                        <span className="text-xs text-muted-foreground text-center w-24">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Gérer les comptes clients / prestataires
                </h2>

                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Rechercher client/prestataire..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm outline-none"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{u.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            u.status === "active"
                              ? "bg-success/10 text-success border-0"
                              : "bg-destructive/10 text-destructive border-0"
                          }
                        >
                          {u.status === "active" ? "Actif" : "Bloqué"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(u.joined).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right">
                          <Button
                          size="icon"
                          variant="outline"
                          title={u.status === "active" ? "Bloquer" : "Activer"}
                          onClick={() => blockOrActivateUser(u)}
                          className={
                            u.status === "active"
                              ? "text-destructive"
                              : "text-success"
                          }
                        >
                          {u.status === "active" ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-6"
                      >
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "providers" && (
            <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Vérifier documents prestataire
                </h2>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prestataire</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Région</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {documents.length > 0 ? documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.prestataire?.client?.prenom} {doc.prestataire?.client?.nom}
                      </TableCell>
                      <TableCell>{doc.prestataire?.specialite}</TableCell>
                      <TableCell>{doc.prestataire?.client?.region || "N/A"}</TableCell>
                      <TableCell>
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}/api/documents/download/${doc.fichier}`}
                          download
                        >
                          <Badge variant="outline" className="cursor-pointer flex items-center gap-1 w-fit hover:bg-primary/10">
                            <FileText className="w-3 h-3" /> Télécharger CV
                          </Badge>
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          doc.statut === "accepte" ? "bg-success/10 text-success border-0"
                          : doc.statut === "refuse" ? "bg-destructive/10 text-destructive border-0"
                          : "bg-warning/10 text-warning border-0"
                        }>
                          {doc.statut === "en_attente" ? "En attente" : doc.statut === "accepte" ? "Accepté" : "Refusé"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(doc.dateDepot).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" title="Télécharger CV"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}/api/documents/download/${doc.fichier}`;
                              link.download = doc.fichier;
                              link.click();
                            }}>
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-success" title="Accepter"
                            onClick={() => acceptProvider(doc.id)} disabled={doc.statut !== "en_attente"}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" title="Refuser"
                            onClick={() => refuseProvider(doc.id)} disabled={doc.statut !== "en_attente"}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                        Aucun document à vérifier
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="space-y-5">
              {/* Add form */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  Nouvelle catégorie
                </h2>
                <div className="flex gap-3">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    placeholder="Nom de la catégorie..."
                    className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                  />
                  <button
                    onClick={addCategory}
                    className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{cat.name}</p>
                          <p className="text-xs text-slate-400">{cat.subCategories.length} sous-catégorie{cat.subCategories.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subCategories.length > 0 ? cat.subCategories.map((sub) => (
                        <span key={sub} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full font-medium">{sub}</span>
                      )) : (
                        <span className="text-xs text-slate-400 italic">Aucune sous-catégorie</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "subcategories" && (
            <div className="space-y-4">
              {/* Add form */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-indigo-500" />
                  Ajouter une sous-catégorie
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <input
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubCategory()}
                    placeholder="Nom de la sous-catégorie..."
                    className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                  />
                  <button
                    onClick={addSubCategory}
                    className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>

              {/* List */}
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <FolderTree className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">{cat.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                      {cat.subCategories.length}
                    </span>
                  </div>
                  {/* Tags */}
                  <div className="px-5 py-4">
                    {cat.subCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {cat.subCategories.map((sub) => (
                          <div
                            key={sub}
                            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-700 hover:border-red-200 hover:bg-red-50 group/tag transition-colors"
                          >
                            {sub}
                            <button
                              onClick={() => deleteSubCategory(cat.id, sub)}
                              className="text-slate-300 group-hover/tag:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">Aucune sous-catégorie</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "services" && (
            <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Consulter services ({filteredServices.length})
                </h2>
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    placeholder="Rechercher service..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm outline-none"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Prestataire</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Région</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length > 0 ? filteredServices.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.nomService}</TableCell>
                      <TableCell>
                        {s.prestataire ? `${s.prestataire.prenom} ${s.prestataire.nom}` : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{s.sousCategorie?.nom ?? "—"}</Badge>
                      </TableCell>
                      <TableCell>{s.prix ? `${s.prix} DT` : "—"}</TableCell>
                      <TableCell>{s.region ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Voir détails"
                          onClick={() => toast.info(`${s.nomService} — ${s.prix ?? "?"} DT`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                        Aucun service trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning" />
                  Gérer les avis ({avis.length})
                </h2>
              </div>

              <div className="divide-y divide-border">
                {avis.length > 0 ? avis.map((r) => (
                  <div
                    key={r.idAvis}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {r.client ? `${r.client.prenom} ${r.client.nom}` : "Client inconnu"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          → {r.prestataire ? `${r.prestataire.prenom} ${r.prestataire.nom}` : "Prestataire inconnu"}
                        </span>
                        <div className="flex gap-0.5 ml-2">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3 h-3 ${j < r.rating ? "fill-warning text-warning" : "text-border"}`}
                            />
                          ))}
                        </div>
                        {r.service && (
                          <Badge variant="outline" className="text-xs">{r.service.nomService}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {r.comment || <span className="italic">Aucun commentaire</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(r.dateAvis).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="icon"
                        variant="outline"
                        title="Supprimer l'avis"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={async () => {
                          try {
                            await deleteAvis(r.idAvis);
                            toast.success("Avis supprimé");
                            await loadAvis();
                          } catch {
                            toast.error("Erreur lors de la suppression");
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Aucun avis pour le moment
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-card border border-border rounded-xl shadow-card p-5">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-primary" />
                Paramètres admin
              </h2>

              <p className="text-sm text-muted-foreground">
                Ici tu peux ajouter plus tard les paramètres généraux de la
                plateforme : nom de l’application, contact, règles de validation,
                etc.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}