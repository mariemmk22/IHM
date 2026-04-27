import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { Slider } from "@/components/ui/slider";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import type { ServiceDto } from "@/lib/serviceApi";
import { getServiceImage } from "@/lib/serviceImages";

const getDemoRating = (service: ServiceDto) => {
  const s = service as any;
  const id = Number(s.id ?? s.idService);

  if (id === 1) return 1;
  if (id === 2) return 3;
  if (id === 3) return 5;
  if (id === 4) return 1;
  if (id === 5) return 2;
  if (id === 6) return 4;

  return 1;
};

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  const { data, isLoading, isError } = useServices({
    nomService: searchQuery || undefined,
    region: selectedRegion !== "all" ? selectedRegion : undefined,
  });

  const services = (data ?? []) as ServiceDto[];
  const { data: categories = [] } = useCategories();

  const categoryOptions = useMemo(
    () =>
      categories.flatMap(
        (categorie) =>
          categorie.sousCategories?.map((sub) => {
            const sousCat = sub as any;

            return {
              id: String(sousCat.id ?? sousCat.idSousCategorie),
              name: `${categorie.nomCategorie} / ${sousCat.nomSousCategorie ?? sousCat.nom ?? "Sous-catégorie"}`,
            };
          }) ?? [],
      ),
    [categories],
  );

  const regionOptions = useMemo(
    () =>
      Array.from(
        new Set(services.map((service) => service.region).filter(Boolean)),
      ),
    [services],
  );

  const filteredServices = useMemo(
    () =>
      services.filter((service) => {
        const s = service as any;

        const serviceSousCategorieId = String(
          s.sousCategorie?.id ??
            s.sousCategorie?.idSousCategorie ??
            s.sousCategorieId
        );

        if (
          selectedCategory !== "all" &&
          serviceSousCategorieId !== selectedCategory
        ) {
          return false;
        }

        if (selectedRegion !== "all" && service.region !== selectedRegion) {
          return false;
        }

        if (parseInt(String(service.prix), 10) > maxPrice) {
          return false;
        }

        const currentRating = getDemoRating(service);

        if (minRating > 0 && currentRating !== minRating) {
          return false;
        }

        return true;
      }),
    [selectedCategory, selectedRegion, maxPrice, minRating, services],
  );

  const displayedServices = filteredServices;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tous les services</h1>
            <p className="text-muted-foreground mt-1">
              Trouvez le service idéal près de chez vous
            </p>
          </div>

          <div className="flex justify-center gap-3 w-full lg:flex-1">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                placeholder="Rechercher un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl"
              />
            </div>

            <Button
              variant="outline"
              className="h-11 rounded-xl lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.aside
            initial={false}
            animate={{
              width: showFilters ? "auto" : 0,
              opacity: showFilters ? 1 : 0,
            }}
            className={`lg:w-64 shrink-0 space-y-6 overflow-hidden ${
              !showFilters && "hidden"
            }`}
          >
            <div className="bg-card border border-border rounded-xl p-4 space-y-5 shadow-card">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">
                  Catégorie
                </label>

                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value)}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>

                    {categoryOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">
                  Région
                </label>

                <Select
                  value={selectedRegion}
                  onValueChange={(value) => setSelectedRegion(value)}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>

                    {regionOptions.map((region) => (
                      <SelectItem key={region} value={region}>
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">
                  Prix max (DT)
                </label>

                <Slider
                  value={[maxPrice]}
                  onValueChange={(value) => setMaxPrice(value[0])}
                  max={500}
                  step={10}
                  className="mt-3"
                />

                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 DT</span>
                  <span>{maxPrice} DT</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">
                  Note exacte
                </label>

                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setMinRating(n)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          n <= minRating
                            ? "fill-warning text-warning"
                            : "fill-muted text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {minRating > 0 && (
                  <button
                    type="button"
                    onClick={() => setMinRating(0)}
                    className="text-xs text-muted-foreground mt-2"
                  >
                    Annuler le filtre note
                  </button>
                )}
              </div>

              <Button
                className="w-full gradient-primary text-primary-foreground border-0 rounded-lg"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedRegion("all");
                  setMaxPrice(500);
                  setMinRating(0);
                  setSearchQuery("");
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </motion.aside>

          <div className="flex-1">
            {isError ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
                Impossible de charger les services. Veuillez réessayer.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="h-80 rounded-xl bg-secondary animate-pulse"
                    />
                  ))
                ) : displayedServices.length > 0 ? (
                  displayedServices.map((service, i) => {
                    const s = service as any;

                    return (
                      <motion.div
                        key={s.id ?? s.idService}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <ServiceCard
                          id={s.id ?? s.idService}
                          title={service.nomService}
                          provider={
                            service.prestataire
                              ? `${service.prestataire.nom ?? "Prestataire"} ${
                                  service.prestataire.prenom ?? ""
                                }`.trim() || `Prestataire #${service.prestataire.id}`
                              : "Prestataire"
                          }
                          category={
                            s.sousCategorie?.nom ??
                            s.sousCategorie?.nomSousCategorie ??
                            "Service"
                          }
                          region={service.region}
                          price={`${service.prix} DT`}
                          rating={getDemoRating(service)}
                          reviewCount={12}
                          image={getServiceImage({
                            nomService: service.nomService,
                            category:
                              s.sousCategorie?.nom ??
                              s.sousCategorie?.nomSousCategorie,
                            description: service.description,
                          })}
                        />
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                    Aucun service trouvé pour ces filtres.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}