import { useState } from "react";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { SERVICES, RENDEZVOUS, AVIS, CATEGORIES, USERS } from "../../data/mockData";

export default function ClientNotifications() {
  const [notifs, setNotifs] = useState([
    { id: 1, icon: "✅", title: "Rendez-vous confirmé", msg: "Ahmed Mansouri a confirmé votre rendez-vous du 02 Avr à 09:00.", date: "il y a 1h", lu: false },
    { id: 2, icon: "📅", title: "Rappel rendez-vous", msg: "Votre rendez-vous pour Plomberie générale est demain à 09:00.", date: "il y a 3h", lu: false },
    { id: 3, icon: "ℹ️", title: "Nouveau prestataire", msg: "Un nouveau prestataire dans votre ville propose des services d'électricité.", date: "hier", lu: true },
    { id: 4, icon: "🎉", title: "Offre spéciale", msg: "Profitez de 15% de réduction sur votre prochain service de nettoyage.", date: "il y a 3 jours", lu: true },
  ]);

  const markAll = () => setNotifs(notifs.map(n => ({ ...n, lu: true })));

  return (
    <div>
      <PageHeader title="Notifications"
        subtitle={`${notifs.filter(n => !n.lu).length} non lue(s)`}
        action={<Btn variant="ghost" onClick={markAll}>Tout marquer comme lu</Btn>} />
      <Card>
        {notifs.map((n, i) => (
          <div key={n.id} onClick={() => setNotifs(notifs.map(notif => notif.id === n.id ? {...notif, lu: true} : notif))}
            style={{ padding: "18px 24px", borderTop: i > 0 ? `1px solid ${T.border}` : "none",
              background: n.lu ? "transparent" : "#f0fdf4",
              cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12,
              background: n.lu ? T.surfaceAlt : "#d1fae5",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: n.lu ? 500 : 700, color: T.text }}>{n.title}</p>
                <span style={{ fontSize: 11, color: T.textMuted, flexShrink: 0, marginLeft: 12 }}>{n.date}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>{n.msg}</p>
            </div>
            {!n.lu && (
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.teal, flexShrink: 0, marginTop: 4 }} />
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}