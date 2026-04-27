import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useServiceDetail } from "@/hooks/useServiceDetail";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClientRendezVous } from "@/lib/rendezVousApi";
import { getAvisByService } from "@/lib/avisApi";
import { getServiceImage } from "@/lib/serviceImages";
import { toast } from "sonner";

export default function ServiceDetail() {
  const { id } = useParams();
  const { data: service, isLoading, isError } = useServiceDetail(id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bookingForm, setBookingForm] = useState({
    dateRdv: "",
    heureRdv: "",
    adresseIntervention: "",
    description: "",
  });

  const { data: serviceReviews = [] } = useQuery({
    queryKey: ["service-reviews", id],
    queryFn: () => getAvisByService(id ?? ""),
    enabled: Boolean(id),
  });

  const createBookingMutation = useMutation({
    mutationFn: () => {
      if (!service?.id) {
        throw new Error("Service introuvable");
      }

      if (!bookingForm.dateRdv || !bookingForm.heureRdv || !bookingForm.adresseIntervention) {
        throw new Error("Veuillez remplir la date, l'heure et l'adresse");
      }

      return createClientRendezVous({
        serviceId: service.id,
        dateRdv: bookingForm.dateRdv,
        heureRdv: bookingForm.heureRdv,
        adresseIntervention: bookingForm.adresseIntervention,
        description: bookingForm.description,
      });
    },
    onSuccess: () => {
      toast.success("Rendez-vous créé avec succès");
      setBookingForm({ dateRdv: "", heureRdv: "", adresseIntervention: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "client", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Impossible de créer le rendez-vous");
    },
  });

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

  const providerName = [
    service.prestataire?.prenom ?? service.prestataire?.client?.prenom,
    service.prestataire?.nom ?? service.prestataire?.client?.nom,
  ].filter(Boolean).join(" ").trim() || "Anonyme";

  const providerAvailability =
    typeof service.prestataire?.disponibilite === "boolean"
      ? (service.prestataire.disponibilite ? "Oui" : "Non")
      : "Inconnue";

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
                src={getServiceImage({
                  nomService: service.nomService,
                  category: service.sousCategorie?.nom,
                  description: service.description,
                })}
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
                  <p className="text-3xl font-semibold text-primary">{service.prix} DT</p>
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
                  <p className="font-semibold text-foreground">{providerName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Spécialité</span>
                  <span>{service.prestataire?.specialite ?? "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Disponibilité</span>
                  <span>{providerAvailability}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Région</span>
                  <span>{service.region}</span>
                </div>
              </div>

              {user?.role === "client" ? (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Date</label>
                      <input
                        type="date"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        value={bookingForm.dateRdv}
                        onChange={(event) => setBookingForm((current) => ({ ...current, dateRdv: event.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Heure</label>
                      <input
                        type="time"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                        value={bookingForm.heureRdv}
                        onChange={(event) => setBookingForm((current) => ({ ...current, heureRdv: event.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Adresse d'intervention</label>
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      value={bookingForm.adresseIntervention}
                      onChange={(event) => setBookingForm((current) => ({ ...current, adresseIntervention: event.target.value }))}
                      placeholder="Adresse complète"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
                    <textarea
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm min-h-24"
                      value={bookingForm.description}
                      onChange={(event) => setBookingForm((current) => ({ ...current, description: event.target.value }))}
                      placeholder="Décrivez le besoin"
                    />
                  </div>
                  <Button className="w-full mt-2" onClick={() => createBookingMutation.mutate()} disabled={createBookingMutation.isPending}>
                    {createBookingMutation.isPending ? "Création..." : "Réserver ce service"}
                  </Button>
                </div>
              ) : (
                <Button className="w-full mt-6" asChild>
                  <a href="/auth">Connectez-vous pour réserver</a>
                </Button>
              )}
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

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">Avis clients</h2>
                <Badge className="bg-secondary/80 text-muted-foreground">{serviceReviews.length} avis</Badge>
              </div>
              <div className="space-y-3 max-h-80 overflow-auto pr-1">
                {serviceReviews.length > 0 ? serviceReviews.map((review) => (
                  <div key={review.idAvis} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {review.client ? `${review.client.prenom} ${review.client.nom}` : "Client"}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(review.dateAvis).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="text-sm font-semibold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">Aucun avis pour ce service.</p>
                )}
              </div>
            </div>
          </aside>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
