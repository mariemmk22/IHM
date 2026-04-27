import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star, Shield, Clock, CheckCircle, Briefcase, Calendar, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceCard } from "@/components/ServiceCard";
import { regions } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { useServices } from "@/hooks/useServices";
import heroBg from "@/assets/hero-bg.jpg";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { data: categories = [] } = useCategories();
  const { data: services = [], isLoading: servicesLoading } = useServices({});
  const filteredServices = useMemo(
    () => (services ?? []).filter((service) =>
      !searchQuery || service.nomService.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
    [searchQuery, services],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Provider quick-access banner */}
      {isAuthenticated && (user?.role === "prestataire" || user?.role === "provider") && (
        <div className="bg-primary/5 border-b border-primary/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Espace Prestataire — Bonjour, <span className="text-primary">{user.prenom}</span> !
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/provider">
                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs border-primary/30 text-primary hover:bg-primary/5">
                  <TrendingUp className="w-3 h-3" /> Tableau de bord
                </Button>
              </Link>
              <Link to="/provider">
                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs border-primary/30 text-primary hover:bg-primary/5">
                  <Calendar className="w-3 h-3" /> Rendez-vous
                </Button>
              </Link>
              <Link to="/provider">
                <Button size="sm" className="gap-1.5 h-8 text-xs gradient-primary text-primary-foreground border-0 hover:opacity-90">
                  <Plus className="w-3 h-3" /> Ajouter service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Client welcome banner */}
      {isAuthenticated && user?.role === "client" && (
        <div className="bg-primary/5 border-b border-primary/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Bonjour, <span className="text-primary">{user.prenom}</span> ! Trouvez votre prestataire idéal.
              </span>
            </div>
            <Link to="/client">
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs border-primary/30 text-primary hover:bg-primary/5">
                <Calendar className="w-3 h-3" /> Mes rendez-vous
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Services à domicile" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ color: "hsl(0, 0%, 100%)" }}>
              Trouvez le <span className="text-gradient">prestataire idéal</span> près de chez vous
            </h1>
            <p className="text-lg mb-8" style={{ color: "hsl(0, 0%, 85%)" }}>
              Plomberie, électricité, ménage et plus encore. Des professionnels vérifiés à votre service.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 bg-card/95 backdrop-blur-md p-3 rounded-2xl shadow-soft">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-0 bg-secondary/50 rounded-xl"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px] h-12 border-0 bg-secondary/50 rounded-xl">
                  <SelectValue placeholder="Région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="h-12 px-8 gradient-primary text-primary-foreground border-0 rounded-xl hover:opacity-90 transition-opacity">
                Rechercher
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: "2 500+", label: "Prestataires vérifiés", icon: Shield },
              { value: "15 000+", label: "Services réalisés", icon: CheckCircle },
              { value: "48 wilayas", label: "Couverture nationale", icon: Star },
              { value: "24/7", label: "Support disponible", icon: Clock },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center space-y-1">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Catégories populaires</h2>
              <p className="text-muted-foreground mt-1">Parcourez nos services par catégorie</p>
            </div>
            <Link to="/services">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary">
                Tout voir <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat, i) => {
              const count = cat.sousCategories?.reduce((total, sub) => {
                return total + (services?.filter((service) => service.sousCategorie?.id === sub.id).length || 0);
              }, 0) ?? 0;

              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card border border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                >
                  <p className="text-sm font-semibold text-card-foreground mb-1">{cat.nomCategorie}</p>
                  <p className="text-xs text-muted-foreground">{count} services</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="bg-secondary/30">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Services recommandés</h2>
              <p className="text-muted-foreground mt-1">Les mieux notés par nos clients</p>
            </div>
            <Link to="/services">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary">
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
            {(servicesLoading ? Array.from({ length: 6 }) : filteredServices.slice(0, 6)).map((service, index) => (
              <motion.div key={(service as any)?.id ?? index} variants={fadeUp}>
                {servicesLoading ? (
                  <div className="h-80 rounded-xl bg-secondary animate-pulse" />
                ) : (
                  <ServiceCard {...service} />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA - only show for non-authenticated or client users */}
      {(!isAuthenticated || user?.role === "client") && (
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gradient-primary rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "hsl(0, 0%, 100%)" }}>
            Vous êtes un professionnel ?
          </h2>
          <p className="mb-6 max-w-lg mx-auto" style={{ color: "hsl(0, 0%, 90%)" }}>
            Rejoignez notre réseau de prestataires et développez votre activité. Inscription gratuite !
          </p>
          <Link to="/auth?tab=register&role=provider">
            <Button size="lg" variant="outline" className="bg-card text-primary border-0 hover:bg-card/90 rounded-xl font-semibold">
              Devenir prestataire <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;