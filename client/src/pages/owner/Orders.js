import React, { useState, useEffect, useRef } from "react";
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
  const prevOrderIds = useRef(new Set());
  const [newOrderIds, setNewOrderIds] = useState(new Set());

const fetchOrders = async (isInitial = false) => {
  try {
    const data = await api.getOrders();
    const boolenOrders = data.filter(o => o.restaurantId === 1 || o.restaurantId == null);

    if (!isInitial) {
      const incoming = boolenOrders.filter(o => !prevOrderIds.current.has(o.id));
      if (incoming.length > 0) {
        setNewOrderIds(prev => new Set([...prev, ...incoming.map(o => o.id)]));
        setTimeout(() => {
          setNewOrderIds(prev => {
            const next = new Set(prev);
            incoming.forEach(o => next.delete(o.id));
            return next;
          });
        }, 8000);
      }
    }
    prevOrderIds.current = new Set(boolenOrders.map(o => o.id));
    setOrders(boolenOrders);
  } catch (err) {
    console.error("Failed to load orders:", err);
  } finally {
    if (isInitial) setLoading(false);
  }
};

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 15000);
    return () => clearInterval(interval);
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
      {/* Header row with filter tabs and live indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
        {/* Live polling indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: "#22C55E",
            boxShadow: "0 0 0 2px #22C55E40",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText }}>Live</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Orders list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(order => {
          const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];
          const isNew = newOrderIds.has(order.id);
          return (
            <div key={order.id} style={{
              background: T.card, borderRadius: 16, padding: 20,
              border: `2px solid ${isNew ? T.accent : T.border}`,
              animation: isNew ? "slideIn 0.3s ease" : "none",
              transition: "border-color 0.5s",
            }}>
              {isNew && (
                <div style={{
                  background: T.accent, color: "#FFF", fontSize: 11, fontWeight: 700,
                  fontFamily: T.fontText, padding: "3px 10px", borderRadius: 20,
                  display: "inline-block", marginBottom: 10, letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>🔔 New Order</div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>
                    Order #{order.orderNumber || order.id}
                  </span>
                  {order.customerName && (
                    <p style={{ fontSize: 13, color: T.text, fontFamily: T.fontText, marginTop: 2, fontWeight: 500 }}>
                      👤 {order.customerName}
                    </p>
                  )}
                  {order.address && (
                    <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 1 }}>
                      📍 {order.address}
                    </p>
                  )}
                  {order.deliveryType && (
                    <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 1 }}>
                      {order.deliveryType === "bike" ? "🚲 Bike Delivery" : "🚗 Driver Delivery"}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>
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