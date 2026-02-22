import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import T from "../../theme";
import { api } from "../../api";

export default function Dashboard() {
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