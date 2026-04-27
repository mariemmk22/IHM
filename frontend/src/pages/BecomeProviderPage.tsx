import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, CheckCircle2, Clock3, FileText, MapPin, Wrench } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { createPrestataire } from "@/lib/prestataireApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const specialites = [
  "Plomberie", "Électricité", "Ménage & Nettoyage", "Jardinage",
  "Peinture", "Maçonnerie", "Menuiserie", "Climatisation & Chauffage",
  "Déménagement", "Informatique & Tech", "Gardiennage", "Autre"
];

const regions = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
];

const availabilityOptions = [
  { id: "matin", label: "Matin (8h–12h)" },
  { id: "apres-midi", label: "Après-midi (12h–18h)" },
  { id: "soir", label: "Soir (18h–21h)" },
  { id: "week-end", label: "Week-end" },
];

export default function BecomeProviderPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();
  const [specialite, setSpecialite] = useState(user?.specialite ?? "");
  const [region, setRegion] = useState(user?.region ?? "");
  const [description, setDescription] = useState(user?.description ?? "");
  const [disponibilites, setDisponibilites] = useState<string[]>(user?.disponibilites ?? []);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-lg shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez d'abord créer un compte client puis vous connecter pour compléter le profil prestataire.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link to="/auth?tab=register" className="flex-1">
              <Button className="w-full">Créer un compte</Button>
            </Link>
            <Link to="/auth" className="flex-1">
              <Button variant="outline" className="w-full">Connexion</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role === "prestataire" || user.role === "provider") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-xl shadow-lg rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Profil prestataire déjà activé</span>
            </div>
            <CardTitle>Vous êtes déjà prestataire</CardTitle>
            <CardDescription>
              Votre compte a déjà le rôle prestataire. Vous pouvez accéder directement à votre tableau de bord.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link to="/provider" className="flex-1">
              <Button className="w-full">Aller au tableau de bord</Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleDisponibilite = (value: string, checked: boolean) => {
    setDisponibilites((current) =>
      checked ? [...current, value] : current.filter((item) => item !== value)
    );
  };

  const createMutation = useMutation({
    mutationFn: createPrestataire,
    onSuccess: (data) => {
      login(
        {
          id: data.user.id,
          nom: data.user.nom,
          prenom: data.user.prenom,
          email: data.user.email,
          role: "prestataire",
          prestataireId: data.user.prestataireId,
          specialite,
          region: region || user.region,
          description,
          disponibilites,
        },
        data.token,
      );
      toast.success(data.message || "Votre profil prestataire a été complété avec succès.");
      navigate("/provider");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de la création du profil prestataire.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!specialite || !description.trim()) {
      toast.error("Veuillez remplir la spécialité et la description de vos services.");
      return;
    }

    createMutation.mutate({
      clientId: user.id,
      specialite,
      description,
      disponibilite: true,
    });
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>

        <Card className="rounded-3xl shadow-lg border-primary/10 overflow-hidden">
          <div className="gradient-primary p-8 text-primary-foreground">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">Devenir Prestataire</h1>
                <p className="opacity-90">Complétez votre profil pour demander le rôle prestataire.</p>
              </div>
            </div>
          </div>

          <CardContent className="p-8 space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center gap-2 font-semibold mb-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 1. Compte client</div>
                <p className="text-sm text-muted-foreground">Votre compte actuel est créé en tant que client.</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center gap-2 font-semibold mb-2"><FileText className="w-4 h-4 text-primary" /> 2. Profil prestataire</div>
                <p className="text-sm text-muted-foreground">Ajoutez votre spécialité, votre description et vos disponibilités.</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center gap-2 font-semibold mb-2"><Clock3 className="w-4 h-4 text-primary" /> 3. Activation</div>
                <p className="text-sm text-muted-foreground">Après validation, vous serez visible comme prestataire sur la plateforme.</p>
              </div>
            </div>

            <div className="rounded-2xl border bg-secondary/30 p-5">
              <p className="font-medium">Compte connecté</p>
              <p className="text-sm text-muted-foreground mt-1">{user.prenom} {user.nom} — {user.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Wrench className="w-4 h-4" /> Spécialité principale</Label>
                  <Select value={specialite} onValueChange={setSpecialite}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Choisir une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialites.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Région</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Sélectionner votre région" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description de vos services</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 rounded-2xl resize-none"
                  placeholder="Décrivez vos compétences, vos expériences et les services que vous proposez..."
                />
              </div>

              <div className="space-y-3">
                <Label>Disponibilité immédiate</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {availabilityOptions.map((item) => {
                    const checked = disponibilites.includes(item.label);
                    return (
                      <label key={item.id} className="flex items-center gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-muted/40 transition-colors">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => toggleDisponibilite(item.label, Boolean(value))}
                        />
                        <span className="text-sm font-medium">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-between">
                <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => navigate(-1)}>
                  Retour
                </Button>
                <Button type="submit" className="h-12 rounded-xl gradient-primary text-primary-foreground border-0 px-8">
                  Finaliser l'inscription prestataire
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
