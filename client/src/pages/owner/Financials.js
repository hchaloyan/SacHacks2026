import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import T from "../../theme";
import { api } from "../../api";

export default function Financials() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getFinancials()
      .then(d => setData(d))
      .catch(err => console.error("Failed to load financials:", err));
  }, []);

  if (!data) {
    return <div style={{ color: T.sub, fontFamily: T.fontText, padding: 20 }}>Loading financials…</div>;
  }

  const stats = [
    { label: "Total Revenue",     value: `$${data.totalRevenue?.toFixed(2) || "0.00"}`, color: T.green },
    { label: "Total Orders",      value: String(data.totalOrders || 0),                  color: T.accent },
    { label: "Avg. Order Value",  value: `$${data.avgOrderValue?.toFixed(2) || "0.00"}`, color: "#AF52DE" },
  ];

  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28,
      }}>
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            style={{ background: T.card, borderRadius: 16, padding: "20px 22px", border: `1px solid ${T.border}` }}
          >
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: T.font, letterSpacing: "-0.02em" }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {data.totalOrders === 0 && (
        <div style={{
          background: T.card, borderRadius: 16, padding: 40,
          border: `1px solid ${T.border}`, textAlign: "center",
        }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>💰</p>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 6 }}>
            No revenue yet
          </h3>
          <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>
            Revenue reports will appear here once orders start coming in.
          </p>
        </div>
      )}
    </div>
  );
}


