import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";

export default function AdminUtilisateurs() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("tous");
  const [statutFilter, setStatutFilter] = useState("tous");
  const modal = useModal();
  const [users, setUsers] = useState(USERS);

  const filtered = users.filter(u => {
    const matchSearch = u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "tous" || u.role === roleFilter;
    const matchStatut = statutFilter === "tous" || u.statut === statutFilter;
    return matchSearch && matchRole && matchStatut;
  });

  const toggleBlock = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, statut: u.statut === "bloqué" ? "actif" : "bloqué" } : u));
  };

  return (
    <div>
      <PageHeader title="Gestion des utilisateurs"
        subtitle={`${users.length} utilisateurs enregistrés`}
        action={<Btn variant="primary">+ Ajouter</Btn>} />

      {/* Stats mini */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: users.length, color: T.text },
          { label: "Prestataires", value: users.filter(u => u.role === "prestataire").length, color: T.teal },
          { label: "Clients", value: users.filter(u => u.role === "client").length, color: T.info },
          { label: "Bloqués", value: users.filter(u => u.statut === "bloqué").length, color: T.danger },
          { label: "En attente", value: users.filter(u => u.statut === "en attente").length, color: T.warning },
        ].map((s, i) => (
          <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
            padding: "12px 20px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "Georgia" }}>{s.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
          display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un utilisateur..." />
          <FilterBar
            filters={[{value:"tous",label:"Tous"},{value:"prestataire",label:"Prestataires"},{value:"client",label:"Clients"}]}
            value={roleFilter} onChange={setRoleFilter} />
          <FilterBar
            filters={[{value:"tous",label:"Tous statuts"},{value:"actif",label:"Actifs"},{value:"bloqué",label:"Bloqués"},{value:"en attente",label:"En attente"}]}
            value={statutFilter} onChange={setStatutFilter} />
        </div>
        <Table
          columns={[
            { label: "Utilisateur", render: r => (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar nom={r.nom} size={36} bg={r.role === "prestataire" ? T.teal : T.info} />
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>{r.nom}</p>
                  <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{r.email}</p>
                </div>
              </div>
            )},
            { label: "Rôle", render: r => <Badge type={r.role === "prestataire" ? "teal" : "info"}>{r.role}</Badge> },
            { label: "Ville", key: "ville" },
            { label: "Téléphone", key: "telephone" },
            { label: "Inscription", key: "dateInscription" },
            { label: "Statut", render: r => <StatusBadge statut={r.statut} /> },
            { label: "Actions", render: r => (
              <div style={{ display: "flex", gap: 6 }}>
                <Btn size="sm" variant="secondary" onClick={() => modal.show(r)}>👁 Voir</Btn>
                <Btn size="sm" variant={r.statut === "bloqué" ? "success" : "outlineDanger"}
                  onClick={() => toggleBlock(r.id)}>
                  {r.statut === "bloqué" ? "Débloquer" : "Bloquer"}
                </Btn>
              </div>
            )},
          ]}
          data={filtered}
          emptyMsg="Aucun utilisateur trouvé"
        />
      </Card>

      <Modal title={`Détail: ${modal.data?.nom}`} open={modal.open} onClose={modal.hide}>
        {modal.data && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <Avatar nom={modal.data.nom} size={60} bg={modal.data.role === "prestataire" ? T.teal : T.info} />
              <div>
                <h3 style={{ margin: 0, fontFamily: "Georgia" }}>{modal.data.nom}</h3>
                <Badge type={modal.data.role === "prestataire" ? "teal" : "info"}>{modal.data.role}</Badge>
                <span style={{ margin: "0 8px" }}><StatusBadge statut={modal.data.statut} /></span>
              </div>
            </div>
            {[
              { l: "Email", v: modal.data.email },
              { l: "Téléphone", v: modal.data.telephone },
              { l: "Ville", v: modal.data.ville },
              { l: "Date inscription", v: modal.data.dateInscription },
              { l: "Note", v: modal.data.note ? `${modal.data.note}/5` : "N/A" },
              { l: "Services", v: modal.data.services?.join(", ") || "—" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between",
                padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{f.l}</span>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{f.v}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="secondary" onClick={modal.hide}>Fermer</Btn>
              <Btn variant="danger">Supprimer</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}