import React, { useState } from "react";
import { motion } from "motion/react";
import T from "../../theme";
import { api } from "../../api";

export default function CheckoutPage({ cart, cartTotal, setCustomerTab, clearCart }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("bike");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bikeFee = 1.99;
  const driverFee = 4.99;
  const bikeCommission = cartTotal * 0.05;
  const driverCommission = cartTotal * 0.12;

  const deliveryFee = deliveryType === "bike" ? bikeFee : driverFee;
  const total = cartTotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!name || !address) {
      setError("Please fill in your name and address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.createOrder({
        customerName: name,
        address,
        deliveryType,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          deliveryPrice: item.price,
        })),
        total,
        status: "pending",
      });
      clearCart();
      setCustomerTab("confirmation");
    } catch (err) {
      console.error("Failed to place order:", err);
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: 32, fontFamily: T.fontText }}>
      <button onClick={() => setCustomerTab("cart")} style={{
        background: "none", border: "none", color: T.accent, fontSize: 15,
        fontWeight: 500, cursor: "pointer", padding: 0, marginBottom: 20, fontFamily: T.fontText,
      }}>← Back to Cart</button>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 24 }}>Checkout</h2>

      {/* ─── Contact Info ─── */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: T.sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Your Info</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: T.sub, marginBottom: 6 }}>Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Smith"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: `1px solid ${T.border}`, fontSize: 15, fontFamily: T.fontText,
              outline: "none", boxSizing: "border-box", background: T.bg,
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: T.sub, marginBottom: 6 }}>Delivery Address</label>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="123 Main St, Davis, CA"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10,
              border: `1px solid ${T.border}`, fontSize: 15, fontFamily: T.fontText,
              outline: "none", boxSizing: "border-box", background: T.bg,
            }}
          />
        </div>
      </div>

      {/* ─── Delivery Type ─── */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: T.sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Delivery Method</h3>
        <div style={{ display: "flex", gap: 12 }}>

          {/* Bike Option */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setDeliveryType("bike")}
            style={{
              flex: 1, padding: 16, borderRadius: 16, cursor: "pointer", textAlign: "left",
              border: `2px solid ${deliveryType === "bike" ? T.accent : T.border}`,
              background: deliveryType === "bike" ? `${T.accent}10` : T.card,
              fontFamily: T.fontText,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>🚲</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Bike Delivery</div>
            <div style={{ fontSize: 13, color: T.sub, marginTop: 2 }}>${bikeFee.toFixed(2)} fee</div>
            <div style={{ fontSize: 11, color: T.accent, marginTop: 6, fontWeight: 500 }}>
              Only 5% commission (${bikeCommission.toFixed(2)}) vs DoorDash's ~25% (${(cartTotal * 0.25).toFixed(2)})
            </div>
          </motion.button>

          {/* Driver Option */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setDeliveryType("driver")}
            style={{
              flex: 1, padding: 16, borderRadius: 16, cursor: "pointer", textAlign: "left",
              border: `2px solid ${deliveryType === "driver" ? T.accent : T.border}`,
              background: deliveryType === "driver" ? `${T.accent}10` : T.card,
              fontFamily: T.fontText,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>🚗</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Driver Delivery</div>
            <div style={{ fontSize: 13, color: T.sub, marginTop: 2 }}>${driverFee.toFixed(2)} fee</div>
            <div style={{ fontSize: 11, color: T.accent, marginTop: 6, fontWeight: 500 }}>
              Only 12% commission (${driverCommission.toFixed(2)}) vs DoorDash's ~25% (${(cartTotal * 0.25).toFixed(2)})
            </div>
          </motion.button>
        </div>
      </div>

      {/* ─── Order Summary ─── */}
      <div style={{
        padding: 20, background: T.card, borderRadius: 16,
        border: `1px solid ${T.border}`, marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: T.sub, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Order Summary</h3>
        {cart.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: T.text, fontFamily: T.fontText }}>{item.name} x{item.qty}</span>
            <span style={{ fontSize: 14, color: T.text, fontFamily: T.fontText }}>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 12, paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Subtotal</span>
            <span style={{ fontSize: 14, color: T.text, fontFamily: T.fontText }}>${cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Delivery fee ({deliveryType === "bike" ? "🚲 Bike" : "🚗 Driver"})</span>
            <span style={{ fontSize: 14, color: T.text, fontFamily: T.fontText }}>${deliveryFee.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.accent, fontFamily: T.font }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ─── Error ─── */}
      {error && (
        <div style={{
          background: "#FFF2F2", border: `1px solid ${T.red}30`, borderRadius: 10,
          padding: "10px 14px", marginBottom: 16, color: T.red, fontSize: 13, fontWeight: 500,
        }}>{error}</div>
      )}

      {/* ─── Place Order Button ─── */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handlePlaceOrder}
        disabled={loading}
        style={{
          width: "100%", padding: "16px 24px", borderRadius: 16, border: "none",
          background: T.accent, color: "#FFF", fontSize: 16, fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer", fontFamily: T.font,
          opacity: loading ? 0.7 : 1, transition: "opacity 0.15s",
        }}
      >
        {loading ? "Placing Order…" : `Place Order · $${total.toFixed(2)}`}
      </motion.button>
    </div>
  );
}