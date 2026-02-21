import React from "react";
import { motion } from "motion/react";
import T from "../../theme";

export default function CartPage({ cart, addToCart, removeFromCart, setCustomerTab, cartTotal }) {

  if (cart.length === 0) return (
    <div style={{ textAlign: "center", padding: 80, color: T.sub, fontFamily: T.fontText }}>
      <p style={{ fontSize: 48 }}>🛒</p>
      <p style={{ fontSize: 18, marginTop: 12 }}>Your cart is empty</p>
      <button onClick={() => setCustomerTab("browse")} style={{
        marginTop: 20, padding: "10px 24px", background: T.accent, color: "#fff",
        border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15, fontFamily: T.fontText
      }}>Browse Restaurants</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 32, fontFamily: T.fontText }}>
      <button onClick={() => setCustomerTab("browse")} style={{
        background: "none", border: "none", color: T.accent, fontSize: 15,
        fontWeight: 500, cursor: "pointer", fontFamily: T.fontText, padding: 0, marginBottom: 20,
      }}>← Back</button>
      
      <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 24 }}>Your Cart</h2>
      
      {cart.map(item => (
        <div key={item.id} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 0", borderBottom: `1px solid ${T.border}`
        }}>
          <div>
            <p style={{ fontWeight: 600, color: T.text, fontFamily: T.font }}>{item.name}</p>
            <p style={{ fontSize: 13, color: T.sub, marginTop: 2 }}>
              ${(item.price * item.qty).toFixed(2)}
            </p>
          </div>
          
          {/* Replaced '✕' with the Stepper */}
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: T.accent, borderRadius: 20, padding: "4px 6px",
            flexShrink: 0,
          }}>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => removeFromCart(item)}
              style={{
                width: 28, height: 28, borderRadius: 14, border: "none",
                background: "rgba(255,255,255,0.25)", color: "#FFF",
                fontSize: 18, lineHeight: 1, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontFamily: T.font, flexShrink: 0,
              }}
            >−</motion.button>
            <span style={{
              minWidth: 20, textAlign: "center",
              fontSize: 14, fontWeight: 700, color: "#FFF", fontFamily: T.font,
            }}>{item.qty}</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => addToCart(item)}
              style={{
                width: 28, height: 28, borderRadius: 14, border: "none",
                background: "rgba(255,255,255,0.25)", color: "#FFF",
                fontSize: 18, lineHeight: 1, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontFamily: T.font, flexShrink: 0,
              }}
            >+</motion.button>
          </div>
        </div>
      ))}
      
      <div style={{ marginTop: 24, textAlign: "right" }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Subtotal: ${cartTotal.toFixed(2)}</p>
        <button onClick={() => setCustomerTab("checkout")} style={{
          marginTop: 16, padding: "12px 32px", background: T.accent, color: "#fff",
          border: "none", borderRadius: 10, cursor: "pointer", fontSize: 16,
          fontWeight: 600, fontFamily: T.fontText
        }}>Proceed to Checkout</button>
      </div>
    </div>
  );
}