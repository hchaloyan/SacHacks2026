import React, { useState, useEffect } from "react";
import T from "../../theme";
import { api } from "../../api";

const STATUS_COLORS = {
  pending:    { bg: "#FFF3CD", color: "#856404" },
  preparing:  { bg: "#D1ECF1", color: "#0C5460" },
  ready:      { bg: "#D4EDDA", color: "#155724" },
  completed:  { bg: "#E2E3E5", color: "#383D41" },
  cancelled:  { bg: "#F8D7DA", color: "#721C24" },
};

const STATUS_FLOW = ["pending", "preparing", "ready", "completed"];

export default function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    api.getOrders()
      .then(data => setOrders(data))
      .catch(err => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const advanceStatus = async (order) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return;
    const nextStatus = STATUS_FLOW[idx + 1];
    try {
      const updated = await api.updateOrder(order.id, { status: nextStatus });
      setOrders(prev => prev.map(o => o.id === order.id ? updated : o));
    } catch (err) {
      console.error("Failed to update order:", err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const updated = await api.updateOrder(orderId, { status: "cancelled" });
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const filtered = filter === "all"
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) {
    return <div style={{ color: T.sub, fontFamily: T.fontText, padding: 20 }}>Loading orders…</div>;
  }

  if (orders.length === 0) {
    return (
      <div style={{
        background: T.card, borderRadius: 16, padding: 40,
        border: `1px solid ${T.border}`, textAlign: "center",
      }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>📋</p>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 6 }}>
          No orders yet
        </h3>
        <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>
          Incoming orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", ...STATUS_FLOW, "cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              background: filter === s ? T.accent : T.card,
              color: filter === s ? "#FFF" : T.sub,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText,
              border: `1px solid ${filter === s ? "transparent" : T.border}`,
              textTransform: "capitalize",
            }}
          >{s === "all" ? `All (${orders.length})` : s}</button>
        ))}
      </div>

      {/* Orders list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(order => {
          const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];
          return (
            <div key={order.id} style={{
              background: T.card, borderRadius: 16, padding: 20,
              border: `1px solid ${T.border}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>
                    Order #{String(order.id).slice(-5)}
                  </span>
                  <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 2 }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  fontFamily: T.fontText, background: sc.bg, color: sc.color,
                  textTransform: "capitalize",
                }}>{order.status}</span>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 12 }}>
                {(order.items || []).map((item, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 14, color: T.text, fontFamily: T.fontText, padding: "3px 0",
                  }}>
                    <span>{item.qty}× {item.name}</span>
                    <span>${((item.deliveryPrice || 0) * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderTop: `1px solid ${T.border}`, paddingTop: 12,
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>
                  Total: ${(order.total || 0).toFixed(2)}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <>
                      <button onClick={() => cancelOrder(order.id)}
                        style={{
                          padding: "7px 14px", borderRadius: 9, border: "none",
                          background: `${T.red}12`, color: T.red,
                          fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText,
                        }}
                      >Cancel</button>
                      {nextStatus && (
                        <button onClick={() => advanceStatus(order)}
                          style={{
                            padding: "7px 14px", borderRadius: 9, border: "none",
                            background: T.accent, color: "#FFF",
                            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText,
                            textTransform: "capitalize",
                          }}
                        >Mark as {nextStatus}</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
