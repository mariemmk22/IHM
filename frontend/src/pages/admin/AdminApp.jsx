import { useState } from "react";
import Layout from "../../components/Layout";
import { T, Badge, StatusBadge, StarRating, Avatar, Card, CardHeader, Btn, Input, Select, Textarea, StatCard, Modal, Table, FilterBar, SearchBar, PageHeader, Toggle, Tabs, useModal, EmptyState } from "../../components/UI";
import { USERS, DOCUMENTS, CATEGORIES, SERVICES, RENDEZVOUS, AVIS, ADMIN_STATS } from "../../data/mockData";
import AdminDashboard from "./Dashboard";
import AdminUtilisateurs from "./Utilisateurs";
import AdminDocuments from "./Documents";
import AdminCategories from "./Categories";
import AdminServices from "./Services";
import AdminRendezvous from "./Rendezvous";
import AdminAvis from "./Avis";
import AdminParametres from "./Parametres";

const NAV = [
  { group: "Général" },
  { id: "dashboard", icon: "◈", label: "Tableau de bord" },
  { group: "Gestion" },
  { id: "utilisateurs", icon: "👥", label: "Utilisateurs", badge: "3" },
  { id: "documents", icon: "📋", label: "Documents", badge: "2" },
  { id: "categories", icon: "🏷️", label: "Catégories" },
  { id: "services", icon: "⚙️", label: "Services" },
  { group: "Suivi" },
  { id: "rendezvous", icon: "📅", label: "Rendez-vous" },
  { id: "avis", icon: "⭐", label: "Avis & Notes" },
  { group: "Compte" },
  { id: "parametres", icon: "⚙️", label: "Paramètres" },
];

const ADMIN_USER = { nom: "Admin Système", email: "admin@serviconnect.tn" };

// ─── Main Admin App ───────────────────────────────────────────────────────────
const PAGES = {
  dashboard: AdminDashboard,
  utilisateurs: AdminUtilisateurs,
  documents: AdminDocuments,
  categories: AdminCategories,
  services: AdminServices,
  rendezvous: AdminRendezvous,
  avis: AdminAvis,
  parametres: AdminParametres,
};

export default function AdminApp() {
  const [activePage, setActivePage] = useState("dashboard");
  const Page = PAGES[activePage] || AdminDashboard;

  return (
    <Layout navItems={NAV} user={ADMIN_USER} activePage={activePage}
      setActivePage={setActivePage} role="admin">
      <Page />
    </Layout>
  );
}
