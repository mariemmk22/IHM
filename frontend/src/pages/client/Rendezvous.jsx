import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

const MY_RDV = RENDEZVOUS.filter(r => r.clientId === 2);

export default function ClientRendezvous() {
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