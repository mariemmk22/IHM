import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Briefcase, CheckCircle2, Clock3,
  FileText, MapPin, Upload, Wrench,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { createPrestataire, uploadPrestataireDocument } from "@/lib/prestataireApi";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const specialites = [
  "Plomberie", "Électricité", "Ménage & Nettoyage", "Jardinage",
  "Peinture", "Maçonnerie", "Menuiserie", "Climatisation & Chauffage",
  "Déménagement", "Informatique & Tech", "Gardiennage", "Autre",
];

const regions = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili",
];

const availabilityOptions = [
  { id: "matin",      label: "Matin (8h–12h)" },
  { id: "apres-midi", label: "Après-midi (12h–18h)" },
  { id: "soir",       label: "Soir (18h–21h)" },
  { id: "week-end",   label: "Week-end" },
];

export default function BecomeProviderPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();

  const [specialite,    setSpecialite]    = useState(user?.specialite ?? "");
  const [region,        setRegion]        = useState(user?.region ?? "");
  const [description,   setDescription]   = useState(user?.description ?? "");
  const [disponibilites, setDisponibilites] = useState<string[]>(user?.disponibilites ?? []);
  const [cvFile,        setCvFile]        = useState<File | null>(null);
  const [cvFileName,    setCvFileName]    = useState("");

  // All hooks must be called before any conditional returns
  const createMutation = useMutation({
    mutationFn: createPrestataire,
    onSuccess: async (data) => {
      // 1. Mettre à jour la session avec le nouveau token
      login(
        {
          id:            data.user.id,
          nom:           data.user.nom,
          prenom:        data.user.prenom,
          email:         data.user.email,
          role:          data.user.role,
          prestataireId: data.user.prestataireId,
          statutCompte:  data.user.statutCompte,
          specialite,
          region:        region || user?.region,
          description,
          disponibilites,
        },
        data.token,
      );

      // 2. Uploader le CV avec le nouveau token
      if (cvFile) {
        try {
          await uploadPrestataireDocument(data.user.prestataireId, cvFile, data.token);
          toast.success("CV téléchargé avec succès ✓");
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
          toast.error("Erreur upload CV : " + errorMessage);
        }
      }

      toast.success(data.message || "Profil créé — en attente de validation admin.");
      navigate("/provider");
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage || "Erreur lors de la création du profil.");
    },
  });

  /* ── guards ── */
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-lg shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez d'abord créer un compte client puis vous connecter.
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
              Votre compte a déjà le rôle prestataire.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link to="/provider" className="flex-1">
              <Button className="w-full">Tableau de bord</Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">Accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ── handlers ── */
  const toggleDisponibilite = (value: string, checked: boolean) =>
    setDisponibilites((cur) =>
      checked ? [...cur, value] : cur.filter((v) => v !== value),
    );

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Fichier invalide — PDF, DOC, DOCX ou TXT uniquement");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fichier trop lourd — max 5 MB");
      return;
    }
    setCvFile(file);
    setCvFileName(file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialite || !description.trim()) {
      toast.error("Spécialité et description obligatoires.");
      return;
    }
    if (!cvFile) {
      toast.error("Veuillez télécharger votre CV.");
      return;
    }
    createMutation.mutate({
      clientId:    user.id,
      specialite,
      description,
      disponibilite: true,
    });
  };

  /* ── render ── */
  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="mx-auto w-full max-w-3xl space-y-6">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>

        <Card className="rounded-3xl shadow-lg border-primary/10 overflow-hidden">
          {/* Header */}
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
            {/* Steps */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> 1. Compte client
                </div>
                <p className="text-sm text-muted-foreground">Votre compte actuel est créé en tant que client.</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <FileText className="w-4 h-4 text-primary" /> 2. Profil prestataire
                </div>
                <p className="text-sm text-muted-foreground">Ajoutez votre spécialité, description et CV.</p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <Clock3 className="w-4 h-4 text-primary" /> 3. Activation
                </div>
                <p className="text-sm text-muted-foreground">Après validation du CV, vous serez visible comme prestataire.</p>
              </div>
            </div>

            {/* Connected account */}
            <div className="rounded-2xl border bg-secondary/30 p-5">
              <p className="font-medium">Compte connecté</p>
              <p className="text-sm text-muted-foreground mt-1">
                {user.prenom} {user.nom} — {user.email}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Specialite + Region */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> Spécialité principale
                  </Label>
                  <Select value={specialite} onValueChange={setSpecialite}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Choisir une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialites.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Région
                  </Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Sélectionner votre région" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description de vos services</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 rounded-2xl resize-none"
                  placeholder="Décrivez vos compétences, expériences et services..."
                />
              </div>

              {/* ── CV UPLOAD ── */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Télécharger votre CV
                  <span className="text-destructive">*</span>
                </Label>

                {/* hidden file input */}
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleCvChange}
                  className="hidden"
                />

                {/* clickable drop zone */}
                <label
                  htmlFor="cv-upload"
                  className="flex flex-col items-center justify-center w-full h-28 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 cursor-pointer hover:border-primary hover:bg-primary/10 transition-colors"
                >
                  {cvFileName ? (
                    <div className="flex items-center gap-2 text-primary">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm font-semibold">{cvFileName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-7 h-7 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Cliquez pour sélectionner votre CV
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX ou TXT — max 5 MB
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* Disponibilite */}
              <div className="space-y-3">
                <Label>Disponibilité immédiate</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {availabilityOptions.map((item) => {
                    const checked = disponibilites.includes(item.label);
                    return (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border p-4 cursor-pointer hover:bg-muted/40 transition-colors"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => toggleDisponibilite(item.label, Boolean(v))}
                        />
                        <span className="text-sm font-medium">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-xl"
                  onClick={() => navigate(-1)}
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="h-12 rounded-xl gradient-primary text-primary-foreground border-0 px-8"
                >
                  {createMutation.isPending ? "Traitement..." : "Finaliser l'inscription prestataire"}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
