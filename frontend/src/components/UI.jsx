import { useState } from "react";

export const T = {
  primary: "#0f172a",
  secondary: "#1e293b",
  accent: "#e11d48",
  accentHover: "#be123c",
  accentLight: "#fff1f2",
  teal: "#0d9488",
  tealLight: "#f0fdfa",
  gold: "#d97706",
  goldLight: "#fffbeb",
  surface: "#ffffff",
  surfaceAlt: "#f8fafc",
  surfaceHover: "#f1f5f9",
  text: "#0f172a",
  textMuted: "#64748b",
  textLight: "#94a3b8",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  success: "#059669",
  successLight: "#d1fae5",
  warning: "#d97706",
  warningLight: "#fef3c7",
  danger: "#dc2626",
  dangerLight: "#fee2e2",
  info: "#2563eb",
  infoLight: "#dbeafe",
};

export function Badge({ children, type = "default", size = "md" }) {
  const map = {
    default: { bg: T.surfaceAlt, color: T.textMuted },
    success: { bg: T.successLight, color: "#065f46" },
    warning: { bg: T.warningLight, color: "#92400e" },
    danger: { bg: T.dangerLight, color: "#991b1b" },
    info: { bg: T.infoLight, color: "#1e40af" },
    accent: { bg: T.accentLight, color: T.accent },
    teal: { bg: T.tealLight, color: "#0f766e" },
  };
  const s = map[type] || map.default;
  const pad = size === "sm" ? "2px 8px" : "4px 12px";
  const fs = size === "sm" ? 10 : 11;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: fs, fontWeight: 700,
      padding: pad, borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.6,
      display: "inline-block", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

export function StatusBadge({ statut }) {
  const map = {
    "actif": { type: "success", label: "Actif" },
    "bloqué": { type: "danger", label: "Bloqué" },
    "en attente": { type: "warning", label: "En attente" },
    "confirmé": { type: "success", label: "Confirmé" },
    "annulé": { type: "danger", label: "Annulé" },
    "terminé": { type: "info", label: "Terminé" },
    "accepté": { type: "success", label: "Accepté" },
    "refusé": { type: "danger", label: "Refusé" },
    "disponible": { type: "success", label: "Disponible" },
    "occupé": { type: "warning", label: "Occupé" },
    "en congé": { type: "default", label: "En congé" },
  };
  const d = map[statut] || { type: "default", label: statut };
  return <Badge type={d.type}>{d.label}</Badge>;
}

export function StarRating({ note, showNumber = false, size = 14 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: T.gold, fontSize: size, letterSpacing: 1 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ opacity: i <= Math.round(note) ? 1 : 0.2 }}>★</span>
        ))}
      </span>
      {showNumber && <span style={{ fontSize: size - 2, color: T.textMuted, fontWeight: 600 }}>{note}</span>}
    </span>
  );
}

export function Avatar({ nom, size = 40, bg = T.accent }) {
  const initials = nom ? nom.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
      fontWeight: 700, fontSize: size * 0.32, flexShrink: 0, fontFamily: "Georgia, serif" }}>
      {initials}
    </div>
  );
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{ background: T.surface, borderRadius: 16,
      border: `1px solid ${T.border}`, overflow: "hidden",
      cursor: onClick ? "pointer" : "default", ...style }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, style = {} }) {
  return (
    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center", ...style }}>
      <div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "Georgia, serif" }}>{title}</h3>
        {subtitle && <p style={{ margin: "3px 0 0", fontSize: 12, color: T.textMuted }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Btn({ children, variant = "primary", onClick, size = "md", style = {}, disabled = false }) {
  const variants = {
    primary: { bg: T.accent, color: "#fff", border: T.accent },
    secondary: { bg: "transparent", color: T.text, border: T.border },
    ghost: { bg: "transparent", color: T.textMuted, border: "transparent" },
    success: { bg: T.success, color: "#fff", border: T.success },
    danger: { bg: T.danger, color: "#fff", border: T.danger },
    teal: { bg: T.teal, color: "#fff", border: T.teal },
    outlineDanger: { bg: "transparent", color: T.danger, border: T.danger },
    outlineAccent: { bg: "transparent", color: T.accent, border: T.accent },
  };
  const v = variants[variant] || variants.primary;
  const pad = size === "sm" ? "6px 14px" : size === "lg" ? "12px 28px" : "8px 20px";
  const fs = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? T.border : v.bg, color: disabled ? T.textMuted : v.color,
      border: `1px solid ${disabled ? T.border : v.border}`, padding: pad, borderRadius: 10,
      fontSize: fs, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s",
      whiteSpace: "nowrap", ...style,
    }}>
      {children}
    </button>
  );
}

export function Input({ label, value, onChange, type = "text", placeholder = "", required = false, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted,
          textTransform: "uppercase", letterSpacing: 0.8 }}>
          {label}{required && <span style={{ color: T.accent }}> *</span>}
        </label>
      )}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 10,
        fontSize: 14, color: T.text, background: T.surface, outline: "none",
        transition: "border-color 0.15s", width: "100%", boxSizing: "border-box",
      }} />
    </div>
  );
}

