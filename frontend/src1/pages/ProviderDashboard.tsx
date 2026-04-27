import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Briefcase, Calendar, Star, Settings, LogOut, Home, Plus,
  Check, X, Clock, MapPin, User, Eye, TrendingUp, Bell, Edit, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { useProviderDashboard } from "@/hooks/useProviderDashboard";
import { createService } from "@/lib/serviceApi";
import { toast } from "sonner";

const statusColors = {
  en_attente: "bg-warning/10 text-warning",
  accepte: "bg-success/10 text-success",
  annule: "bg-destructive/10 text-destructive",
};
const statusLabels = {
  en_attente: "En attente",
  accepte: "Accepté",
  annule: "Annulé",
};

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAvailable, setIsAvailable] = useState(true);
  const [showAddService, setShowAddService] = useState(false);
  const [nomService, setNomService] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [prix, setPrix] = useState("");
  const [sousCategorieId, setSousCategorieId] = useState("");

  const { user } = useAuth();
  const { data: dashboard, isLoading } = useProviderDashboard(user?.prestataireId);
  const { data: categories = [] } = useCategories();
  const queryClient = useQueryClient();

  const subCategories = categories.flatMap((category) =>
    category.sousCategories?.map((sub) => ({
      id: sub.id,
      label: `${category.nomCategorie} / ${sub.nomSousCategorie}`,
    })) ?? []
  );

  const addServiceMutation = useMutation({
    mutationFn: createService,
    onSuccess: async () => {
      toast.success("Service ajouté avec succès");
      setShowAddService(false);
      setNomService("");
      setDescription("");
      setRegion("");
      setPrix("");
      setSousCategorieId("");
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "provider", user?.prestataireId],
      })
    },
    onError: (error) => {
      toast.error("Échec de l'ajout du service");
      console.error(error);
    },
  });

  const handleAddService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.prestataireId) {
      toast.error("Impossible d'ajouter un service : identifiant prestataire manquant.");
      return;
    }

    if (!nomService || !region || !prix || !sousCategorieId) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    addServiceMutation.mutate({
      nomService,
      description,
      region,
      prix: Number(prix),
      prestataireId: user.prestataireId,
      sousCategorieId,
    });
  };

  const resetServiceForm = () => {
    setNomService("");
    setDescription("");
    setRegion("");
    setPrix("");
    setSousCategorieId("");
  };

  const handleAction = (action: string, id: string) => {
    toast.success(`Rendez-vous ${action} avec succès`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4">
        <Link to="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-gradient">ServiDom</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {[
            { id: "overview", label: "Tableau de bord", icon: TrendingUp },
            { id: "services", label: "Mes services", icon: Briefcase },
            { id: "appointments", label: "Rendez-vous", icon: Calendar },
            { id: "reviews", label: "Avis clients", icon: Star },
            { id: "profile", label: "Mon profil", icon: User },
            { id: "settings", label: "Paramètres", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Availability toggle */}
        <div className="border-t border-border pt-4 mb-4">
          <div className="flex items-center justify-between px-3">
            <span className="text-sm font-medium text-foreground">Disponible</span>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
          <p className="text-xs text-muted-foreground px-3 mt-1">
            {isAvailable ? "Vous recevez des demandes" : "En pause"}
          </p>
        </div>

        <Link to="/">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </Link>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 glass border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Espace Prestataire</h1>
              <p className="text-sm text-muted-foreground">Ahmed Benali — Plomberie</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={isAvailable ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"}>
                {isAvailable ? "● Disponible" : "● Indisponible"}
              </Badge>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">5</span>
              </Button>
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">AB</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Services actifs", value: dashboard?.serviceCount ?? 0, icon: Briefcase, color: "text-primary" },
              { label: "Rendez-vous", value: dashboard?.totalAppointments ?? 0, icon: Calendar, color: "text-accent" },
              { label: "Note moyenne", value: dashboard?.averageRating ? dashboard.averageRating.toFixed(1) : "N/A", icon: Star, color: "text-warning" },
              { label: "Vues profil", value: dashboard?.profileViews ?? 0, icon: Eye, color: "text-muted-foreground" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-4 shadow-card"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* My Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Mes services</h2>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="gap-2 gradient-primary text-primary-foreground border-0 rounded-lg"
                  onClick={() => setShowAddService((prev) => !prev)}
                >
                  <Plus className="w-4 h-4" /> {showAddService ? "Fermer" : "Ajouter"}
                </Button>
              </div>
            </div>
            {showAddService && (
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Ajouter un nouveau service</h3>
                <form onSubmit={handleAddService} className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Titre du service</label>
                    <Input value={nomService} onChange={(e) => setNomService(e.target.value)} placeholder="ex. Nettoyage de vitres" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Prix (€)</label>
                    <Input
                      type="number"
                      value={prix}
                      min={0}
                      step="0.01"
                      onChange={(e) => setPrix(e.target.value)}
                      placeholder="ex. 49.99"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Décrivez votre service"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Région</label>
                    <Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="ex. Casablanca" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Sous-catégorie</label>
                    <Select value={sousCategorieId} onValueChange={setSousCategorieId}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Choisir une sous-catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((sub) => (
                          <SelectItem key={sub.id} value={String(sub.id)}>{sub.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap gap-3 justify-end">
                    <Button type="button" variant="outline" className="rounded-lg" onClick={() => { setShowAddService(false); resetServiceForm(); }}>
                      Annuler
                    </Button>
                    <Button type="submit" className="rounded-lg" disabled={addServiceMutation.isPending}>
                      {addServiceMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(dashboard?.recentServices ?? []).map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-card"
                >
                  <div>
                    <h3 className="font-medium text-card-foreground">{s.nomService}</h3>
                    <p className="text-sm text-muted-foreground">{s.prix} € · {s.region}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Rendez-vous récents</h2>
            <div className="space-y-3">
              {(dashboard?.recentAppointments ?? []).map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-card-foreground">{apt.service?.nomService ?? "Service"}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {apt.dateRdv}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.heureRdv}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {apt.adresseIntervention}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusColors[apt.statut]} border-0 text-xs`}>
                        {statusLabels[apt.statut] ?? apt.statut}
                      </Badge>
                      {apt.statut === "en_attente" && (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success" onClick={() => handleAction("accepté", String(apt.id))}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleAction("refusé", String(apt.id))}>
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Avis clients</h2>
            <div className="space-y-3">
              {(dashboard?.recentReviews ?? []).map((review, i) => (
                <motion.div
                  key={review.idAvis}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-secondary text-xs">{review.client?.nom?.[0] ?? "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{review.client ? `${review.client.prenom} ${review.client.nom}` : "Client"}</p>
                        <p className="text-xs text-muted-foreground">{review.dateAvis} · {review.service?.nomService ?? "Service"}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "fill-warning text-warning" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
