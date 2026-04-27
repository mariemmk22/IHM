import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, MapPin,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { login as apiLogin, registerClient as apiRegisterClient, AuthResponse, LoginParams, RegisterClientParams } from "@/lib/authApi";
import heroBg from "@/assets/hero-bg.jpg";

const regions = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
];

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    password: "", region: ""
  });

  const loginMutation = useMutation<AuthResponse, Error, LoginParams>({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(data.message || "Connexion réussie !");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur de connexion");
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterClientParams>({
    mutationFn: apiRegisterClient,
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(data.message || "Inscription réussie !");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de l'inscription");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    loginMutation.mutate({ email: loginEmail, motDePasse: loginPassword });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email || !form.password || !form.telephone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    registerMutation.mutate({
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      motDePasse: form.password,
      telephone: form.telephone,
      region: form.region || undefined,
      adresse: undefined,
    });
  };

  const updateForm = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Professionnels en service à domicile"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/75" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/60 to-primary/30" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-4xl font-extrabold mb-4">Bienvenue sur ServiDom</h1>
            <p className="text-lg opacity-90 mb-8 max-w-md">
              Créez d'abord votre compte client, puis complétez votre profil prestataire à tout moment depuis le bouton dédié.
            </p>
            <div className="mb-8 max-w-md rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-semibold mb-3">Services populaires cette semaine</p>
              <div className="grid grid-cols-2 gap-2 text-xs opacity-95">
                {["Plomberie", "Électricité", "Ménage", "Peinture"].map((service) => (
                  <div key={service} className="rounded-lg bg-white/15 px-3 py-2 text-center">
                    {service}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                "✓ Inscription simple pour tous les utilisateurs",
                "✓ Tous les nouveaux comptes commencent en client",
                "✓ Passage en prestataire après connexion",
                "✓ Validation du profil prestataire par l'équipe",
              ].map((item) => (
                <p key={item} className="text-sm opacity-80">{item}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-6"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-secondary rounded-xl">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium">
                Connexion
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium">
                Inscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10 h-12 rounded-xl"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 rounded-xl"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-primary hover:underline">Mot de passe oublié ?</a>
                </div>
                <Button type="submit" className="w-full h-12 gradient-primary text-primary-foreground border-0 rounded-xl text-base font-semibold hover:opacity-90">
                  Se connecter
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm text-muted-foreground">
                  Tous les nouveaux comptes sont créés avec le rôle <span className="font-semibold text-foreground">client</span>.
                  Après connexion, vous pourrez cliquer sur <span className="font-semibold text-primary">Devenir Prestataire</span> pour compléter le formulaire prestataire.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Votre nom"
                        className="pl-10 h-12 rounded-xl"
                        value={form.nom}
                        onChange={(e) => updateForm("nom", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Prénom <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Votre prénom"
                        className="pl-10 h-12 rounded-xl"
                        value={form.prenom}
                        onChange={(e) => updateForm("prenom", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10 h-12 rounded-xl"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Téléphone <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="XX XXX XXX"
                      className="pl-10 h-12 rounded-xl"
                      value={form.telephone}
                      onChange={(e) => updateForm("telephone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Région</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select onValueChange={(v) => updateForm("region", v)}>
                      <SelectTrigger className="pl-10 h-12 rounded-xl">
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

                <div className="space-y-2">
                  <Label>Mot de passe <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 caractères"
                      className="pl-10 pr-10 h-12 rounded-xl"
                      value={form.password}
                      onChange={(e) => updateForm("password", e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 gradient-primary text-primary-foreground border-0 rounded-xl text-base font-semibold hover:opacity-90">
                  Créer mon compte client
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
