import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Home, Search, User, LogIn, LogOut,
  Briefcase, ChevronDown, Settings, Calendar, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import sloganImg from "@/assets/Preview-removebg-preview.png";

const baseNavLinks = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Services", href: "/services", icon: Search },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    navigate("/");
    setMobileOpen(false);
  };

  const getInitials = () => {
    if (!user) return "?";
    return `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase();
  };

  const dashboardLink = user?.role === "prestataire" || user?.role === "provider" ? "/provider" : "/client";

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center h-16 px-4">

        {/* Section gauche - Logo + Liens */}
        <div className="flex items-center gap-0">
          {/* SLOGAN - VERSION AGRANDIE FORCÉE */}
          <Link to="/" className="flex items-center group flex-shrink-0 -ml-2">
            <motion.img
              src={sloganImg}
              alt="Slogan"
              className="h-56 w-auto max-h-56 object-contain transition-all duration-300 group-hover:scale-105"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            />
          </Link>

          {/* Liens Accueil & Services - très proches du logo */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {baseNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-6 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
                location.pathname === link.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:text-primary hover:bg-secondary/80"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              to={dashboardLink}
              className={`px-6 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
                location.pathname === dashboardLink
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:text-primary hover:bg-secondary/80"
              }`}
            >
              Mon Profil
            </Link>
          )}
        </div>
        </div>

        {/* Section droite - Buttons poussée à droite */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {!isAuthenticated ? (
            <>
              <Link to="/devenir-prestataire">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:shadow-lg"
                >
                  <Briefcase className="w-4 h-4" />
                  Devenir Prestataire
                </Button>
              </Link>

              {location.pathname !== "/auth" && (
                <>
                  <Link to="/auth">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                    >
                      <LogIn className="w-4 h-4" /> Connexion
                    </Button>
                  </Link>

                  <Link to="/auth?tab=register">
                    <Button 
                      size="sm" 
                      className="gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90 transition-all font-medium"
                    >
                      <User className="w-4 h-4" /> Inscription
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              {user?.role === "client" && (
                <Link to="/devenir-prestataire">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:shadow-lg"
                  >
                    <Briefcase className="w-4 h-4" />
                    Devenir Prestataire
                  </Button>
                </Link>
              )}

              {(user?.role === "prestataire" || user?.role === "provider") && (
                <Badge variant="outline" className="border-primary/40 text-primary gap-1 px-3 py-1">
                  <Briefcase className="w-3 h-3" /> Prestataire
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-secondary transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium leading-none">{user?.prenom} {user?.nom}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary">
                    <Link to={dashboardLink} className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Mon profile
                    </Link>
                  </DropdownMenuItem>
                
                 
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive focus:bg-primary/10 gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu (simplifié) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="p-4 space-y-2">
              {baseNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              {/* ... le reste du menu mobile reste identique ... */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}