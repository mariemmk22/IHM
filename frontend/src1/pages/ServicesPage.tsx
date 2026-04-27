import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { regions } from "@/data/mockData";
import { Slider } from "@/components/ui/slider";
import { useServices } from "@/hooks/useServices";
import { useCategories } from "@/hooks/useCategories";
import type { ServiceDto } from "@/lib/serviceApi";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  const { data, isLoading, isError } = useServices({
    nomService: searchQuery || undefined,
    region: selectedRegion !== "all" ? selectedRegion : undefined,
  });
  const services = (data ?? []) as ServiceDto[];

  const { data: categories = [] } = useCategories();

  const categoryOptions = useMemo(
    () => categories.flatMap((categorie) =>
      categorie.sousCategories?.map((sub) => ({
        id: sub.id,
        name: sub.nomSousCategorie,
      })) ?? [],
    ),
    [categories],
  );

  const filteredServices = useMemo(
    () => services.filter((service) => {
      if (selectedCategory === "all") return true;
      return service.sousCategorie?.id === selectedCategory;
    }),
    [selectedCategory, services],
  );

  const displayedServices = filteredServices;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Tous les services</h1>
          <p className="text-muted-foreground mt-1">Trouvez le service idéal près de chez vous</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <motion.aside
            initial={false}
            animate={{ width: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
            className={`lg:w-64 shrink-0 space-y-6 overflow-hidden ${!showFilters && "hidden"}`}
          >
            <div className="bg-card border border-border rounded-xl p-4 space-y-5 shadow-card">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Catégorie</label>
                <Select onValueChange={(value) => setSelectedCategory(value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {categoryOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Région</label>
                <Select onValueChange={(value) => setSelectedRegion(value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}><MapPin className="w-3 h-3 inline mr-1" />{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Prix max (DA)</label>
                <Slider defaultValue={[20000]} max={50000} step={1000} className="mt-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 DA</span><span>50 000 DA</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Note minimum</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} className="p-1 hover:scale-110 transition-transform">
                      <Star className="w-5 h-5 fill-warning text-warning" />
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full gradient-primary text-primary-foreground border-0 rounded-lg" onClick={() => setShowFilters(false)}>
                Appliquer les filtres
              </Button>
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
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
                  displayedServices.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ServiceCard
                        id={service.id}
                        title={service.nomService}
                        provider={service.prestataire ? `${service.prestataire.nom} ${service.prestataire.prenom}` : "Prestataire"}
                        category={service.sousCategorie?.nom ?? "Service"}
                        region={service.region}
                        price={`${service.prix} DA`}
                        rating={4.5}
                        reviewCount={12}
                        image={`https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80`}
                      />
                    </motion.div>
                  ))
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
