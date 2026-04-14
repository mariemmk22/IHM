import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

const MY_AVIS = AVIS.filter(a => a.clientId === 2);

export default function ClientAvis() {
  return (
    <div>
      <PageHeader title="Mes Avis" subtitle={`${MY_AVIS.length} avis publiés`} />

      {MY_AVIS.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MY_AVIS.map(avis => (
            <Card key={avis.id}>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: T.text }}>{avis.service}</h4>
                    <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>
                      Prestataire: <strong>{avis.prestataire}</strong> · {avis.date}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <StarRating note={avis.note} />
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: T.textMuted }}>{avis.note}/5</p>
                  </div>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: T.text, lineHeight: 1.6,
                  padding: "12px 16px", background: T.surfaceAlt, borderRadius: 10 }}>
                  "{avis.commentaire}"
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="secondary">Modifier</Btn>
                  <Btn size="sm" variant="outlineDanger">Supprimer</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon="⭐" title="Aucun avis" desc="Vous n'avez pas encore publié d'avis. Terminez un rendez-vous pour laisser un avis." />
      )}
    </div>
  );
}