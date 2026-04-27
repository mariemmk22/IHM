import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Calendar, Star, MapPin, LogOut, Home, Heart,
  Clock, ChevronRight, Settings, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useClientDashboard } from "@/hooks/useClientDashboard";

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

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const { data: dashboard } = useClientDashboard(user?.id);

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
            { id: "overview", label: "Vue d'ensemble", icon: Home },
            { id: "appointments", label: "Rendez-vous", icon: Calendar },
            { id: "favorites", label: "Favoris", icon: Heart },
            { id: "reviews", label: "Mes avis", icon: Star },
            { id: "profile", label: "Mon profil", icon: User },
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
        {/* Header */}
        <header className="sticky top-0 z-10 glass border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Bonjour, Sara 👋</h1>
              <p className="text-sm text-muted-foreground">Bienvenue sur votre espace client</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">3</span>
              </Button>
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">SM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Rendez-vous", value: dashboard?.appointmentCount ?? 0, icon: Calendar, color: "text-primary" },
              { label: "Favoris", value: dashboard?.favoriteCount ?? 0, icon: Heart, color: "text-destructive" },
              { label: "Avis donnés", value: dashboard?.reviewCount ?? 0, icon: Star, color: "text-warning" },
              { label: "En attente", value: dashboard?.pendingAppointments ?? 0, icon: Clock, color: "text-accent" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-4 shadow-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent appointments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Rendez-vous récents</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                Voir tout <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {(dashboard?.recentAppointments ?? []).map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-card-foreground">{apt.service?.nomService ?? "Service"}</h3>
                    <p className="text-sm text-muted-foreground">{apt.providerSpecialite ?? "Prestataire"}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {apt.dateRdv}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.heureRdv}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {apt.adresseIntervention}</span>
                    </div>
                  </div>
                  <Badge className={`${statusColors[apt.statut]} border-0 text-xs`}>
                    {statusLabels[apt.statut] ?? apt.statut}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommended services */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Services recommandés</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(dashboard?.recommendedServices ?? []).map((service) => (
                <div key={service.id} className="bg-card border border-border rounded-xl p-4 shadow-card">
                  <div className="mb-3">
                    <h3 className="font-semibold text-card-foreground line-clamp-1">{service.nomService}</h3>
                    <p className="text-sm text-muted-foreground">{service.region}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-card-foreground">
                    <span className="font-semibold">{service.prix} €</span>
                    <span className="text-xs text-muted-foreground">Recommandé</span>
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
