import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

export default function ClientPrestataires() {
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