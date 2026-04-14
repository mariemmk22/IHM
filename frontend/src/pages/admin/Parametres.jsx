import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";

export default function AdminParametres() {
  const [settings, setSettings] = useState({
    siteName: "ServiConnect",
    email: "contact@serviconnect.tn",
    telephone: "+216 71 000 000",
    adresse: "Tunis, Tunisie",
    commissionRate: "10",
    autoApprove: false,
    emailNotif: true,
    smsNotif: false,
    maintenanceMode: false,
  });

  return (
    <div>
      <PageHeader title="Paramètres de la plateforme" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <CardHeader title="Informations générales" />
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Nom de la plateforme" value={settings.siteName}
              onChange={e => setSettings({...settings, siteName: e.target.value})} />
            <Input label="Email de contact" value={settings.email}
              onChange={e => setSettings({...settings, email: e.target.value})} type="email" />
            <Input label="Téléphone" value={settings.telephone}
              onChange={e => setSettings({...settings, telephone: e.target.value})} />
            <Input label="Adresse" value={settings.adresse}
              onChange={e => setSettings({...settings, adresse: e.target.value})} />
            <Input label="Taux de commission (%)" value={settings.commissionRate}
              onChange={e => setSettings({...settings, commissionRate: e.target.value})} type="number" />
            <Btn variant="primary">Sauvegarder</Btn>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <CardHeader title="Notifications" />
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "emailNotif", label: "Notifications par email" },
                { key: "smsNotif", label: "Notifications par SMS" },
                { key: "autoApprove", label: "Approbation auto des prestataires" },
                { key: "maintenanceMode", label: "Mode maintenance" },
              ].map(s => (
                <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: T.text }}>{s.label}</span>
                  <Toggle checked={settings[s.key]} onChange={v => setSettings({...settings, [s.key]: v})} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Actions rapides" />
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "📊 Exporter les données", variant: "secondary" },
                { label: "🔄 Synchroniser les services", variant: "secondary" },
                { label: "🗑️ Vider le cache", variant: "secondary" },
                { label: "⚠️ Réinitialiser la base", variant: "outlineDanger" },
              ].map((a, i) => (
                <Btn key={i} variant={a.variant} style={{ justifyContent: "flex-start" }}>{a.label}</Btn>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}