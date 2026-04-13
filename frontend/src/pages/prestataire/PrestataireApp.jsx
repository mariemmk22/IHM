import { useState } from "react";
import Layout from "../../components/Layout";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, DOCUMENTS, CATEGORIES, NOTIFICATIONS } from "../../data/mockData";

const NAV = [
  { group: "Général" },
  { id: "dashboard", icon: "◈", label: "Tableau de bord" },
  { group: "Mon compte" },
  { id: "profil", icon: "👤", label: "Mon Profil" },
  { id: "documents", icon: "📋", label: "Mes Documents" },
  { id: "statut", icon: "🔆", label: "Mon Statut" },
  { group: "Activité" },
  { id: "services", icon: "🔧", label: "Mes Services" },
  { id: "rendezvous", icon: "📅", label: "Rendez-vous", badge: "2" },
  { id: "avis", icon: "⭐", label: "Avis reçus" },
  { group: "Découverte" },
  { id: "recherche", icon: "🔍", label: "Rechercher" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
];

const ME = { id: 1, nom: "Ahmed Mansouri", email: "ahmed.mansouri@email.com", role: "prestataire" };

const MY_RENDEZVOUS = RENDEZVOUS.filter(r => r.prestataireId === 1);
const MY_AVIS = AVIS.filter(a => a.prestataireId === 1);
const MY_DOCS = DOCUMENTS.filter(d => d.prestataireId === 1);
const MY_SERVICES = SERVICES.filter(s => s.prestataireId === 1);

// ─── Dashboard ───────────────────────────────────────────────────────────────
function PrestDashboard() {
  const avgNote = MY_AVIS.length > 0 ? (MY_AVIS.reduce((s, a) => s + a.note, 0) / MY_AVIS.length).toFixed(1) : "—";

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background: `linear-gradient(135deg, #0c1445 0%, #1a237e 100%)`, borderRadius: 20,
        padding: "28px 32px", marginBottom: 28, display: "flex", alignItems: "center", gap: 20 }}>
        <Avatar nom={ME.nom} size={56} bg="#e11d48" />
        <div>
          <h2 style={{ margin: 0, color: "#fff", fontSize: 22, fontFamily: "Georgia" }}>
            Bonjour, Ahmed ✦
          </h2>
          <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
            Voici l'état de votre activité aujourd'hui — {new Date().toLocaleDateString("fr-TN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, color: "#fff", fontSize: 26, fontWeight: 700, fontFamily: "Georgia" }}>{avgNote}</p>
            <StarRating note={parseFloat(avgNote) || 0} size={12} />
            <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>Note moyenne</p>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, color: "#fff", fontSize: 26, fontWeight: 700, fontFamily: "Georgia" }}>{MY_RENDEZVOUS.length}</p>
            <p style={{ margin: "3px 0 0", color: "rgba(255,255,255,0.5)", fontSize: 10 }}>RDV totaux</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="RDV ce mois" value="8" trend="+33%" up icon="📅" />
        <StatCard label="En attente" value={MY_RENDEZVOUS.filter(r => r.statut === "en attente").length} icon="⏳" color={T.warning} />
        <StatCard label="Avis reçus" value={MY_AVIS.length} trend="+2" up icon="⭐" color={T.gold} />
        <StatCard label="Revenus mois" value="850 DT" trend="+12%" up icon="💰" color={T.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }}>
        <Card>
          <CardHeader title="Prochains rendez-vous"
            action={<Badge type="info">{MY_RENDEZVOUS.filter(r=>r.statut!=="annulé"&&r.statut!=="terminé").length} actifs</Badge>} />
          {MY_RENDEZVOUS.slice(0, 4).map((rdv, i) => (
            <div key={rdv.id} style={{ padding: "16px 24px", borderTop: i > 0 ? `1px solid ${T.border}` : "none",
              display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: T.surfaceAlt,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, textTransform: "uppercase" }}>{rdv.date.split(" ")[1]}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: T.text, lineHeight: 1 }}>{rdv.date.split(" ")[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{rdv.client}</p>
                <p style={{ margin: "3px 0 0", fontSize: 11, color: T.textMuted }}>{rdv.service} · {rdv.heure}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted }}>📍 {rdv.adresse}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <StatusBadge statut={rdv.statut} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.teal }}>{rdv.montant} DT</span>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <CardHeader title="Derniers avis" />
            {MY_AVIS.map((avis, i) => (
              <div key={avis.id} style={{ padding: "14px 20px", borderTop: i > 0 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{avis.client}</span>
                  <StarRating note={avis.note} />
                </div>
                <p style={{ margin: 0, fontSize: 12, color: T.textMuted, lineHeight: 1.4 }}>{avis.commentaire}</p>
              </div>
            ))}
          </Card>

          <Card>
            <CardHeader title="Mes services actifs" />
            {MY_SERVICES.map((s, i) => (
              <div key={s.id} style={{ padding: "12px 20px", borderTop: i > 0 ? `1px solid ${T.border}` : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{s.nom}</p>
                  <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{s.tarif} DT/{s.unite}</p>
                </div>
                <Badge type={s.actif ? "success" : "danger"}>{s.actif ? "Actif" : "Inactif"}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Profil ──────────────────────────────────────────────────────────────────
function PrestProfil() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nom: "Ahmed Mansouri", email: "ahmed.mansouri@email.com",
    telephone: "+216 22 345 678", ville: "Tunis",
    bio: "Plombier professionnel avec 8 ans d'expérience. Spécialisé en installation et réparation sanitaire. Disponible 7j/7 pour urgences.",
    disponibilite: "Lun–Sam 08:00–18:00",
    experience: "8 ans",
    langues: "Arabe, Français",
  });

  const f = (key, label) => (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted,
        textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>{label}</label>
      {editing ? (
        <input value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
          style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.border}`,
            borderRadius: 10, fontSize: 13, boxSizing: "border-box", color: T.text }} />
      ) : (
        <p style={{ margin: 0, fontSize: 13, color: T.text, fontWeight: 500 }}>{form[key]}</p>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="Mon Profil" subtitle="Vos informations personnelles et professionnelles"
        action={
          <Btn variant={editing ? "success" : "primary"} onClick={() => setEditing(!editing)}>
            {editing ? "✓ Sauvegarder" : "✏️ Modifier"}
          </Btn>
        } />

      <Card>
        {/* Bannière */}
        <div style={{ background: `linear-gradient(135deg, #0c1445 0%, #1a237e 100%)`,
          padding: "32px 32px 0", display: "flex", alignItems: "flex-end", gap: 20 }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: T.accent,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
            fontWeight: 700, color: "#fff", border: "4px solid white", marginBottom: -22,
            flexShrink: 0, fontFamily: "Georgia" }}>AM</div>
          <div style={{ paddingBottom: 28 }}>
            <h3 style={{ margin: 0, color: "#fff", fontFamily: "Georgia", fontSize: 20 }}>{form.nom}</h3>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
              Plombier · {form.ville}
            </p>
          </div>
          <div style={{ marginLeft: "auto", paddingBottom: 28, display: "flex", gap: 8 }}>
            <Badge type="success">✓ Compte vérifié</Badge>
            <Badge type="teal">★ {MY_AVIS.length > 0 ? (MY_AVIS.reduce((s,a)=>s+a.note,0)/MY_AVIS.length).toFixed(1) : "—"}/5</Badge>
          </div>
        </div>

        <div style={{ padding: "36px 32px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {f("nom", "Nom complet")}
            {f("email", "Email")}
            {f("telephone", "Téléphone")}
            {f("ville", "Ville")}
            {f("disponibilite", "Disponibilité")}
            {f("experience", "Expérience")}
            {f("langues", "Langues")}
          </div>
          <div>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted,
              textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>Biographie</label>
            {editing ? (
              <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                rows={4} style={{ width: "100%", padding: "10px 14px", border: `1px solid ${T.border}`,
                  borderRadius: 10, fontSize: 13, resize: "vertical", boxSizing: "border-box",
                  fontFamily: "inherit", color: T.text }} />
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.7 }}>{form.bio}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card style={{ marginTop: 20, border: `1px solid ${T.dangerLight}` }}>
        <CardHeader title="Zone dangereuse" subtitle="Actions irréversibles sur votre compte" />
        <div style={{ padding: "20px 24px", display: "flex", gap: 12 }}>
          <Btn variant="outlineDanger">Désactiver mon compte</Btn>
          <Btn variant="danger">Supprimer mon compte</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Documents ───────────────────────────────────────────────────────────────
function PrestDocuments() {
  const [docs, setDocs] = useState(MY_DOCS);

  return (
    <div>
      <PageHeader title="Mes Documents" subtitle="Documents soumis pour vérification de votre compte"
        action={<Btn variant="primary">+ Soumettre un document</Btn>} />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {docs.map(doc => (
            <Card key={doc.id}>
              <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14,
                  background: doc.statut === "accepté" ? T.successLight : doc.statut === "refusé" ? T.dangerLight : T.warningLight,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  📄
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{doc.type}</h4>
                    <StatusBadge statut={doc.statut} />
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>{doc.fichier} · Soumis le {doc.date}</p>
                  {doc.statut === "refusé" && (
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: T.danger, fontStyle: "italic" }}>
                      ⚠️ Document refusé. Veuillez soumettre à nouveau un document valide.
                    </p>
                  )}
                </div>
                {doc.statut !== "accepté" && (
                  <Btn variant="secondary" size="sm">Remplacer</Btn>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <CardHeader title="Statut du compte" />
            <div style={{ padding: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.successLight,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
                  margin: "0 auto 10px" }}>✓</div>
                <p style={{ margin: 0, fontWeight: 700, color: T.success, fontSize: 14 }}>Compte actif</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: T.textMuted }}>Vos documents ont été vérifiés</p>
              </div>
              {[
                { label: "Documents soumis", value: docs.length },
                { label: "Acceptés", value: docs.filter(d=>d.statut==="accepté").length },
                { label: "En attente", value: docs.filter(d=>d.statut==="en attente").length },
                { label: "Refusés", value: docs.filter(d=>d.statut==="refusé").length },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between",
                  padding: "8px 0", borderTop: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 12, color: T.textMuted }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Documents requis" />
            <div style={{ padding: 20 }}>
              {["CIN (recto-verso)", "Diplôme professionnel", "Attestation d'expérience", "Photo de profil"].map((d, i) => {
                const submitted = docs.find(doc => doc.type.includes(d.split(" ")[0]));
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 0", borderTop: i > 0 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ fontSize: 14, color: submitted ? T.success : T.textLight }}>
                      {submitted ? "✓" : "○"}
                    </span>
                    <span style={{ fontSize: 12, color: submitted ? T.text : T.textMuted }}>{d}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Statut ──────────────────────────────────────────────────────────────────
function PrestStatut() {
  const [statut, setStatut] = useState("disponible");
  const [dispoForm, setDispoForm] = useState({ lun: true, mar: true, mer: true, jeu: true, ven: true, sam: true, dim: false });
  const [heureDebut, setHeureDebut] = useState("08:00");
  const [heureFin, setHeureFin] = useState("18:00");

  const statusOptions = [
    { id: "disponible", label: "Disponible", desc: "Vous acceptez de nouveaux clients et rendez-vous", color: T.success, icon: "✓", bg: T.successLight },
    { id: "occupé", label: "Occupé", desc: "Vous êtes en mission, pas de nouveaux RDV", color: T.warning, icon: "⏳", bg: T.warningLight },
    { id: "en congé", label: "En congé", desc: "Temporairement indisponible", color: T.textMuted, icon: "✕", bg: T.surfaceAlt },
  ];

  const jours = [
    { key: "lun", label: "Lun" }, { key: "mar", label: "Mar" }, { key: "mer", label: "Mer" },
    { key: "jeu", label: "Jeu" }, { key: "ven", label: "Ven" }, { key: "sam", label: "Sam" }, { key: "dim", label: "Dim" },
  ];

  return (
    <div>
      <PageHeader title="Mon Statut" subtitle="Gérez votre disponibilité et vos horaires de travail" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, color: T.text, fontFamily: "Georgia" }}>Statut actuel</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {statusOptions.map(s => (
              <div key={s.id} onClick={() => setStatut(s.id)} style={{
                background: T.surface, borderRadius: 14, padding: "20px 24px",
                border: statut === s.id ? `2px solid ${s.color}` : `1px solid ${T.border}`,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                transition: "all 0.15s",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: statut === s.id ? s.color : T.surfaceAlt,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: statut === s.id ? "#fff" : T.textMuted,
                  flexShrink: 0, transition: "all 0.15s" }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: T.text }}>{s.label}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: T.textMuted, lineHeight: 1.4 }}>{s.desc}</p>
                </div>
                {statut === s.id && (
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.color,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, flexShrink: 0 }}>✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <CardHeader title="Jours de travail" />
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {jours.map(j => (
                  <button key={j.key} onClick={() => setDispoForm({...dispoForm, [j.key]: !dispoForm[j.key]})}
                    style={{ width: 44, height: 44, borderRadius: 10, border: "none", cursor: "pointer",
                      background: dispoForm[j.key] ? T.teal : T.surfaceAlt,
                      color: dispoForm[j.key] ? "#fff" : T.textMuted,
                      fontSize: 12, fontWeight: 700 }}>
                    {j.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted,
                    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>Début</label>
                  <input type="time" value={heureDebut} onChange={e => setHeureDebut(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.border}`,
                      borderRadius: 10, fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: T.textMuted,
                    textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>Fin</label>
                  <input type="time" value={heureFin} onChange={e => setHeureFin(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px", border: `1px solid ${T.border}`,
                      borderRadius: 10, fontSize: 13, boxSizing: "border-box" }} />
                </div>
              </div>
              <Btn variant="teal" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
                Sauvegarder les horaires
              </Btn>
            </div>
          </Card>

          <Card>
            <CardHeader title="Résumé disponibilité" />
            <div style={{ padding: 20 }}>
              <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.6 }}>
                <strong>Jours:</strong> {jours.filter(j => dispoForm[j.key]).map(j => j.label).join(", ")}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: T.text }}>
                <strong>Horaires:</strong> {heureDebut} – {heureFin}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: T.text }}>
                <strong>Statut:</strong> <StatusBadge statut={statut} />
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────
function PrestServices() {
  const [services, setServices] = useState(MY_SERVICES);
  const modal = useModal();
  const [form, setForm] = useState({ nom: "", categorie: "", tarif: "", unite: "heure", description: "" });

  const toggleService = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, actif: !s.actif } : s));
  };

  return (
    <div>
      <PageHeader title="Mes Services"
        subtitle={`${services.length} services enregistrés`}
        action={<Btn onClick={modal.show}>+ Ajouter un service</Btn>} />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {services.map(s => (
          <Card key={s.id}>
            <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14,
                background: s.actif ? T.tealLight : T.surfaceAlt,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                🔧
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{s.nom}</h4>
                  <Badge type="info" size="sm">{s.categorie}</Badge>
                  <Badge type="default" size="sm">{s.sousCategorie}</Badge>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>
                  {s.tarif} DT/{s.unite} · {s.ville}
                  {s.note > 0 && <span> · ★ {s.note} ({s.nbAvis} avis)</span>}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: T.textMuted, fontStyle: "italic" }}>{s.description}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <Toggle checked={s.actif} onChange={() => toggleService(s.id)} label={s.actif ? "Actif" : "Inactif"} />
                <Btn size="sm" variant="secondary">Modifier</Btn>
                <Btn size="sm" variant="outlineDanger">Suppr.</Btn>
              </div>
            </div>
          </Card>
        ))}

        {services.length === 0 && (
          <EmptyState icon="🔧" title="Aucun service" desc="Ajoutez votre premier service pour commencer à recevoir des clients." />
        )}
      </div>

      <Modal title="Ajouter un service" open={modal.open} onClose={modal.hide}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Nom du service" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})}
            placeholder="Ex: Plomberie d'urgence" required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="Catégorie" value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}
              options={CATEGORIES.map(c => ({ value: c.nom, label: c.nom }))} />
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
              <Input label="Tarif (DT)" value={form.tarif} onChange={e => setForm({...form, tarif: e.target.value})}
                type="number" placeholder="50" />
              <Select label="Unité" value={form.unite} onChange={e => setForm({...form, unite: e.target.value})}
                options={["heure", "m²", "forfait", "visite"]} />
            </div>
          </div>
          <Textarea label="Description" value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            rows={3} placeholder="Décrivez votre service en détail..." />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={modal.hide}>Annuler</Btn>
            <Btn variant="primary" onClick={modal.hide}>Créer le service</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Rendez-vous ─────────────────────────────────────────────────────────────
function PrestRendezvous() {
  const [rdvs, setRdvs] = useState(MY_RENDEZVOUS);
  const [filter, setFilter] = useState("tous");
  const modal = useModal();

  const updateRdv = (id, statut) => setRdvs(rdvs.map(r => r.id === id ? { ...r, statut } : r));
  const filtered = filter === "tous" ? rdvs : rdvs.filter(r => r.statut === filter);

  return (
    <div>
      <PageHeader title="Mes Rendez-vous" subtitle={`${rdvs.length} rendez-vous au total`} />

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: rdvs.length, color: T.text },
          { label: "Confirmés", value: rdvs.filter(r=>r.statut==="confirmé").length, color: T.success },
          { label: "En attente", value: rdvs.filter(r=>r.statut==="en attente").length, color: T.warning },
          { label: "Annulés", value: rdvs.filter(r=>r.statut==="annulé").length, color: T.danger },
          { label: "Terminés", value: rdvs.filter(r=>r.statut==="terminé").length, color: T.info },
        ].map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
            padding: "10px 16px", textAlign: "center", flex: 1 }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "Georgia" }}>{s.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: T.textMuted, textTransform: "uppercase" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
          <FilterBar filters={[
            {value:"tous",label:"Tous"},{value:"confirmé",label:"Confirmés"},
            {value:"en attente",label:"En attente"},{value:"annulé",label:"Annulés"},{value:"terminé",label:"Terminés"}
          ]} value={filter} onChange={setFilter} />
        </div>

        {filtered.map((rdv, i) => (
          <div key={rdv.id} style={{ padding: "20px 24px", borderTop: i > 0 ? `1px solid ${T.border}` : "none",
            display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: T.surfaceAlt,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, textTransform: "uppercase" }}>{rdv.date.split(" ")[1]}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: T.text, lineHeight: 1 }}>{rdv.date.split(" ")[0]}</span>
            </div>
            <Avatar nom={rdv.client} size={40} bg={T.info} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{rdv.client}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: T.textMuted }}>
                {rdv.service} · {rdv.heure} · 📍 {rdv.adresse}
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.teal }}>{rdv.montant} DT</p>
              <StatusBadge statut={rdv.statut} />
            </div>
            {rdv.statut === "en attente" && (
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Btn size="sm" variant="success" onClick={() => updateRdv(rdv.id, "confirmé")}>✓ Confirmer</Btn>
                <Btn size="sm" variant="outlineDanger" onClick={() => updateRdv(rdv.id, "annulé")}>✗ Refuser</Btn>
              </div>
            )}
            {rdv.statut === "confirmé" && (
              <Btn size="sm" variant="teal" onClick={() => updateRdv(rdv.id, "terminé")}>Marquer terminé</Btn>
            )}
            {rdv.statut === "terminé" && rdv.note === null && (
              <Badge type="warning">En attente d'avis</Badge>
            )}
          </div>
        ))}

        {filtered.length === 0 && <EmptyState icon="📅" title="Aucun rendez-vous" desc="Aucun rendez-vous dans cette catégorie." />}
      </Card>
    </div>
  );
}

// ─── Avis ────────────────────────────────────────────────────────────────────
function PrestAvis() {
  const avgNote = MY_AVIS.length > 0 ? (MY_AVIS.reduce((s, a) => s + a.note, 0) / MY_AVIS.length).toFixed(1) : 0;
  const distribution = [5,4,3,2,1].map(n => ({
    n, count: MY_AVIS.filter(a => a.note === n).length,
    pct: MY_AVIS.length > 0 ? Math.round((MY_AVIS.filter(a => a.note === n).length / MY_AVIS.length) * 100) : 0
  }));

  return (
    <div>
      <PageHeader title="Avis reçus" subtitle={`${MY_AVIS.length} avis de clients`} />

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, marginBottom: 24 }}>
        <Card>
          <div style={{ padding: 28, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 56, fontWeight: 700, color: T.text, fontFamily: "Georgia", lineHeight: 1 }}>{avgNote}</p>
            <StarRating note={parseFloat(avgNote)} size={20} />
            <p style={{ margin: "8px 0 16px", color: T.textMuted, fontSize: 13 }}>Basé sur {MY_AVIS.length} avis</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {distribution.map(d => (
                <div key={d.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: T.textMuted, width: 8 }}>{d.n}</span>
                  <span style={{ color: T.gold, fontSize: 11 }}>★</span>
                  <div style={{ flex: 1, height: 8, background: T.surfaceAlt, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: T.gold, borderRadius: 4, width: `${d.pct}%`, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: T.textMuted, width: 24, textAlign: "right" }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MY_AVIS.map(avis => (
            <Card key={avis.id}>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar nom={avis.client} size={40} bg={T.info} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: T.text }}>{avis.client}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted }}>{avis.service}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <StarRating note={avis.note} />
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: T.textMuted }}>{avis.date}</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: T.text, lineHeight: 1.6,
                  padding: "12px 16px", background: T.surfaceAlt, borderRadius: 10 }}>
                  "{avis.commentaire}"
                </p>
              </div>
            </Card>
          ))}
          {MY_AVIS.length === 0 && <EmptyState icon="⭐" title="Aucun avis" desc="Vous n'avez pas encore reçu d'avis." />}
        </div>
      </div>
    </div>
  );
}

// ─── Recherche ───────────────────────────────────────────────────────────────
function PrestRecherche() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("tous");
  const [mode, setMode] = useState("simple");
  const [villeFilter, setVilleFilter] = useState("");
  const [tarifMax, setTarifMax] = useState("");

  const filtered = SERVICES.filter(s => {
    const matchSearch = s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.prestataire.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "tous" || s.categorie === catFilter;
    const matchVille = !villeFilter || s.ville.toLowerCase().includes(villeFilter.toLowerCase());
    const matchTarif = !tarifMax || s.tarif <= parseInt(tarifMax);
    return matchSearch && matchCat && matchVille && matchTarif;
  });

  return (
    <div>
      <PageHeader title="Rechercher des services" subtitle="Explorez les services disponibles sur la plateforme" />

      <Card style={{ marginBottom: 24 }}>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, borderBottom: `1px solid ${T.border}`, paddingBottom: 16 }}>
            {[{id:"simple",label:"🔍 Recherche simple"},{id:"avancee",label:"⚙️ Recherche avancée"}].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: "none", background: mode === m.id ? T.primary : T.surfaceAlt,
                color: mode === m.id ? "#fff" : T.textMuted,
              }}>{m.label}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nom du service ou du prestataire..."
              style={{ flex: 2, minWidth: 200, padding: "10px 16px", border: `1px solid ${T.border}`,
                borderRadius: 10, fontSize: 14, color: T.text, outline: "none" }} />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ flex: 1, minWidth: 150, padding: "10px 14px", border: `1px solid ${T.border}`,
                borderRadius: 10, fontSize: 13, color: T.text, cursor: "pointer" }}>
              <option value="tous">Toutes catégories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.nom}>{c.icon} {c.nom}</option>)}
            </select>
            {mode === "avancee" && (
              <>
                <input value={villeFilter} onChange={e => setVilleFilter(e.target.value)}
                  placeholder="Ville..." style={{ flex: 1, minWidth: 120, padding: "10px 14px",
                    border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.text, outline: "none" }} />
                <input value={tarifMax} onChange={e => setTarifMax(e.target.value)}
                  placeholder="Tarif max (DT)..." type="number"
                  style={{ flex: 1, minWidth: 120, padding: "10px 14px",
                    border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.text, outline: "none" }} />
              </>
            )}
            <Btn variant="primary">Rechercher</Btn>
          </div>
        </div>
      </Card>

      <p style={{ margin: "0 0 16px", fontSize: 13, color: T.textMuted }}>{filtered.length} résultat(s) trouvé(s)</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {filtered.map(s => (
          <Card key={s.id} style={{ cursor: "pointer" }}>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{s.nom}</h4>
                  <p style={{ margin: "4px 0", fontSize: 12, color: T.textMuted }}>{s.categorie} › {s.sousCategorie}</p>
                </div>
                <Badge type="info">{s.tarif} DT/{s.unite}</Badge>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Avatar nom={s.prestataire} size={28} bg={T.teal} />
                <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{s.prestataire}</span>
                <span style={{ fontSize: 11, color: T.textMuted }}>📍 {s.ville}</span>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{s.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {s.note > 0 ? <StarRating note={s.note} showNumber /> : <span style={{ fontSize: 11, color: T.textMuted }}>Pas encore noté</span>}
                <Btn size="sm" variant="primary">Contacter</Btn>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1" }}><EmptyState icon="🔍" title="Aucun résultat" desc="Essayez de modifier vos critères de recherche." /></div>}
      </div>
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
function PrestNotifications() {
  const [notifs, setNotifs] = useState([
    { id: 1, type: "rdv", icon: "📅", title: "Nouveau rendez-vous", msg: "Yasmine Ben Ali a pris un RDV pour Plomberie générale le 02 Avr à 09:00.", date: "il y a 2h", lu: false },
    { id: 2, type: "avis", icon: "⭐", title: "Nouvel avis reçu", msg: "Vous avez reçu un avis 5 étoiles de Nour Hamdi pour Plomberie générale.", date: "il y a 5h", lu: false },
    { id: 3, type: "doc", icon: "✅", title: "Documents acceptés", msg: "Vos documents ont été vérifiés et acceptés par l'administration.", date: "hier", lu: true },
    { id: 4, type: "system", icon: "ℹ️", title: "Mise à jour plateforme", msg: "Une nouvelle fonctionnalité de messagerie est disponible.", date: "il y a 3 jours", lu: true },
  ]);

  const markAll = () => setNotifs(notifs.map(n => ({ ...n, lu: true })));
  const unread = notifs.filter(n => !n.lu).length;

  return (
    <div>
      <PageHeader title="Notifications"
        subtitle={`${unread} notification(s) non lue(s)`}
        action={<Btn variant="ghost" onClick={markAll}>Tout marquer comme lu</Btn>} />

      <Card>
        {notifs.map((n, i) => (
          <div key={n.id} onClick={() => setNotifs(notifs.map(notif => notif.id === n.id ? {...notif, lu: true} : notif))}
            style={{ padding: "18px 24px", borderTop: i > 0 ? `1px solid ${T.border}` : "none",
              background: n.lu ? "transparent" : T.accentLight, cursor: "pointer",
              display: "flex", gap: 14, alignItems: "flex-start", transition: "background 0.2s" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12,
              background: n.lu ? T.surfaceAlt : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: n.lu ? 500 : 700, color: T.text }}>{n.title}</p>
                <span style={{ fontSize: 11, color: T.textMuted, flexShrink: 0, marginLeft: 12 }}>{n.date}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>{n.msg}</p>
            </div>
            {!n.lu && (
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent,
                flexShrink: 0, marginTop: 4 }} />
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const PAGES = {
  dashboard: PrestDashboard,
  profil: PrestProfil,
  documents: PrestDocuments,
  statut: PrestStatut,
  services: PrestServices,
  rendezvous: PrestRendezvous,
  avis: PrestAvis,
  recherche: PrestRecherche,
  notifications: PrestNotifications,
};

export default function PrestataireApp() {
  const [activePage, setActivePage] = useState("dashboard");
  const Page = PAGES[activePage] || PrestDashboard;

  return (
    <Layout navItems={NAV} user={ME} activePage={activePage}
      setActivePage={setActivePage} role="prestataire">
      <Page />
    </Layout>
  );
}
