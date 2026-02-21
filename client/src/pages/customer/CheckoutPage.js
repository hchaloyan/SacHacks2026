import React, { useState } from "react";
import { motion } from "motion/react";
import T from "../../theme";

export default function CheckoutPage({ cart, cartTotal, setCustomerTab }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("bike");

  const bikeFee = 1.99;
  const driverFee = 4.99;
  const bikeCommission = cartTotal * 0.05;
  const driverCommission = cartTotal * 0.12;

  const deliveryFee = deliveryType === "bike" ? bikeFee : driverFee;
  const total = cartTotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!name || !address) {
      alert("Please fill in your name and address.");
      return;
    }
    setCustomerTab("confirmation");
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
              transition: "all 0.2s",
            }}
          >
            <p style={{ fontSize: 24, marginBottom: 6 }}>🚲</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: T.font }}>Bike Delivery</p>
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>30–45 min</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: T.accent, fontFamily: T.font, marginTop: 8 }}>${bikeFee.toFixed(2)} fee</p>
            <p style={{ fontSize: 11, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>🌱 Eco-friendly · Davis local</p>
          </motion.button>

          {/* Driver Option */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setDeliveryType("driver")}
            style={{
              flex: 1, padding: 16, borderRadius: 16, cursor: "pointer", textAlign: "left",
              border: `2px solid ${deliveryType === "driver" ? T.accent : T.border}`,
              background: deliveryType === "driver" ? `${T.accent}10` : T.card,
              transition: "all 0.2s",
            }}
          >
            <p style={{ fontSize: 24, marginBottom: 6 }}>🚗</p>
            <p style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: T.font }}>Driver Delivery</p>
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>15–25 min</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: T.accent, fontFamily: T.font, marginTop: 8 }}>${driverFee.toFixed(2)} fee</p>
            <p style={{ fontSize: 11, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>⚡ Faster delivery</p>
          </motion.button>

        </div>

        {/* ─── Savings Callout ─── */}
        <div style={{
          marginTop: 12, padding: "12px 16px", borderRadius: 12,
          background: `${T.accent}10`, border: `1px solid ${T.accent}30`,
        }}>
          <p style={{ fontSize: 13, color: T.accent, fontFamily: T.fontText, fontWeight: 600 }}>
            💰 Restaurant savings vs DoorDash
          </p>
          <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>
            {deliveryType === "bike"
              ? `Bike delivery charges the restaurant only 5% ($${bikeCommission.toFixed(2)}) vs DoorDash's ~25% ($${(cartTotal * 0.25).toFixed(2)})`
              : `Driver delivery charges the restaurant only 12% ($${driverCommission.toFixed(2)}) vs DoorDash's ~25% ($${(cartTotal * 0.25).toFixed(2)})`
            }
          </p>
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

      {/* ─── Place Order Button ─── */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handlePlaceOrder}
        style={{
          width: "100%", padding: "16px 24px", borderRadius: 16, border: "none",
          background: T.accent, color: "#FFF", fontSize: 16, fontWeight: 700,
          cursor: "pointer", fontFamily: T.font,
        }}
      >
        Place Order · ${total.toFixed(2)}
      </motion.button>
    </div>
  );
}