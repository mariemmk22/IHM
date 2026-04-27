import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Search,
  User,
  LogIn,
  LogOut,
  Briefcase,
  ChevronDown,
  Settings,
  Calendar,
  Star,
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

  const isProvider = user?.role === "prestataire" || user?.role === "provider";
  const dashboardLink = isProvider ? "/provider?tab=profile" : "/client";

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-lg text-primary">ServiceApp</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {baseNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              to={dashboardLink}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === "/provider" || location.pathname === "/client"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Mon Profil
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/devenir-prestataire">
                <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary">
                  <Briefcase className="w-4 h-4" />
                  Devenir Prestataire
                </Button>
              </Link>

              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Button>
              </Link>

              <Link to="/auth?tab=register">
                <Button size="sm" className="gap-2 gradient-primary text-primary-foreground border-0">
                  <User className="w-4 h-4" />
                  Inscription
                </Button>
              </Link>
            </>
          ) : (
            <>
              {user?.role === "client" && (
                <Link to="/devenir-prestataire">
                  <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary">
                    <Briefcase className="w-4 h-4" />
                    Devenir Prestataire
                  </Button>
                </Link>
              )}

              {isProvider && (
                <Badge variant="outline" className="border-primary/40 text-primary gap-1 px-3 py-1">
                  <Briefcase className="w-3 h-3" />
                  Prestataire
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-secondary transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-left">
                      <p className="text-sm font-medium leading-none">
                        {user?.prenom} {user?.nom}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  {isProvider ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/provider?tab=profile" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Mon profil
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/provider?tab=services" className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Mes services
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/provider?tab=appointments" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Mes rendez-vous
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link to="/provider?tab=reviews" className="flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Mes avis
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/client" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Mon profil
                      </Link>
                    </DropdownMenuItem>
                  )}

                
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

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
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <Link
                    to={dashboardLink}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary"
                  >
                    <User className="w-4 h-4" />
                    Mon Profil
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full text-destructive border-destructive/30 gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}