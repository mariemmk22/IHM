import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";

export default function AdminCategories() {
  const [cats, setCats] = useState(CATEGORIES);
  const [selected, setSelected] = useState(null);
  const modal = useModal();
  const [newCat, setNewCat] = useState({ nom: "", description: "", icon: "🔧" });

  const toggleCat = (id) => {
    setCats(cats.map(c => c.id === id ? { ...c, actif: !c.actif } : c));
  };

  return (
    <div>
      <PageHeader title="Catégories & Sous-catégories"
        subtitle="Gérez les catégories de services disponibles"
        action={<Btn onClick={modal.show}>+ Nouvelle catégorie</Btn>} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Liste catégories */}
        <div>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, color: T.text, fontFamily: "Georgia" }}>Catégories ({cats.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cats.map(cat => (
              <Card key={cat.id} onClick={() => setSelected(selected?.id === cat.id ? null : cat)}
                style={{ cursor: "pointer", border: selected?.id === cat.id ? `2px solid ${T.accent}` : `1px solid ${T.border}` }}>
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: T.surfaceAlt,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{cat.nom}</p>
                      <StatusBadge statut={cat.actif ? "actif" : "bloqué"} />
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>
                      {cat.nbPrestataires} prestataires · {cat.sousCategories.length} sous-catégories
                    </p>
                  </div>
                  <Toggle checked={cat.actif} onChange={() => toggleCat(cat.id)} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sous-catégories */}
        <div>
          {selected ? (
            <>
              <h3 style={{ margin: "0 0 16px", fontSize: 15, color: T.text, fontFamily: "Georgia" }}>
                Sous-catégories de "{selected.nom}"
              </h3>
              <Card>
                {selected.sousCategories.map((sc, i) => (
                  <div key={i} style={{ padding: "14px 20px", borderTop: i > 0 ? `1px solid ${T.border}` : "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: T.teal, fontSize: 16 }}>›</span>
                      <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{sc}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" variant="secondary">Modifier</Btn>
                      <Btn size="sm" variant="outlineDanger">Supprimer</Btn>
                    </div>
                  </div>
                ))}
                <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}` }}>
                  <Btn variant="ghost" size="sm">+ Ajouter une sous-catégorie</Btn>
                </div>
              </Card>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", color: T.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🏷️</div>
              <p style={{ margin: 0, fontSize: 13 }}>Sélectionnez une catégorie pour voir ses sous-catégories</p>
            </div>
          )}
        </div>
      </div>

      <Modal title="Nouvelle catégorie" open={modal.open} onClose={modal.hide}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <Input label="Icône" value={newCat.icon} onChange={e => setNewCat({...newCat, icon: e.target.value})}
              style={{ width: 80 }} />
            <Input label="Nom de la catégorie" value={newCat.nom}
              onChange={e => setNewCat({...newCat, nom: e.target.value})}
              placeholder="Ex: Plomberie" required style={{ flex: 1 }} />
          </div>
          <Textarea label="Description" value={newCat.description}
            onChange={e => setNewCat({...newCat, description: e.target.value})}
            rows={3} placeholder="Décrivez cette catégorie..." />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={modal.hide}>Annuler</Btn>
            <Btn variant="primary" onClick={modal.hide}>Créer la catégorie</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}