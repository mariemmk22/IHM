import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Zap,
  Wrench,
  Paintbrush,
  Hammer,
  Sparkles,
  Scissors,
  Truck,
  Home,
  Leaf,
  Droplets,
  Grid,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ServiceCard } from "@/components/ServiceCard";
import { regions } from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { useServices } from "@/hooks/useServices";
import { getServiceImage, getCategoryImage } from "@/lib/serviceImages";
import type { ServiceDto } from "@/lib/serviceApi";
import heroBg from "@/assets/hero-bg.jpg";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const normalizeCategoryName = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getCategoryIcon = (categoryName: string): LucideIcon => {
  const n = normalizeCategoryName(categoryName);
  if (n.includes("electr")) return Zap;
  if (n.includes("plomb") || n.includes("canalis") || n.includes("sanitaire"))
    return Droplets;
  if (n.includes("peint") || n.includes("deco")) return Paintbrush;
  if (n.includes("bricol") || n.includes("renovat") || n.includes("maçon"))
    return Hammer;
  if (
    n.includes("menage") ||
    n.includes("nettoy") ||
    n.includes("proprete")
  )
    return Sparkles;
  if (n.includes("coiff") || n.includes("beaute")) return Scissors;
  if (
    n.includes("transport") ||
    n.includes("demenag") ||
    n.includes("livraison")
  )
    return Truck;
  if (n.includes("jardin") || n.includes("paysag")) return Leaf;
  if (n.includes("maison") || n.includes("domicile")) return Home;
  if (
    n.includes("repar") ||
    n.includes("maintenance") ||
    n.includes("installation")
  )
    return Wrench;
  return Grid;
};

// ─── Main ──────────────────────────────────────────────────────────────────────
const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [regionInput, setRegionInput] = useState("");

  const { data: categories = [] } = useCategories();
  const { data: featuredRaw, isLoading: featuredLoading } = useServices({});
  const featuredServices: ServiceDto[] = (featuredRaw as ServiceDto[]) ?? [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("q", searchInput.trim());
    if (regionInput && regionInput !== "all") params.set("region", regionInput);
    navigate(`/services${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Services à domicile"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-foreground/65" />
        </div>
        <div className="relative container mx-auto px-4 py-28 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white">
              Trouvez le{" "}
              <span className="text-gradient">prestataire idéal</span> près de
              chez vous
            </h1>
            <p className="text-lg mb-8 text-white/90">
              Plomberie, électricité, ménage et plus encore. Des professionnels
              vérifiés à votre service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── BARRE DE RECHERCHE — même style que ServicesPage ── */}
      <section className="relative z-10 mt-8 px-4 pb-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card border border-border shadow-2xl rounded-3xl p-2"
          >
            <div className="flex flex-col sm:flex-row gap-3 bg-muted/70 backdrop-blur-md p-3 rounded-3xl">
              {/* Champ texte — identique à ServicesPage */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Rechercher un service..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 h-11 border-0 bg-card text-foreground rounded-xl shadow-inner focus-visible:ring-primary"
                />
              </div>

              {/* Sélecteur région — identique à ServicesPage */}
              <Select value={regionInput} onValueChange={setRegionInput}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 border-0 bg-card rounded-xl shadow-inner gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Toutes les régions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Bouton — même gradient que ServicesPage */}
              <Button
                onClick={handleSearch}
                className="h-11 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white border-0 rounded-xl hover:shadow-xl transition-all font-semibold gap-2"
              >
                <Search className="w-4 h-4" />
                Rechercher
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATÉGORIES POPULAIRES ── */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Catégories populaires
              </h2>
              <p className="text-muted-foreground mt-1">
                Parcourez nos services par catégorie
              </p>
            </div>
            <Link to="/services">
              <Button
                variant="ghost"
                className="gap-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                Tout voir <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat, i) => {
              const count =
                cat.sousCategories?.reduce((total, sub) => {
                  return (
                    total +
                    (featuredServices?.filter(
                      (s) => s.sousCategorie?.id === sub.id
                    ).length || 0)
                  );
                }, 0) ?? 0;
              const Icon = getCategoryIcon(cat.nomCategorie || "");
              const categoryImage =
                (cat as unknown as { imageUrl?: string }).imageUrl ||
                getCategoryImage(cat.nomCategorie || "");
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() =>
                    navigate(
                      `/services?q=${encodeURIComponent(cat.nomCategorie)}`
                    )
                  }
                  className="relative overflow-hidden rounded-xl border border-border cursor-pointer group h-48 sm:h-40"
                >
                  <img
                    src={categoryImage}
                    alt={cat.nomCategorie}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="relative h-full p-4 flex flex-col justify-end hover:border-primary/30 hover:shadow-soft transition-all duration-300">
                    <Icon className="w-5 h-5 mb-2 text-white" />
                    <p className="text-sm font-semibold text-white mb-1">
                      {cat.nomCategorie}
                    </p>
                    <p className="text-xs text-white/80">{count} services</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── SERVICES recommandés ── */}
      <section className="bg-secondary/30">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Services recommandés
              </h2>
              <p className="text-muted-foreground mt-1">
                Les mieux notés par nos clients
              </p>
            </div>
            <Link to="/services">
              <Button
                variant="ghost"
                className="gap-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                Voir tout <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <motion.div key={index} variants={fadeUp}>
                    <div className="h-80 rounded-xl bg-secondary animate-pulse" />
                  </motion.div>
                ))
              : featuredServices.slice(0, 6).map((service) => {
                  const providerName = service.prestataire
                    ? `${service.prestataire.prenom ?? ""} ${service.prestataire.nom ?? ""}`.trim() ||
                      `Prestataire #${service.prestataire.id}`
                    : "Prestataire";
                  return (
                    <motion.div key={service.id} variants={fadeUp}>
                      <ServiceCard
                        id={String(service.id)}
                        title={service.nomService}
                        provider={providerName}
                        category={service.sousCategorie?.nom ?? "Service"}
                        region={service.region}
                        price={`${service.prix} DT`}
                        rating={0}
                        reviewCount={0}
                        image={
                          (service as unknown as { imageUrl?: string }).imageUrl ||
                          getServiceImage({
                            nomService: service.nomService,
                            category: service.sousCategorie?.nom,
                            description: service.description,
                          })
                        }
                      />
                    </motion.div>
                  );
                })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Devenir prestataire ── */}
      {(!isAuthenticated || user?.role === "client") && (
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Vous êtes un professionnel ?
            </h2>
            <p className="mb-8 max-w-lg mx-auto text-white/90 text-lg">
              Rejoignez notre réseau de prestataires et développez votre
              activité. Inscription gratuite !
            </p>
            <Link to="/auth?tab=register&role=provider">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-white/90 font-semibold text-lg px-10 h-14 rounded-2xl transition-all shadow-lg hover:shadow-xl"
              >
                Devenir prestataire
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </section>
      )}

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default Index;
