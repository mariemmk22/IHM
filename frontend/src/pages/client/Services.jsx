import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

export default function ClientServices() {
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