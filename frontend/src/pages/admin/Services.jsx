import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";

export default function AdminServices() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("tous");

  const filtered = SERVICES.filter(s => {
    const matchSearch = s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.prestataire.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "tous" || s.categorie === catFilter;
    return matchSearch && matchCat;
  });

  const cats = ["tous", ...new Set(SERVICES.map(s => s.categorie))];

  return (
    <div>
      <PageHeader title="Gestion des services"
        subtitle={`${SERVICES.length} services enregistrés`} />

      <Card>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
          display: "flex", gap: 12, flexWrap: "wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un service..." />
          <FilterBar filters={cats.map(c => ({ value: c, label: c === "tous" ? "Toutes catégories" : c }))}
            value={catFilter} onChange={setCatFilter} />
        </div>
        <Table
          columns={[
            { label: "Service", render: r => (
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{r.nom}</p>
                <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{r.categorie} › {r.sousCategorie}</p>
              </div>
            )},
            { label: "Prestataire", key: "prestataire" },
            { label: "Ville", key: "ville" },
            { label: "Tarif", render: r => `${r.tarif} DT/${r.unite}` },
            { label: "Note", render: r => r.note > 0 ? <StarRating note={r.note} showNumber /> : <span style={{ color: T.textMuted }}>—</span> },
            { label: "Statut", render: r => <Badge type={r.actif ? "success" : "danger"}>{r.actif ? "Actif" : "Inactif"}</Badge> },
            { label: "Actions", render: r => (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn size="sm" variant="secondary">Voir</Btn>
                <Btn size="sm" variant="outlineDanger">Suspendre</Btn>
              </div>
            )},
          ]}
          data={filtered}
          emptyMsg="Aucun service trouvé"
        />
      </Card>
    </div>
  );
}