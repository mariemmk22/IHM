import { motion } from "framer-motion";
import { Star, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  id: string;
  title: string;
  provider: string;
  category: string;
  region: string;
  price: string;
  rating: number;
  reviewCount: number;
  image: string;
  available?: boolean;
}

export function ServiceCard({
  id,
  title,
  provider,
  category,
  region,
  price,
  rating,
  reviewCount,
  image,
  available = true,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className="gradient-primary text-primary-foreground border-0 text-xs">
            {category}
          </Badge>
        </div>
        {available && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-success/90 text-success-foreground border-0 text-xs">
              Disponible
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-card-foreground line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{provider}</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {region}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" /> {rating}
            <span className="text-xs">({reviewCount})</span>
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-lg font-bold text-primary">{price}</span>
          <Link to={`/service/${id}`}>
            <Button size="sm" variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
              Voir détails
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
