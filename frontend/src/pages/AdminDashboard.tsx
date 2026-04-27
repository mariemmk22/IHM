import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Briefcase, ShieldCheck, BarChart3, Settings, LogOut, Home,
  Check, X, Eye, Ban, UserCheck, FileText, Tag, Star, Bell, TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatsCard } from "@/components/StatsCard";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const pendingProviders = [
  { id: "1", name: "Ahmed Benali", specialty: "Plomberie", region: "Alger", date: "2026-04-12", docs: "CV, Diplôme" },
  { id: "2", name: "Karim Hadj", specialty: "Électricité", region: "Oran", date: "2026-04-11", docs: "CV, Certificat" },
  { id: "3", name: "Youcef Bouzid", specialty: "Peinture", region: "Constantine", date: "2026-04-10", docs: "CV" },
];

const allUsers = [
  { id: "1", name: "Sara Meziane", email: "sara@email.com", role: "Client", status: "active", joined: "2026-01-15" },
  { id: "2", name: "Ahmed Benali", email: "ahmed@email.com", role: "Prestataire", status: "active", joined: "2026-02-20" },
  { id: "3", name: "Fatima Zohra", email: "fatima@email.com", role: "Prestataire", status: "blocked", joined: "2026-03-01" },
  { id: "4", name: "Ali Kaci", email: "ali@email.com", role: "Client", status: "active", joined: "2026-03-15" },
  { id: "5", name: "Nadia Boudia", email: "nadia@email.com", role: "Client", status: "active", joined: "2026-04-01" },
];

const reportedReviews = [
  { id: "1", client: "User123", provider: "Ahmed B.", rating: 1, comment: "Contenu inapproprié signalé...", service: "Plomberie" },
  { id: "2", client: "User456", provider: "Karim H.", rating: 2, comment: "Spam détecté...", service: "Électricité" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4">
        <Link to="/" className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-gradient">Admin</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {[
            { id: "overview", label: "Tableau de bord", icon: BarChart3 },
            { id: "users", label: "Utilisateurs", icon: Users },
            { id: "providers", label: "Vérifications", icon: FileText },
            { id: "categories", label: "Catégories", icon: Tag },
            { id: "services", label: "Services", icon: Briefcase },
            { id: "reviews", label: "Modération", icon: Star },
            { id: "settings", label: "Paramètres", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

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
              <h1 className="text-xl font-bold text-foreground">Administration</h1>
              <p className="text-sm text-muted-foreground">Gestion de la plateforme ServiDom</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">7</span>
              </Button>
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={Users} label="Clients" value="1 245" change="+12% ce mois" positive />
            <StatsCard icon={UserCheck} label="Prestataires" value="356" change="+8% ce mois" positive />
            <StatsCard icon={Briefcase} label="Services" value="892" change="+15% ce mois" positive />
            <StatsCard icon={AlertTriangle} label="En attente" value="3" change="Vérifications" />
          </div>

          {/* Chart placeholder */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Activité de la plateforme
            </h2>
            <div className="h-48 flex items-center justify-center">
              <div className="flex items-end gap-3 h-40">
                {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 75, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="w-8 gradient-primary rounded-t-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Jun</span>
              <span>Jul</span><span>Aoû</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
            </div>
          </div>

          {/* Pending verifications */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Vérifications en attente
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prestataire</TableHead>
                  <TableHead>Spécialité</TableHead>
                  <TableHead>Région</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingProviders.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.specialty}</TableCell>
                    <TableCell>{p.region}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{p.docs}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{p.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary"><Eye className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success" onClick={() => toast.success(`${p.name} accepté`)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => toast.error(`${p.name} refusé`)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Users table */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Utilisateurs
              </h2>
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
                {allUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={u.role === "Prestataire" ? "border-primary/30 text-primary" : "border-accent/30 text-accent"}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={u.status === "active" ? "bg-success/10 text-success border-0" : "bg-destructive/10 text-destructive border-0"}>
                        {u.status === "active" ? "Actif" : "Bloqué"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.info(`Action sur ${u.name}`)}>
                        {u.status === "active" ? <Ban className="w-4 h-4 text-destructive" /> : <UserCheck className="w-4 h-4 text-success" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Review moderation */}
          <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" /> Avis signalés
              </h2>
            </div>
            <div className="divide-y divide-border">
              {reportedReviews.map((r) => (
                <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-card-foreground">{r.client}</span>
                      <span className="text-xs text-muted-foreground">→ {r.provider}</span>
                      <div className="flex gap-0.5 ml-2">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className={`w-3 h-3 ${j < r.rating ? "fill-warning text-warning" : "text-border"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.success("Avis conservé")}>Conserver</Button>
                    <Button size="sm" variant="outline" className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => toast.success("Avis supprimé")}>Supprimer</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
