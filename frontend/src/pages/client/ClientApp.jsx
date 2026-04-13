import { useState } from "react";
import Layout from "../../components/Layout";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

const NAV = [
  { group: "Général" },
  { id: "accueil", icon: "🏠", label: "Accueil" },
  { group: "Trouver" },
  { id: "recherche", icon: "🔍", label: "Rechercher" },
  { id: "services", icon: "⚙️", label: "Tous les services" },
  { id: "prestataires", icon: "👷", label: "Prestataires" },
  { group: "Mes activités" },
  { id: "rendezvous", icon: "📅", label: "Mes Rendez-vous", badge: "1" },
  { id: "avis", icon: "⭐", label: "Mes Avis" },
  { group: "Compte" },
  { id: "profil", icon: "👤", label: "Mon Profil" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
];

const ME_CLIENT = { id: 2, nom: "Yasmine Ben Ali", email: "yasmine@email.com", role: "client" };


// ─── Accueil ─────────────────────────────────────────────────────────────────
function ClientAccueil({ setActivePage }) {
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
            <Card key={s.id} style={{ cursor: "pointer" }}>
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

// ─── Recherche ───────────────────────────────────────────────────────────────
function ClientRecherche() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("tous");
  const [villeFilter, setVilleFilter] = useState("");
  const [tarifMax, setTarifMax] = useState("");
  const [noteMin, setNoteMin] = useState("0");
  const [mode, setMode] = useState("simple");
  const rdvModal = useModal();
  const detailModal = useModal();

  const filtered = SERVICES.filter(s => {
    const matchSearch = s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.prestataire.toLowerCase().includes(search.toLowerCase()) ||
      s.categorie.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "tous" || s.categorie === catFilter;
    const matchVille = !villeFilter || s.ville.toLowerCase().includes(villeFilter.toLowerCase());
    const matchTarif = !tarifMax || s.tarif <= parseInt(tarifMax);
    const matchNote = s.note >= parseFloat(noteMin);
    return matchSearch && matchCat && matchVille && matchTarif && matchNote && s.actif;
  });

  return (
    <div>
      <PageHeader title="Rechercher un service" />

      <Card style={{ marginBottom: 24 }}>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{id:"simple",label:"🔍 Simple"},{id:"avancee",label:"⚙️ Avancée"}].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: "none", background: mode === m.id ? T.primary : T.surfaceAlt,
                color: mode === m.id ? "#fff" : T.textMuted,
              }}>{m.label}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 2, minWidth: 200 }}>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Plomberie, électricité, peinture..."
                style={{ width: "100%", padding: "11px 16px", border: `1px solid ${T.border}`,
                  borderRadius: 10, fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                style={{ width: "100%", padding: "11px 14px", border: `1px solid ${T.border}`,
                  borderRadius: 10, fontSize: 13, color: T.text, cursor: "pointer", boxSizing: "border-box" }}>
                <option value="tous">Toutes catégories</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.nom}>{c.icon} {c.nom}</option>)}
              </select>
            </div>
            {mode === "avancee" && (
              <>
                <input value={villeFilter} onChange={e => setVilleFilter(e.target.value)}
                  placeholder="Ville..." style={{ flex: 1, minWidth: 110, padding: "11px 14px",
                    border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                <input value={tarifMax} onChange={e => setTarifMax(e.target.value)}
                  placeholder="Tarif max (DT)" type="number"
                  style={{ flex: 1, minWidth: 110, padding: "11px 14px",
                    border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, boxSizing: "border-box", outline: "none" }} />
                <select value={noteMin} onChange={e => setNoteMin(e.target.value)}
                  style={{ flex: 1, minWidth: 110, padding: "11px 14px", border: `1px solid ${T.border}`,
                    borderRadius: 10, fontSize: 13, cursor: "pointer", boxSizing: "border-box" }}>
                  <option value="0">Toutes les notes</option>
                  <option value="3">★ 3+ étoiles</option>
                  <option value="4">★ 4+ étoiles</option>
                  <option value="4.5">★ 4.5+</option>
                </select>
              </>
            )}
            <Btn variant="primary">Rechercher</Btn>
          </div>
        </div>
      </Card>

      <p style={{ margin: "0 0 16px", fontSize: 13, color: T.textMuted }}>{filtered.length} résultat(s)</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {filtered.map(s => (
          <Card key={s.id}>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: T.tealLight,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                  {CATEGORIES.find(c => c.nom === s.categorie)?.icon || "⚙️"}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: T.text }}>{s.nom}</h4>
                  <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{s.categorie} › {s.sousCategorie}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.teal }}>{s.tarif} DT</p>
                  <p style={{ margin: 0, fontSize: 10, color: T.textMuted }}>/{s.unite}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
                padding: "10px 14px", background: T.surfaceAlt, borderRadius: 10 }}>
                <Avatar nom={s.prestataire} size={32} bg={T.teal} />
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{s.prestataire}</p>
                  <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>📍 {s.ville}</p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  {s.note > 0 ? <StarRating note={s.note} showNumber /> : <span style={{ fontSize: 11, color: T.textMuted }}>Nouveau</span>}
                </div>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{s.description}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn size="sm" variant="secondary" style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => detailModal.show(s)}>👁 Voir détail</Btn>
                <Btn size="sm" variant="primary" style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => rdvModal.show(s)}>📅 Prendre RDV</Btn>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1" }}>
            <EmptyState icon="🔍" title="Aucun résultat" desc="Modifiez vos critères pour trouver des services." />
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal title={detailModal.data?.nom} open={detailModal.open} onClose={detailModal.hide} width={600}>
        {detailModal.data && (
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
              <Avatar nom={detailModal.data.prestataire} size={52} bg={T.teal} />
              <div>
                <h4 style={{ margin: 0, fontSize: 15, color: T.text }}>{detailModal.data.prestataire}</h4>
                <p style={{ margin: "3px 0", fontSize: 12, color: T.textMuted }}>{detailModal.data.categorie} · {detailModal.data.ville}</p>
                {detailModal.data.note > 0 && <StarRating note={detailModal.data.note} showNumber />}
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.teal }}>{detailModal.data.tarif} DT</p>
                <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>/{detailModal.data.unite}</p>
              </div>
            </div>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: T.text, lineHeight: 1.7,
              padding: 16, background: T.surfaceAlt, borderRadius: 10 }}>
              {detailModal.data.description}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={detailModal.hide}>Fermer</Btn>
              <Btn variant="primary" onClick={() => { detailModal.hide(); rdvModal.show(detailModal.data); }}>
                📅 Prendre rendez-vous
              </Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* RDV modal */}
      <Modal title={`Rendez-vous · ${rdvModal.data?.nom}`} open={rdvModal.open} onClose={rdvModal.hide}>
        {rdvModal.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "14px 16px", background: T.tealLight, borderRadius: 12, fontSize: 13, color: T.teal }}>
              <strong>{rdvModal.data.prestataire}</strong> · {rdvModal.data.tarif} DT/{rdvModal.data.unite} · 📍 {rdvModal.data.ville}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Date souhaitée" type="date" value="" onChange={() => {}} />
              <Input label="Heure souhaitée" type="time" value="" onChange={() => {}} />
            </div>
            <Input label="Adresse d'intervention" placeholder="Votre adresse complète..." value="" onChange={() => {}} />
            <Textarea label="Description du problème" rows={3}
              placeholder="Décrivez votre besoin en détail..." value="" onChange={() => {}} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={rdvModal.hide}>Annuler</Btn>
              <Btn variant="primary" onClick={rdvModal.hide}>Confirmer le rendez-vous</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Tous les services ────────────────────────────────────────────────────────
