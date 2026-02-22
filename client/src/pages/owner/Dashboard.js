import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import T from "../../theme";
import { api } from "../../api";

export default function Dashboard({ closingMode, setClosingMode }) {
  const [financials, setFinancials] = useState(null);
  const [menuCount, setMenuCount]   = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);

  useEffect(() => {
    api.getFinancials().then(setFinancials).catch(console.error);
    api.getMenu().then(cats => {
      setMenuCount(cats.reduce((n, c) => n + c.items.filter(i => i.available).length, 0));
    }).catch(console.error);
    api.getOrders().then(orders => {
      const today = new Date().toDateString();
      setTodayOrders(orders.filter(o => new Date(o.createdAt).toDateString() === today).length);
    }).catch(console.error);
  }, []);

  const stats = [
    { label: "Today's Orders",     value: String(todayOrders),                                    color: T.accent },
    { label: "Revenue",            value: `$${financials?.totalRevenue?.toFixed(2) || "0.00"}`,  color: T.green },
    { label: "Active Menu Items",  value: String(menuCount),                                       color: T.orange },
    { label: "Avg. Order Value",   value: `$${financials?.avgOrderValue?.toFixed(2) || "0.00"}`, color: "#AF52DE" },
  ];

  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28,
      }}>
        {stats.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ background: T.card, borderRadius: 16, padding: "20px 22px", border: `1px solid ${T.border}` }}
          >
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: T.font, letterSpacing: "-0.02em" }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Closing Mode Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{
          background: T.card, borderRadius: 16, padding: "22px 28px",
          border: `1.5px solid ${closingMode ? T.orange : T.border}`,
          marginBottom: 20,
          boxShadow: closingMode ? `0 0 0 3px ${T.orange}15` : "none",
          transition: "border-color 0.25s, box-shadow 0.25s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: closingMode ? `${T.orange}18` : T.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, transition: "background 0.25s",
            }}>
              🏷️
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 2 }}>
                Closing
              </p>
              <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText }}>
                {closingMode
                  ? "Active — customers are being offered a closing bundle deal"
                  : "Offer customers a random discounted bundle when ordering from Boolen Kitchen"}
              </p>
            </div>
          </div>

          {/* Toggle Slider */}
          <button
            onClick={() => setClosingMode(v => !v)}
            style={{
              width: 52, height: 30, borderRadius: 15, border: "none",
              background: closingMode ? T.orange : "#E5E5EA",
              cursor: "pointer", position: "relative",
              transition: "background 0.25s",
              flexShrink: 0,
            }}
          >
            <motion.div
              animate={{ left: closingMode ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                width: 26, height: 26, borderRadius: 13, background: "#FFF",
                position: "absolute", top: 2,
                boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
              }}
            />
          </button>
        </div>

        {closingMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: 16, padding: "10px 14px", borderRadius: 10,
              background: `${T.orange}10`, border: `1px solid ${T.orange}30`,
              fontSize: 13, color: T.orange, fontFamily: T.fontText, fontWeight: 500,
            }}
          >
            ✓ Closing mode is live — customers ordering from Boolen Kitchen will be offered a random bundle at <strong>35% off</strong>.
          </motion.div>
        )}
      </motion.div>

      <div style={{
        background: T.card, borderRadius: 16, padding: 28,
        border: `1px solid ${T.border}`, textAlign: "center",
      }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>📊</p>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 6 }}>
          Welcome to Boolen
        </h3>
        <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText, maxWidth: 400, margin: "0 auto" }}>
          Start by setting up your menu in the Menu Manager. Once you're live, orders and analytics will appear here.
        </p>
      </div>
    </div>
  );
}