export function Select({ label, value, onChange, options = [], style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted,
          textTransform: "uppercase", letterSpacing: 0.8 }}>
          {label}
        </label>
      )}
      <select value={value} onChange={onChange} style={{
        padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 10,
        fontSize: 14, color: T.text, background: T.surface, outline: "none",
        width: "100%", boxSizing: "border-box", cursor: "pointer",
      }}>
        {options.map(o => (
          <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
        ))}
      </select>
    </div>
  );
}

export function Textarea({ label, value, onChange, rows = 4, placeholder = "", style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 700, color: T.textMuted,
          textTransform: "uppercase", letterSpacing: 0.8 }}>
          {label}
        </label>
      )}
      <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} style={{
        padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 10,
        fontSize: 14, color: T.text, background: T.surface, outline: "none",
        resize: "vertical", width: "100%", boxSizing: "border-box", fontFamily: "inherit",
      }} />
    </div>
  );
}

export function StatCard({ label, value, trend, up, icon, color = T.accent }) {
  return (
    <div style={{ background: T.surface, borderRadius: 16, padding: "20px 24px",
      border: `1px solid ${T.border}`, flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ margin: 0, fontSize: 11, color: T.textMuted, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
        {icon && (
          <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "18",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {icon}
          </div>
        )}
      </div>
      <p style={{ margin: "10px 0 4px", fontSize: 30, fontWeight: 700, color: T.text,
        fontFamily: "Georgia, serif", lineHeight: 1 }}>{value}</p>
      {trend && (
        <span style={{ fontSize: 12, fontWeight: 600, color: up ? T.success : T.danger }}>
          {up ? "▲" : "▼"} {trend}
        </span>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
      <h4 style={{ margin: "0 0 8px", fontSize: 16, color: T.text }}>{title}</h4>
      <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>{desc}</p>
    </div>
  );
}

export function Modal({ title, open, onClose, children, width = 560 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: T.surface, borderRadius: 20, width: "100%", maxWidth: width,
        maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${T.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text, fontFamily: "Georgia, serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: T.textMuted, width: 32, height: 32, display: "flex",
            alignItems: "center", justifyContent: "center", borderRadius: 8,
            transition: "background 0.15s" }}>×</button>
        </div>
        <div style={{ padding: 28 }}>{children}</div>
      </div>
    </div>
  );
}

export function Table({ columns, data, emptyMsg = "Aucune donnée" }) {
  if (!data || data.length === 0) {
    return <EmptyState icon="📭" title={emptyMsg} desc="Aucun élément à afficher pour l'instant." />;
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: T.surfaceAlt }}>
            {columns.map((col, i) => (
              <th key={i} style={{ padding: "12px 20px", textAlign: col.align || "left",
                fontSize: 10, fontWeight: 700, color: T.textMuted,
                textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri} style={{ borderTop: `1px solid ${T.border}` }}>
              {columns.map((col, ci) => (
                <td key={ci} style={{ padding: "14px 20px", fontSize: 13, color: T.text,
                  textAlign: col.align || "left", whiteSpace: col.wrap ? "normal" : "nowrap" }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FilterBar({ filters, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {filters.map(f => (
        <button key={f.value || f} onClick={() => onChange(f.value || f)} style={{
          padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
          cursor: "pointer", border: "none", transition: "all 0.15s",
          background: value === (f.value || f) ? T.primary : T.surfaceAlt,
          color: value === (f.value || f) ? "#fff" : T.textMuted,
        }}>{f.label || f}</button>
      ))}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = "Rechercher..." }) {
  return (
    <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
        fontSize: 14, color: T.textMuted }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 14px 9px 36px", border: `1px solid ${T.border}`,
          borderRadius: 10, fontSize: 13, color: T.text, background: T.surface,
          outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text, fontFamily: "Georgia, serif" }}>{title}</h2>
        {subtitle && <p style={{ margin: "5px 0 0", color: T.textMuted, fontSize: 13 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <div onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 12,
        background: checked ? T.teal : T.border, position: "relative", transition: "background 0.2s",
        flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: checked ? 23 : 3, transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
      {label && <span style={{ fontSize: 13, color: T.text }}>{label}</span>}
    </label>
  );
}

export function useModal() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  return {
    open, data,
    show: (d) => { setData(d); setOpen(true); },
    hide: () => { setOpen(false); setData(null); },
  };
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          padding: "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          border: "none", background: "none", color: active === tab.id ? T.accent : T.textMuted,
          borderBottom: active === tab.id ? `2px solid ${T.accent}` : "2px solid transparent",
          marginBottom: -1, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
        }}>
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span style={{ background: active === tab.id ? T.accentLight : T.surfaceAlt,
              color: active === tab.id ? T.accent : T.textMuted,
              fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