function ClientServices() {
  const [catFilter, setCatFilter] = useState("tous");
  const rdvModal = useModal();

  const filtered = catFilter === "tous" ? SERVICES.filter(s => s.actif) :
    SERVICES.filter(s => s.actif && s.categorie === catFilter);

  return (
    <div>
      <PageHeader title="Tous les services" subtitle={`${SERVICES.filter(s => s.actif).length} services disponibles`} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <button onClick={() => setCatFilter("tous")} style={{
          padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
          border: "none", cursor: "pointer",
          background: catFilter === "tous" ? T.primary : T.surface,
          color: catFilter === "tous" ? "#fff" : T.textMuted,
          border: `1px solid ${catFilter === "tous" ? T.primary : T.border}`,
        }}>Tous</button>
        {CATEGORIES.filter(c => c.actif).map(cat => (
          <button key={cat.id} onClick={() => setCatFilter(cat.nom)} style={{
            padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            background: catFilter === cat.nom ? T.primary : T.surface,
            color: catFilter === cat.nom ? "#fff" : T.textMuted,
            border: `1px solid ${catFilter === cat.nom ? T.primary : T.border}`,
          }}>
            {cat.icon} {cat.nom}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(s => (
          <Card key={s.id}>
            <div style={{ height: 80, background: T.tealLight,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
              {CATEGORIES.find(c => c.nom === s.categorie)?.icon || "⚙️"}
            </div>
            <div style={{ padding: "16px 18px" }}>
              <h4 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: T.text }}>{s.nom}</h4>
              <p style={{ margin: "0 0 8px", fontSize: 11, color: T.textMuted }}>{s.prestataire} · {s.ville}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                {s.note > 0 ? <StarRating note={s.note} showNumber /> : <span style={{ fontSize: 11, color: T.textMuted }}>Nouveau</span>}
                <span style={{ fontSize: 14, fontWeight: 700, color: T.teal }}>{s.tarif} DT/{s.unite}</span>
              </div>
              <Btn variant="primary" size="sm" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => rdvModal.show(s)}>
                Prendre rendez-vous
              </Btn>
            </div>
          </Card>
        ))}
      </div>

      <Modal title={`RDV · ${rdvModal.data?.nom}`} open={rdvModal.open} onClose={rdvModal.hide}>
        {rdvModal.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "14px 16px", background: T.tealLight, borderRadius: 12, fontSize: 13 }}>
              <strong>{rdvModal.data.prestataire}</strong> · {rdvModal.data.tarif} DT/{rdvModal.data.unite}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Date" type="date" value="" onChange={() => {}} />
              <Input label="Heure" type="time" value="" onChange={() => {}} />
            </div>
            <Input label="Adresse" placeholder="Votre adresse..." value="" onChange={() => {}} />
            <Textarea label="Description" rows={3} placeholder="Votre besoin..." value="" onChange={() => {}} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={rdvModal.hide}>Annuler</Btn>
              <Btn variant="primary" onClick={rdvModal.hide}>Confirmer</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Prestataires ─────────────────────────────────────────────────────────────
function ClientPrestataires() {
  const [search, setSearch] = useState("");
  const prestataires = USERS.filter(u => u.role === "prestataire" && u.statut === "actif");
  const filtered = prestataires.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.ville.toLowerCase().includes(search.toLowerCase()) ||
    (p.services || []).some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="Prestataires" subtitle={`${prestataires.length} prestataires disponibles`} />

      <div style={{ marginBottom: 24, maxWidth: 400 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un prestataire..." />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(p => (
          <Card key={p.id}>
            <div style={{ padding: "24px 20px", textAlign: "center" }}>
              <Avatar nom={p.nom} size={60} bg={T.teal} />
              <h4 style={{ margin: "12px 0 4px", fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "Georgia" }}>{p.nom}</h4>
              {p.services && (
                <p style={{ margin: "0 0 8px", fontSize: 12, color: T.textMuted }}>{p.services.join(", ")}</p>
              )}
              <p style={{ margin: "0 0 10px", fontSize: 12, color: T.textMuted }}>📍 {p.ville}</p>
              {p.note > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <StarRating note={p.note} showNumber />
                </div>
              )}
              <StatusBadge statut={p.statut} />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <Btn size="sm" variant="secondary" style={{ flex: 1, justifyContent: "center" }}>Profil</Btn>
                <Btn size="sm" variant="primary" style={{ flex: 1, justifyContent: "center" }}>Contacter</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Rendez-vous ─────────────────────────────────────────────────────────────
function ClientRendezvous() {
  const [rdvs, setRdvs] = useState(MY_RDV);
  const [filter, setFilter] = useState("tous");
  const avisModal = useModal();
  const [avisForm, setAvisForm] = useState({ note: 5, commentaire: "" });

  const filtered = filter === "tous" ? rdvs : rdvs.filter(r => r.statut === filter);
  const cancelRdv = (id) => setRdvs(rdvs.map(r => r.id === id ? { ...r, statut: "annulé" } : r));

  return (
    <div>
      <PageHeader title="Mes Rendez-vous" subtitle={`${rdvs.length} rendez-vous au total`} />

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: rdvs.length, color: T.text },
          { label: "Confirmés", value: rdvs.filter(r=>r.statut==="confirmé").length, color: T.success },
          { label: "En attente", value: rdvs.filter(r=>r.statut==="en attente").length, color: T.warning },
          { label: "Annulés", value: rdvs.filter(r=>r.statut==="annulé").length, color: T.danger },
        ].map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
            padding: "12px 18px", textAlign: "center", flex: 1 }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "Georgia" }}>{s.value}</p>
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
          <div key={rdv.id} style={{ padding: "20px 24px", borderTop: i > 0 ? `1px solid ${T.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: T.surfaceAlt,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: T.teal, textTransform: "uppercase" }}>{rdv.date.split(" ")[1]}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: T.text, lineHeight: 1 }}>{rdv.date.split(" ")[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{rdv.service}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.teal }}>{rdv.montant} DT</span>
                    <StatusBadge statut={rdv.statut} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Avatar nom={rdv.prestataire} size={24} bg={T.teal} />
                  <span style={{ fontSize: 12, color: T.textMuted }}>{rdv.prestataire}</span>
                  <span style={{ color: T.textLight }}>·</span>
                  <span style={{ fontSize: 12, color: T.textMuted }}>🕐 {rdv.heure}</span>
                  <span style={{ color: T.textLight }}>·</span>
                  <span style={{ fontSize: 12, color: T.textMuted }}>📍 {rdv.adresse}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {rdv.statut === "en attente" && (
                    <Btn size="sm" variant="outlineDanger" onClick={() => cancelRdv(rdv.id)}>Annuler</Btn>
                  )}
                  {rdv.statut === "terminé" && rdv.note === null && (
                    <Btn size="sm" variant="primary" onClick={() => avisModal.show(rdv)}>⭐ Laisser un avis</Btn>
                  )}
                  {rdv.statut === "terminé" && rdv.note !== null && (
                    <Badge type="success">Avis donné ★{rdv.note}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && <EmptyState icon="📅" title="Aucun rendez-vous" desc="Vous n'avez pas encore de rendez-vous." />}
      </Card>

      <Modal title="Laisser un avis" open={avisModal.open} onClose={avisModal.hide}>
        {avisModal.data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ padding: "14px 16px", background: T.surfaceAlt, borderRadius: 12 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.text }}>{avisModal.data.service}</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: T.textMuted }}>Prestataire: {avisModal.data.prestataire}</p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: T.textMuted,
                textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Votre note</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setAvisForm({...avisForm, note: n})} style={{
                    width: 44, height: 44, borderRadius: 10, border: "none", cursor: "pointer",
                    fontSize: 20, background: n <= avisForm.note ? T.warningLight : T.surfaceAlt,
                    color: n <= avisForm.note ? T.gold : T.textLight,
                  }}>★</button>
                ))}
                <span style={{ alignSelf: "center", fontSize: 14, fontWeight: 700, color: T.text, marginLeft: 8 }}>
                  {avisForm.note}/5
                </span>
              </div>
            </div>
            <Textarea label="Votre commentaire" value={avisForm.commentaire}
              onChange={e => setAvisForm({...avisForm, commentaire: e.target.value})}
              rows={3} placeholder="Partagez votre expérience avec ce prestataire..." />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={avisModal.hide}>Annuler</Btn>
              <Btn variant="primary" onClick={avisModal.hide}>Publier l'avis</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Avis ────────────────────────────────────────────────────────────────────
function ClientAvis() {
  return (
    <div>
      <PageHeader title="Mes Avis" subtitle={`${MY_AVIS.length} avis publiés`} />

      {MY_AVIS.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MY_AVIS.map(avis => (
            <Card key={avis.id}>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: T.text }}>{avis.service}</h4>
                    <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>
                      Prestataire: <strong>{avis.prestataire}</strong> · {avis.date}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <StarRating note={avis.note} />
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: T.textMuted }}>{avis.note}/5</p>
                  </div>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: T.text, lineHeight: 1.6,
                  padding: "12px 16px", background: T.surfaceAlt, borderRadius: 10 }}>
                  "{avis.commentaire}"
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="secondary">Modifier</Btn>
                  <Btn size="sm" variant="outlineDanger">Supprimer</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon="⭐" title="Aucun avis" desc="Vous n'avez pas encore publié d'avis. Terminez un rendez-vous pour laisser un avis." />
      )}
    </div>
  );
}

// ─── Profil ──────────────────────────────────────────────────────────────────
function ClientProfil() {
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

// ─── Notifications ────────────────────────────────────────────────────────────
function ClientNotifications() {
  const [notifs, setNotifs] = useState([
    { id: 1, icon: "✅", title: "Rendez-vous confirmé", msg: "Ahmed Mansouri a confirmé votre rendez-vous du 02 Avr à 09:00.", date: "il y a 1h", lu: false },
    { id: 2, icon: "📅", title: "Rappel rendez-vous", msg: "Votre rendez-vous pour Plomberie générale est demain à 09:00.", date: "il y a 3h", lu: false },
    { id: 3, icon: "ℹ️", title: "Nouveau prestataire", msg: "Un nouveau prestataire dans votre ville propose des services d'électricité.", date: "hier", lu: true },
    { id: 4, icon: "🎉", title: "Offre spéciale", msg: "Profitez de 15% de réduction sur votre prochain service de nettoyage.", date: "il y a 3 jours", lu: true },
  ]);

  const markAll = () => setNotifs(notifs.map(n => ({ ...n, lu: true })));

  return (
    <div>
      <PageHeader title="Notifications"
        subtitle={`${notifs.filter(n => !n.lu).length} non lue(s)`}
        action={<Btn variant="ghost" onClick={markAll}>Tout marquer comme lu</Btn>} />
      <Card>
        {notifs.map((n, i) => (
          <div key={n.id} onClick={() => setNotifs(notifs.map(notif => notif.id === n.id ? {...notif, lu: true} : notif))}
            style={{ padding: "18px 24px", borderTop: i > 0 ? `1px solid ${T.border}` : "none",
              background: n.lu ? "transparent" : "#f0fdf4",
              cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12,
              background: n.lu ? T.surfaceAlt : "#d1fae5",
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
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal, flexShrink: 0, marginTop: 4 }} />
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const PAGES_MAP = {
  accueil: ClientAccueil,
  recherche: ClientRecherche,
  services: ClientServices,
  prestataires: ClientPrestataires,
  rendezvous: ClientRendezvous,
  avis: ClientAvis,
  profil: ClientProfil,
  notifications: ClientNotifications,
};

export default function ClientApp() {
  const [activePage, setActivePage] = useState("accueil");
  const Page = PAGES_MAP[activePage] || PAGES_MAP.accueil;

  return (
    <Layout navItems={NAV} user={ME_CLIENT} activePage={activePage}
      setActivePage={setActivePage} role="client">
      <Page setActivePage={setActivePage} />
    </Layout>
  );
}
