import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

const MY_RDV = RENDEZVOUS.filter(r => r.clientId === 2);
const MY_AVIS = AVIS.filter(a => a.clientId === 2);

export default function ClientProfil() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nom: "Yasmine Ben Ali", email: "yasmine@email.com",
    telephone: "+216 55 123 456", ville: "Sfax",
    adresse: "12 rue Habib Bourguiba, Sfax",
  });

  return (
    <div>
      <PageHeader title="Mon Profil"
        action={<Btn variant={editing ? "success" : "primary"} onClick={() => setEditing(!editing)}>
          {editing ? "✓ Sauvegarder" : "✏️ Modifier"}
        </Btn>} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <div style={{ background: `linear-gradient(135deg, #064e3b 0%, #065f46 100%)`,
            padding: "32px 24px 0", display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: T.accent,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
              fontWeight: 700, color: "#fff", border: "4px solid white", marginBottom: -20,
              flexShrink: 0, fontFamily: "Georgia" }}>YB</div>
            <div style={{ paddingBottom: 24 }}>
              <h3 style={{ margin: 0, color: "#fff", fontFamily: "Georgia", fontSize: 18 }}>{form.nom}</h3>
              <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Client · {form.ville}</p>
            </div>
          </div>
          <div style={{ padding: "36px 24px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[{key:"nom",label:"Nom complet"},{key:"email",label:"Email"},{key:"telephone",label:"Téléphone"},
                {key:"ville",label:"Ville"},{key:"adresse",label:"Adresse"}].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted,
                    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>{f.label}</label>
                  {editing ? (
                    <input value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}
                      style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.border}`,
                        borderRadius: 10, fontSize: 13, boxSizing: "border-box", color: T.text }} />
                  ) : (
                    <p style={{ margin: 0, fontSize: 13, color: T.text, fontWeight: 500 }}>{form[f.key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <CardHeader title="Statistiques" />
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Rendez-vous pris", value: MY_RDV.length, icon: "📅" },
                { label: "Avis publiés", value: MY_AVIS.length, icon: "⭐" },
                { label: "Prestataires contactés", value: 3, icon: "👷" },
                { label: "Membre depuis", value: "Jan 2024", icon: "🗓️" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0", borderTop: i > 0 ? `1px solid ${T.border}` : "none" }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, color: T.textMuted }}>{s.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Sécurité" />
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <Btn variant="secondary">🔑 Changer le mot de passe</Btn>
              <Btn variant="secondary">📱 Activer 2FA</Btn>
              <Btn variant="outlineDanger">Supprimer mon compte</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}