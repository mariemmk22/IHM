import { useState } from "react";
import { T, Avatar } from "./UI";

export default function Layout({ navItems, user, children, activePage, setActivePage, role }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const roleColors = {
    admin: { bg: "#0f172a", accent: "#e11d48", gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" },
    prestataire: { bg: "#0c1445", accent: "#e11d48", gradient: "linear-gradient(135deg, #0c1445 0%, #1a237e 100%)" },
    client: { bg: "#064e3b", accent: "#e11d48", gradient: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)" },
  };
  const rc = roleColors[role] || roleColors.admin;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.surfaceAlt, fontFamily: "'Crimson Text', Georgia, serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 70 : 250, background: rc.gradient,
        display: "flex", flexDirection: "column", padding: "0 0 24px",
        flexShrink: 0, position: "sticky", top: 0, height: "100vh",
        transition: "width 0.25s ease", overflow: "hidden", zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? "24px 12px" : "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex",
          alignItems: "center", justifyContent: collapsed ? "center" : "space-between" }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: rc.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: 18, color: "#fff", flexShrink: 0 }}>S</div>
              <div>
                <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 16 }}>ServiConnect</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 10,
                  textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>
                  {role === "admin" ? "Administration" : role === "prestataire" ? "Prestataire" : "Client"}
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ width: 36, height: 36, borderRadius: 10, background: rc.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 18, color: "#fff" }}>S</div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{
            background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
            width: 28, height: 28, borderRadius: 8, color: "rgba(255,255,255,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0,
          }}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? "12px 8px" : "12px", overflowY: "auto" }}>
          {navItems.map((item, idx) => {
            const isActive = activePage === item.id;
            const isGroup = item.group;
            if (isGroup) {
              return collapsed ? null : (
                <p key={idx} style={{ margin: "16px 0 6px 10px", fontSize: 9, fontWeight: 700,
                  color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5,
                  fontFamily: "system-ui" }}>{item.group}</p>
              );
            }
            return (
              <button key={item.id} onClick={() => setActivePage(item.id)} title={collapsed ? item.label : ""} style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: collapsed ? 0 : 10, padding: collapsed ? "10px" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 10, marginBottom: 2, border: "none", cursor: "pointer",
                textAlign: "left", transition: "all 0.15s",
                background: isActive ? "rgba(225,29,72,0.2)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
              }}>
                <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0,
                  filter: isActive ? "none" : "opacity(0.7)" }}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, flex: 1,
                      fontFamily: "system-ui", whiteSpace: "nowrap" }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ background: rc.accent, color: "#fff", fontSize: 9,
                        fontWeight: 700, padding: "2px 7px", borderRadius: 20, fontFamily: "system-ui" }}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: rc.accent, flexShrink: 0 }} />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div style={{ margin: collapsed ? "0 8px" : "0 12px",
          borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "8px" : "10px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 10, background: "rgba(255,255,255,0.05)" }}>
            <Avatar nom={user.nom} size={32} bg={rc.accent} />
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 600,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  fontFamily: "system-ui" }}>{user.nom}</p>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.4)", fontSize: 10,
                  fontFamily: "system-ui" }}>{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{ background: T.surface, borderBottom: `1px solid ${T.border}`,
          padding: "0 32px", height: 60, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 5 }}>
          <div>
            {navItems.find(n => n.id === activePage) && (
              <span style={{ fontSize: 14, color: T.textMuted, fontFamily: "system-ui" }}>
                {navItems.find(n => n.id === activePage)?.icon}{" "}
                <strong style={{ color: T.text }}>{navItems.find(n => n.id === activePage)?.label}</strong>
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(!notifOpen)} style={{
                background: T.surfaceAlt, border: `1px solid ${T.border}`, cursor: "pointer",
                width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, position: "relative",
              }}>
                🔔
                <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8,
                  borderRadius: "50%", background: "#e11d48", border: "2px solid white" }} />
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: 46, background: T.surface,
                  border: `1px solid ${T.border}`, borderRadius: 14, width: 300, zIndex: 100,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}` }}>
                    <strong style={{ fontSize: 13, color: T.text, fontFamily: "system-ui" }}>Notifications</strong>
                  </div>
                  {[
                    { icon: "📅", msg: "Nouveau rendez-vous confirmé", time: "il y a 2h", unread: true },
                    { icon: "⭐", msg: "Vous avez reçu un avis 5 étoiles", time: "il y a 5h", unread: true },
                    { icon: "✅", msg: "Vos documents ont été acceptés", time: "hier", unread: false },
                  ].map((n, i) => (
                    <div key={i} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`,
                      background: n.unread ? T.accentLight : "transparent",
                      display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: 12, color: T.text, lineHeight: 1.4,
                          fontFamily: "system-ui" }}>{n.msg}</p>
                        <p style={{ margin: "3px 0 0", fontSize: 10, color: T.textMuted,
                          fontFamily: "system-ui" }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Avatar nom={user.nom} size={36} bg={rc.accent} />
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
