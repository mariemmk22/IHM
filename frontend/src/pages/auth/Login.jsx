import { useState } from "react";
import { T } from "../../components/UI";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { id: "admin", label: "Admin", icon: "🛡️", color: "#0f172a", desc: "Gestion plateforme" },
    { id: "prestataire", label: "Prestataire", icon: "🔧", color: "#0c1445", desc: "Offrir des services" },
    { id: "client", label: "Client", icon: "👤", color: "#064e3b", desc: "Trouver un service" },
  ];

  const credentials = {
    admin: { email: "admin@serviconnect.tn", password: "admin123" },
    prestataire: { email: "ahmed.mansouri@email.com", password: "prest123" },
    client: { email: "yasmine@email.com", password: "client123" },
  };

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const creds = credentials[role];
      if (email === creds.email && password === creds.password) {
        onLogin(role);
      } else {
        setError(`Email ou mot de passe incorrect. Utilisez: ${creds.email} / ${creds.password}`);
        setLoading(false);
      }
    }, 800);
  };

  const quickLogin = (r) => {
    const creds = credentials[r];
    setRole(r);
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Georgia, serif", padding: 24 }}>

      {/* Background pattern */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.04,
        backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
        backgroundSize: "40px 40px" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "#e11d48",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 auto 16px" }}>S</div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: 28, fontFamily: "Georgia" }}>ServiConnect</h1>
          <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.45)", fontSize: 13,
            fontFamily: "system-ui" }}>La plateforme de services en Tunisie</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "36px 40px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 20, color: T.text, textAlign: "center" }}>
            Connexion
          </h2>

          {/* Role selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => quickLogin(r.id)} style={{
                flex: 1, padding: "10px 8px", borderRadius: 12, cursor: "pointer",
                border: `2px solid ${role === r.id ? r.color : T.border}`,
                background: role === r.id ? r.color : "transparent",
                transition: "all 0.15s",
              }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{r.icon}</div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700,
                  color: role === r.id ? "#fff" : T.textMuted,
                  fontFamily: "system-ui" }}>{r.label}</p>
                <p style={{ margin: "1px 0 0", fontSize: 9, color: role === r.id ? "rgba(255,255,255,0.6)" : T.textLight,
                  fontFamily: "system-ui" }}>{r.desc}</p>
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted,
                textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, fontFamily: "system-ui" }}>
                Email
              </label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                placeholder="votre@email.com"
                style={{ width: "100%", padding: "12px 16px", border: `1px solid ${T.border}`,
                  borderRadius: 12, fontSize: 14, color: T.text, outline: "none",
                  boxSizing: "border-box", fontFamily: "system-ui" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted,
                textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, fontFamily: "system-ui" }}>
                Mot de passe
              </label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password"
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ width: "100%", padding: "12px 16px", border: `1px solid ${T.border}`,
                  borderRadius: 12, fontSize: 14, color: T.text, outline: "none",
                  boxSizing: "border-box", fontFamily: "system-ui" }} />
            </div>

            {error && (
              <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 10,
                padding: "10px 14px", fontSize: 12, color: "#be123c", fontFamily: "system-ui" }}>
                {error}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading} style={{
              background: "#e11d48", color: "#fff", border: "none", padding: "14px",
              borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer",
              fontFamily: "system-ui", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s",
            }}>
              {loading ? "Connexion..." : "Se connecter →"}
            </button>
          </div>

          {/* Quick access info */}
          <div style={{ marginTop: 24, padding: "14px 16px", background: T.surfaceAlt,
            borderRadius: 12, fontSize: 11, color: T.textMuted, fontFamily: "system-ui" }}>
            <p style={{ margin: "0 0 4px", fontWeight: 700, color: T.text }}>🚀 Accès rapide (cliquez sur un rôle)</p>
            {roles.map(r => (
              <p key={r.id} style={{ margin: "2px 0 0" }}>
                <strong>{r.label}:</strong> {credentials[r.id].email} / {credentials[r.id].password}
              </p>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.3)",
          fontSize: 11, fontFamily: "system-ui" }}>
          ServiConnect © 2024 — Tunisie
        </p>
      </div>
    </div>
  );
}
