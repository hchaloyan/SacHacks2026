import React from "react";
import T from "../theme";
import Icons from "../Icons";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { id: "orders", label: "Orders", icon: Icons.orders },
  { id: "menu", label: "Menu Manager", icon: Icons.menu },
  { id: "hours", label: "Business Hours", icon: Icons.clock },
  { id: "financials", label: "Financials", icon: Icons.dollar },
];

export default function Sidebar({ active, setActive }) {
  return (
    <div style={{
      width: 240,
      minHeight: "100vh",
      background: T.card,
      borderRight: `1px solid ${T.border}`,
      padding: "24px 12px",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{ padding: "0 12px", marginBottom: 32 }}>
        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          fontFamily: T.font,
          color: T.accent,
          letterSpacing: "-0.03em",
        }}>boolen</h1>
        <p style={{
          fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 2,
          textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600,
        }}>Merchant</p>
      </div>

      <div style={{
        padding: "12px 14px",
        background: T.bg,
        borderRadius: 12,
        marginBottom: 24,
        marginLeft: 4,
        marginRight: 4,
      }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>My Restaurant</p>
        <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 2 }}>Store</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                fontFamily: T.fontText,
                color: isActive ? T.accent : "#6E6E73",
                background: isActive ? `${T.accent}10` : "transparent",
                transition: "all 0.15s ease",
                textAlign: "left",
              }}
            >
              <span style={{ color: isActive ? T.accent : "#AEAEB2", display: "flex" }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
