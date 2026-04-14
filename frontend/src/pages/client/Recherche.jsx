import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

export default function ClientRecherche() {
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