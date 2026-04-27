import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-gradient">ServiDom</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plateforme qui connecte clients et prestataires de services à domicile.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services" className="hover:text-primary transition-colors">Plomberie</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Électricité</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Ménage</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Jardinage</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Entreprise</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Carrières</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Légal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          © 2026 ServiDom. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
