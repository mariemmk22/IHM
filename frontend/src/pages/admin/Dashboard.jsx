import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de la plateforme ServiConnect" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total utilisateurs" value={ADMIN_STATS.totalUsers} trend="+12%" up icon="👥" />
        <StatCard label="Prestataires" value={ADMIN_STATS.totalPrestataires} trend="+5%" up icon="🔧" color={T.teal} />
        <StatCard label="Clients" value={ADMIN_STATS.totalClients} trend="+18%" up icon="👤" color={T.info} />
        <StatCard label="En attente docs" value={ADMIN_STATS.enAttente} trend="" up={false} icon="⏳" color={T.warning} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Services publiés" value={ADMIN_STATS.totalServices} trend="+23%" up icon="⚙️" color={T.gold} />
        <StatCard label="RDV total" value={ADMIN_STATS.totalRdv} trend="+8%" up icon="📅" color={T.teal} />
        <StatCard label="RDV ce mois" value={ADMIN_STATS.rdvCeMois} trend="+15%" up icon="📆" color={T.info} />
        <StatCard label="Revenus estimés" value={ADMIN_STATS.revenus} trend="+20%" up icon="💰" color={T.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Recent users */}
        <Card>
          <CardHeader title="Derniers utilisateurs inscrits"
            action={<Btn variant="ghost" size="sm">Voir tout →</Btn>} />
          <Table
            columns={[
              { label: "Utilisateur", render: r => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar nom={r.nom} size={32} bg={r.role === "prestataire" ? T.teal : T.accent} />
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{r.nom}</p>
                    <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{r.email}</p>
                  </div>
                </div>
              )},
              { label: "Rôle", render: r => <Badge type={r.role === "prestataire" ? "teal" : "info"}>{r.role}</Badge> },
              { label: "Ville", key: "ville" },
              { label: "Statut", render: r => <StatusBadge statut={r.statut} /> },
              { label: "Inscription", key: "dateInscription" },
            ]}
            data={USERS.slice(0, 5)}
          />
        </Card>

        {/* Docs en attente */}
        <Card>
          <CardHeader title="Documents à vérifier" subtitle={`${DOCUMENTS.filter(d => d.statut === "en attente").length} en attente`} />
          {DOCUMENTS.filter(d => d.statut === "en attente").map(doc => (
            <div key={doc.id} style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{doc.prestataire}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted }}>{doc.type}</p>
                </div>
                <StatusBadge statut={doc.statut} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="success" size="sm">✓ Accepter</Btn>
                <Btn variant="outlineDanger" size="sm">✗ Refuser</Btn>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Activité récente */}
      <Card style={{ marginTop: 24 }}>
        <CardHeader title="Rendez-vous récents" />
        <Table
          columns={[
            { label: "Client", key: "client" },
            { label: "Prestataire", key: "prestataire" },
            { label: "Service", key: "service", wrap: true },
            { label: "Date", key: "date" },
            { label: "Montant", render: r => `${r.montant} DT` },
            { label: "Statut", render: r => <StatusBadge statut={r.statut} /> },
          ]}
          data={RENDEZVOUS}
        />
      </Card>
    </div>
  );
}