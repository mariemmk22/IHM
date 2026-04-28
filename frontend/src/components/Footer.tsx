import { Link } from "react-router-dom";
import sloganImg from "@/assets/Preview-removebg-preview.png";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

          {/* Logo + description */}
          <div className="flex flex-col gap-3">
            <Link to="/">
              <img
                src={sloganImg}
                alt="ServiDom"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plateforme qui connecte clients et prestataires de services à domicile.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services" className="hover:text-primary transition-colors">Plomberie</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Électricité</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Ménage</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Jardinage</Link></li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Entreprise</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Carrières</a></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Légal</h4>
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
