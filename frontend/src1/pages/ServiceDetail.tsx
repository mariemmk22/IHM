import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useServiceDetail } from "@/hooks/useServiceDetail";

export default function ServiceDetail() {
  const { id } = useParams();
  const { data: service, isLoading, isError } = useServiceDetail(id);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Chargement du service...</div>;
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-destructive">
          <h2 className="text-2xl font-semibold mb-2">Service introuvable</h2>
          <p>Impossible de récupérer les informations du service. Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 lg:grid-cols-[2fr_1fr]"
        >
          <section className="space-y-6">
            <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-card">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                alt={service.nomService}
                className="h-80 w-full object-cover"
              />
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{service.sousCategorie?.nom ?? "Service"}</p>
                  <h1 className="text-3xl font-bold text-foreground">{service.nomService}</h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold text-primary">{service.prix} DA</p>
                  <p className="text-sm text-muted-foreground">{service.region}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 mb-6">
                <Badge className="bg-secondary/80 text-muted-foreground">{service.sousCategorie?.nom ?? "Catégorie"}</Badge>
                <Badge className="bg-secondary/80 text-muted-foreground">{service.region}</Badge>
                <Badge className="bg-secondary/80 text-muted-foreground">{service.prestataire?.specialite ?? "Prestataire"}</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">Description</h2>
                  <p className="text-sm leading-7 text-muted-foreground">{service.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-border bg-secondary/60 p-5">
                    <p className="text-sm text-muted-foreground mb-2">Prestataire</p>
                    <p className="font-semibold text-foreground">{service.prestataire?.client ? `${service.prestataire.client.nom} ${service.prestataire.client.prenom}` : "Prestataire"}</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-secondary/60 p-5">
                    <p className="text-sm text-muted-foreground mb-2">Avis</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-semibold">4.5</span>
                      <span className="text-muted-foreground">(12 avis)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Prestataire</p>
                  <p className="font-semibold text-foreground">{service.prestataire?.client ? `${service.prestataire.client.nom} ${service.prestataire.client.prenom}` : "Anonyme"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Spécialité</span>
                  <span>{service.prestataire?.specialite ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Disponibilité</span>
                  <span>{service.prestataire?.disponibilite ? "Oui" : "Non"}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Région</span>
                  <span>{service.region}</span>
                </div>
              </div>

              <Button className="w-full mt-6">Réserver ce service</Button>
            </div>

            <div className="rounded-3xl border border-border bg-secondary/70 p-6 shadow-card">
              <h2 className="text-lg font-semibold text-foreground mb-4">Détails du service</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Date</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Durée estimée</span>
                  <span>2h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Équipement</span>
                  <span>Inclus</span>
                </div>
              </div>
            </div>
          </aside>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
