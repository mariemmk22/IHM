import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Briefcase,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  login as apiLogin,
  registerClient as apiRegisterClient,
  AuthResponse, LoginParams, RegisterClientParams,
} from "@/lib/authApi";
import heroBg from "@/assets/hero-bg.jpg";
import { Navbar } from "@/components/Navbar";

const regions = [
  "Tunis","Ariana","Ben Arous","Manouba","Nabeul","Zaghouan","Bizerte","Béja",
  "Jendouba","Kef","Siliana","Sousse","Monastir","Mahdia","Sfax","Kairouan",
  "Kasserine","Sidi Bouzid","Gabès","Médenine","Tataouine","Gafsa","Tozeur","Kébili",
];

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", password: "", region: "" });

  const redirectAfterAuth = (role?: string | null) => {
    if (role === "prestataire" || role === "provider") navigate("/provider");
    else if (role === "admin") navigate("/admin");
    else navigate("/services");
  };

  const loginMutation = useMutation<AuthResponse, Error, LoginParams>({
    mutationFn: apiLogin,
    onSuccess: (data) => { login(data.user, data.token); toast.success("Connexion réussie !"); redirectAfterAuth(data.user.role); },
    onError: (error) => toast.error(error.message || "Erreur de connexion"),
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterClientParams>({
    mutationFn: apiRegisterClient,
    onSuccess: (data) => { login(data.user, data.token); toast.success("Inscription réussie !"); redirectAfterAuth(data.user.role); },
    onError: (error) => toast.error(error.message || "Erreur lors de l'inscription"),
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error("Veuillez remplir tous les champs"); return; }
    loginMutation.mutate({ email: loginEmail, motDePasse: loginPassword });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email || !form.password || !form.telephone) {
      toast.error("Veuillez remplir tous les champs obligatoires"); return;
    }
    registerMutation.mutate({ nom: form.nom, prenom: form.prenom, email: form.email, motDePasse: form.password, telephone: form.telephone, region: form.region || undefined });
  };

  const updateForm = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">

      {/* ── NAVBAR ── */}
  <Navbar />  

      {/* ── MAIN CONTENT ── */}
      <main className="flex flex-1 items-center pt-16">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-12 py-10 grid lg:grid-cols-2 gap-12 items-center">

          {/* ── LEFT — image card (same style as original) ── */}
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)]" style={{ height: "72vh", maxHeight: "560px" }}>
              <img
                src={heroBg}
                alt="Services à domicile"
                className="h-full w-full object-cover object-[54%_center]"
              />
              {/* gradient overlay — bottom only */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* text overlay */}
              <div className="absolute bottom-10 left-10 right-10 z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <h1 className="mb-3 text-4xl font-black leading-tight text-white">
                    La solution pour vos <br />
                    <span className="text-blue-400">besoins</span><br />
                    <span className="text-blue-400">quotidiens.</span>
                  </h1>
                  <p className="text-sm leading-6 text-slate-200 max-w-xs">
                    Rejoignez la plus grande communauté de prestataires de services en Tunisie.{" "}
                    <span className="font-bold text-white">Simple, rapide et sécurisé.</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ── RIGHT — form ── */}
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[420px]"
            >
              {/* Tab switcher */}
              <div className="mb-6 flex rounded-2xl bg-white border border-slate-200 p-1 shadow-sm">
                {["login","register"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "login" ? "Connexion" : "Inscription"}
                  </button>
                ))}
              </div>

              {/* ── LOGIN ── */}
              {activeTab === "login" && (
                <motion.div key="login" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                  <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-7">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-slate-700">Adresse email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input type="email" placeholder="nom@exemple.com"
                            className="h-11 rounded-xl pl-10 border-slate-200 bg-slate-50 focus-visible:ring-blue-500 focus-visible:bg-white transition-colors"
                            value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold text-slate-700">Mot de passe</Label>
                          <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Oublié ?</a>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••"
                            className="h-11 rounded-xl pl-10 pr-11 border-slate-200 bg-slate-50 focus-visible:ring-blue-500 focus-visible:bg-white transition-colors"
                            value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center pt-1">
                        <Button type="submit" disabled={loginMutation.isPending}
                          className="px-10 h-11 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-[0.98]">
                          {loginMutation.isPending ? "Connexion..." : "Se connecter"}
                        </Button>
                      </div>
                    </form>
                  </div>
                  <p className="mt-4 text-center text-sm text-slate-500">
                    Pas encore de compte ?{" "}
                    <button onClick={() => setActiveTab("register")} className="font-semibold text-blue-600 hover:underline">
                      S'inscrire gratuitement
                    </button>
                  </p>
                </motion.div>
              )}

              {/* ── REGISTER ── */}
              {activeTab === "register" && (
                <motion.div key="register" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                  <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-7">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700">Nom</Label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input placeholder="Dupont"
                              className="h-11 rounded-xl pl-10 border-slate-200 bg-slate-50 focus-visible:ring-blue-500 focus-visible:bg-white transition-colors"
                              value={form.nom} onChange={(e) => updateForm("nom", e.target.value)} required />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700">Prénom</Label>
                          <Input placeholder="Jean"
                            className="h-11 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500 focus-visible:bg-white transition-colors"
                            value={form.prenom} onChange={(e) => updateForm("prenom", e.target.value)} required />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-slate-700">Adresse email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input type="email" placeholder="nom@exemple.com"
                            className="h-11 rounded-xl pl-10 border-slate-200 bg-slate-50 focus-visible:ring-blue-500 focus-visible:bg-white transition-colors"
                            value={form.email} onChange={(e) => updateForm("email", e.target.value)} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700">Téléphone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input type="tel" placeholder="9X XXX XXX"
                              className="h-11 rounded-xl pl-10 border-slate-200 bg-slate-50 focus-visible:ring-blue-500 focus-visible:bg-white transition-colors"
                              value={form.telephone} onChange={(e) => updateForm("telephone", e.target.value)} required />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold text-slate-700">Région</Label>
                          <Select onValueChange={(v) => updateForm("region", v)}>
                            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:ring-blue-500">
                              <MapPin className="h-4 w-4 text-slate-400 mr-1 flex-shrink-0" />
                              <SelectValue placeholder="Ville" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 shadow-xl max-h-52">
                              {regions.map((r) => (
                                <SelectItem key={r} value={r} className="focus:bg-blue-50 focus:text-blue-700 cursor-pointer">{r}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-slate-700">Mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input type={showRegisterPassword ? "text" : "password"} placeholder="Minimum 6 caractères"
                            className="h-11 rounded-xl pl-10 pr-11 border-slate-200 bg-slate-50 focus-visible:ring-blue-500 focus-visible:bg-white transition-colors"
                            value={form.password} onChange={(e) => updateForm("password", e.target.value)} required />
                          <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center pt-1">
                        <Button type="submit" disabled={registerMutation.isPending}
                          className="px-10 h-11 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-[0.98]">
                          {registerMutation.isPending ? "Création..." : "Créer mon compte"}
                        </Button>
                      </div>
                    </form>
                  </div>
                  <p className="mt-4 text-center text-sm text-slate-500">
                    Déjà un compte ?{" "}
                    <button onClick={() => setActiveTab("login")} className="font-semibold text-blue-600 hover:underline">
                      Se connecter
                    </button>
                  </p>
                </motion.div>
              )}

              <div className="mt-5 text-center">
                <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  ← Retour à l'accueil
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
