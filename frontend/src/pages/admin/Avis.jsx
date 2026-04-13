import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";

export default function AdminAvis() {
  return (
    <div>
      <PageHeader title="Avis & Notes" subtitle="Modération des avis clients" />
      <Card>
        <Table
          columns={[
            { label: "Client", render: r => (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar nom={r.client} size={30} bg={T.info} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{r.client}</span>
              </div>
            )},
            { label: "Prestataire", key: "prestataire" },
            { label: "Service", key: "service", wrap: true },
            { label: "Note", render: r => <StarRating note={r.note} showNumber /> },
            { label: "Commentaire", render: r => (
              <p style={{ margin: 0, fontSize: 12, color: T.textMuted, maxWidth: 280 }}>{r.commentaire}</p>
            ), wrap: true },
            { label: "Date", key: "date" },
            { label: "Actions", render: () => (
              <Btn size="sm" variant="outlineDanger">Supprimer</Btn>
            )},
          ]}
          data={AVIS}
        />
      </Card>
    </div>
  );
}