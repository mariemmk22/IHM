import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";

export default function AdminRendezvous() {
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");

  const filtered = RENDEZVOUS.filter(r => {
    const matchF = filter === "tous" || r.statut === filter;
    const matchS = r.client.toLowerCase().includes(search.toLowerCase()) ||
      r.prestataire.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  return (
    <div>
      <PageHeader title="Tous les rendez-vous"
        subtitle={`${RENDEZVOUS.length} rendez-vous au total`} />

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: RENDEZVOUS.length, color: T.text },
          { label: "Confirmés", value: RENDEZVOUS.filter(r => r.statut === "confirmé").length, color: T.success },
          { label: "En attente", value: RENDEZVOUS.filter(r => r.statut === "en attente").length, color: T.warning },
          { label: "Annulés", value: RENDEZVOUS.filter(r => r.statut === "annulé").length, color: T.danger },
          { label: "Terminés", value: RENDEZVOUS.filter(r => r.statut === "terminé").length, color: T.info },
        ].map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
            padding: "12px 16px", textAlign: "center", flex: 1 }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "Georgia" }}>{s.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 10, color: T.textMuted, textTransform: "uppercase" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
          display: "flex", gap: 12, flexWrap: "wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher..." />
          <FilterBar filters={[
            {value:"tous",label:"Tous"},{value:"confirmé",label:"Confirmés"},
            {value:"en attente",label:"En attente"},{value:"annulé",label:"Annulés"},{value:"terminé",label:"Terminés"}
          ]} value={filter} onChange={setFilter} />
        </div>
        <Table
          columns={[
            { label: "Client", key: "client" },
            { label: "Prestataire", key: "prestataire" },
            { label: "Service", key: "service", wrap: true },
            { label: "Date", key: "date" },
            { label: "Heure", key: "heure" },
            { label: "Montant", render: r => `${r.montant} DT` },
            { label: "Statut", render: r => <StatusBadge statut={r.statut} /> },
          ]}
          data={filtered}
        />
      </Card>
    </div>
  );
}