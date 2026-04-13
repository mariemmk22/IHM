import { useState } from "react";
import Login from "./pages/auth/Login";
import AdminApp from "./pages/admin/AdminApp";
import PrestataireApp from "./pages/prestataire/PrestataireApp";
import ClientApp from "./pages/client/ClientApp";

export default function App() {
  const [role, setRole] = useState(null); // null = login page

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  if (!role) return <Login onLogin={handleLogin} />;
  if (role === "admin") return <AdminApp onLogout={handleLogout} />;
  if (role === "prestataire") return <PrestataireApp onLogout={handleLogout} />;
  if (role === "client") return <ClientApp onLogout={handleLogout} />;

  return <Login onLogin={handleLogin} />;
}
