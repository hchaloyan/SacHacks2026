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

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: `1px solid ${T.border}`, fontSize: 15, fontFamily: T.fontText,
    outline: "none", boxSizing: "border-box", background: T.bg, color: T.text,
  };

  return (
    <div style={{ background: T.bg, minHeight: "calc(100vh - 52px)" }}>
      {/* Page header bar */}
      <div style={{
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`, padding: "0 40px",
        display: "flex", alignItems: "center", gap: 12, height: 60,
        position: "sticky", top: 52, zIndex: 100,
      }}>
        <button
          onClick={() => setCustomerTab("cart")}
          style={{
            background: "none", border: "none", color: T.accent, fontSize: 15,
            fontWeight: 600, cursor: "pointer", fontFamily: T.font, padding: 0,
          }}
        >← Cart</button>
        <span style={{ color: T.sub }}>›</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font }}>Checkout</span>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 40px" }}>
        <h1 style={{
          fontSize: 32, fontWeight: 800, color: T.text, fontFamily: T.font,
          letterSpacing: "-0.03em", marginBottom: 32,
        }}>Checkout</h1>

        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
          {/* Left column: form */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Contact info */}
            <div style={{
              background: T.card, borderRadius: 20, border: `1px solid ${T.border}`,
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 20 }}>
                Your Info
              </h2>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.sub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: T.fontText }}>
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Smith"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.sub, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: T.fontText }}>
                  Delivery Address
                </label>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="123 Main St, Davis, CA"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Delivery method */}
            <div style={{
              background: T.card, borderRadius: 20, border: `1px solid ${T.border}`,
              padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 20 }}>
                Delivery Method
              </h2>

              <div style={{ display: "flex", gap: 16 }}>
                {/* Bike */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeliveryType("bike")}
                  style={{
                    flex: 1, padding: "20px 16px", borderRadius: 16, cursor: "pointer",
                    textAlign: "left", border: `2px solid ${deliveryType === "bike" ? T.accent : T.border}`,
                    background: deliveryType === "bike" ? `${T.accent}08` : T.bg,
                    transition: "all 0.2s",
                  }}
                >
                  <p style={{ fontSize: 28, marginBottom: 8 }}>🚲</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>Bike Delivery</p>
                  <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>30–45 min</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: T.accent, fontFamily: T.font, marginTop: 10 }}>${bikeFee.toFixed(2)}</p>
                  <p style={{ fontSize: 11, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>🌱 Eco-friendly · Davis local</p>
                </motion.button>

                {/* Driver */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeliveryType("driver")}
                  style={{
                    flex: 1, padding: "20px 16px", borderRadius: 16, cursor: "pointer",
                    textAlign: "left", border: `2px solid ${deliveryType === "driver" ? T.accent : T.border}`,
                    background: deliveryType === "driver" ? `${T.accent}08` : T.bg,
                    transition: "all 0.2s",
                  }}
                >
                  <p style={{ fontSize: 28, marginBottom: 8 }}>🚗</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>Driver Delivery</p>
                  <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>15–25 min</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: T.accent, fontFamily: T.font, marginTop: 10 }}>${driverFee.toFixed(2)}</p>
                  <p style={{ fontSize: 11, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>⚡ Faster delivery</p>
                </motion.button>
              </div>

              {/* Savings callout */}
              <div style={{
                marginTop: 16, padding: "14px 16px", borderRadius: 12,
                background: `${T.accent}08`, border: `1px solid ${T.accent}25`,
              }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.accent, fontFamily: T.fontText }}>
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
          </div>

          {/* Right column: order summary */}
          <div style={{ width: 320, flexShrink: 0 }}>
            <div style={{
              background: T.card, borderRadius: 20, border: `1px solid ${T.border}`,
              overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              position: "sticky", top: 120,
            }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, background: T.bg }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>Order Summary</h3>
              </div>
              <div style={{ padding: "16px 20px" }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: T.text, fontFamily: T.fontText }}>
                      {item.name} <span style={{ color: T.sub }}>×{item.qty}</span>
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.fontText }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={{ height: 1, background: T.border, margin: "14px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Subtotal</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.fontText }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>
                    Delivery ({deliveryType === "bike" ? "🚲 Bike" : "🚗 Driver"})
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.fontText }}>${deliveryFee.toFixed(2)}</span>
                </div>
                <div style={{ height: 1, background: T.border, margin: "14px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: T.text, fontFamily: T.font }}>Total</span>
                  <span style={{ fontSize: 17, fontWeight: 800, color: T.accent, fontFamily: T.font }}>${total.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePlaceOrder}
                  style={{
                    width: "100%", padding: "15px", borderRadius: 12, border: "none",
                    background: T.accent, color: "#fff", cursor: "pointer",
                    fontSize: 16, fontWeight: 700, fontFamily: T.font,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <span>Place Order</span>
                  <span>${total.toFixed(2)}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
