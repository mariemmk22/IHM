import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

export default function ClientAccueil({ setActivePage }) {
  const [search, setSearch] = useState("");

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #064e3b 0%, #065f46 100%)`,
        borderRadius: 20, padding: "40px 40px", marginBottom: 32, textAlign: "center",
        position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "30px 30px" }} />
        <h1 style={{ margin: "0 0 12px", color: "#fff", fontSize: 30, fontFamily: "Georgia",
          position: "relative" }}>
          Trouvez le prestataire parfait ✦
        </h1>
        <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.7)", fontSize: 15, position: "relative" }}>
          Des milliers de professionnels vérifiés à votre service en Tunisie
        </p>
        <div style={{ display: "flex", gap: 10, maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Quel service cherchez-vous ?"
            style={{ flex: 1, padding: "14px 20px", borderRadius: 12, border: "none", fontSize: 15,
              color: T.text, outline: "none" }} />
          <button onClick={() => setActivePage("recherche")} style={{ background: T.accent, color: "#fff",
            border: "none", padding: "14px 24px", borderRadius: 12, fontSize: 14,
            fontWeight: 700, cursor: "pointer" }}>
            Rechercher
          </button>
        </div>
      </div>

      {/* Catégories */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 20, color: T.text, fontFamily: "Georgia" }}>
          Parcourir par catégorie
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {CATEGORIES.filter(c => c.actif).map(cat => (
            <div key={cat.id} onClick={() => setActivePage("services")} style={{
              background: T.surface, borderRadius: 16, padding: "20px 12px", textAlign: "center",
              border: `1px solid ${T.border}`, cursor: "pointer", transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.text }}>{cat.nom}</p>
              <p style={{ margin: "3px 0 0", fontSize: 10, color: T.textMuted }}>{cat.nbPrestataires} pros</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services populaires */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: T.text, fontFamily: "Georgia" }}>Services populaires</h2>
          <Btn variant="ghost" onClick={() => setActivePage("services")}>Voir tout →</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {SERVICES.filter(s => s.actif && s.note > 0).slice(0, 3).map(s => (
            <Card key={s.id}>
              <div style={{ height: 100, background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}22, #${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}22)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                {CATEGORIES.find(c => c.nom === s.categorie)?.icon || "⚙️"}
              </div>
              <div style={{ padding: "16px 20px" }}>
                <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: T.text }}>{s.nom}</h4>
                <p style={{ margin: "0 0 8px", fontSize: 11, color: T.textMuted }}>{s.prestataire} · 📍 {s.ville}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <StarRating note={s.note} showNumber />
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.teal }}>{s.tarif} DT/{s.unite}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mes RDV récents */}
      {MY_RDV.length > 0 && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 20, color: T.text, fontFamily: "Georgia" }}>Mes derniers rendez-vous</h2>
            <Btn variant="ghost" onClick={() => setActivePage("rendezvous")}>Voir tout →</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MY_RDV.slice(0, 2).map(rdv => (
              <Card key={rdv.id}>
                <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: T.surfaceAlt,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: T.teal, textTransform: "uppercase" }}>{rdv.date.split(" ")[1]}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: T.text, lineHeight: 1 }}>{rdv.date.split(" ")[0]}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{rdv.service}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: T.textMuted }}>{rdv.prestataire} · {rdv.heure}</p>
                  </div>
                  <StatusBadge statut={rdv.statut} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}