import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";

export default function AdminDocuments() {
  const [docs, setDocs] = useState(DOCUMENTS);
  const [filter, setFilter] = useState("tous");

  const updateDoc = (id, statut) => {
    setDocs(docs.map(d => d.id === id ? { ...d, statut } : d));
  };

  const filtered = filter === "tous" ? docs : docs.filter(d => d.statut === filter);

  return (
    <div>
      <PageHeader title="Vérification des documents"
        subtitle="Vérifiez et validez les documents des prestataires" />

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: docs.length, color: T.text },
          { label: "En attente", value: docs.filter(d => d.statut === "en attente").length, color: T.warning },
          { label: "Acceptés", value: docs.filter(d => d.statut === "accepté").length, color: T.success },
          { label: "Refusés", value: docs.filter(d => d.statut === "refusé").length, color: T.danger },
        ].map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
            padding: "12px 20px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "Georgia" }}>{s.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted, textTransform: "uppercase" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
          <FilterBar
            filters={[{value:"tous",label:"Tous"},{value:"en attente",label:"En attente"},{value:"accepté",label:"Acceptés"},{value:"refusé",label:"Refusés"}]}
            value={filter} onChange={setFilter} />
        </div>

        {filtered.map(doc => (
          <div key={doc.id} style={{ padding: "20px 24px", borderTop: `1px solid ${T.border}`,
            display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: T.surfaceAlt,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              📄
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{doc.type}</p>
                <StatusBadge statut={doc.statut} />
              </div>
              <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>
                Prestataire: <strong>{doc.prestataire}</strong> · Soumis le {doc.date} · {doc.fichier}
              </p>
            </div>
            {doc.statut === "en attente" && (
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Btn variant="success" size="sm" onClick={() => updateDoc(doc.id, "accepté")}>✓ Accepter</Btn>
                <Btn variant="outlineDanger" size="sm" onClick={() => updateDoc(doc.id, "refusé")}>✗ Refuser</Btn>
              </div>
            )}
            {doc.statut !== "en attente" && (
              <Btn variant="secondary" size="sm">Revoir</Btn>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}