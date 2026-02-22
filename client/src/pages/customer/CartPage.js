import React from "react";
import { motion } from "motion/react";
import T from "../../theme";

export default function CartPage({ cart, addToCart, removeFromCart, setCustomerTab, cartTotal }) {
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
          onClick={() => setCustomerTab("browse")}
          style={{
            background: "none", border: "none", color: T.accent, fontSize: 15,
            fontWeight: 600, cursor: "pointer", fontFamily: T.font,
            display: "flex", alignItems: "center", gap: 6, padding: 0,
          }}
        >
          ← Restaurants
        </button>
        <span style={{ color: T.sub }}>›</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font }}>Cart</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 40px" }}>
        <h1 style={{
          fontSize: 32, fontWeight: 800, color: T.text, fontFamily: T.font,
          letterSpacing: "-0.03em", marginBottom: 32,
        }}>Your Cart</h1>

        {cart.length === 0 ? (
          <div style={{
            background: T.card, borderRadius: 20, border: `1px solid ${T.border}`,
            padding: "80px 40px", textAlign: "center",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 8 }}>
              Your cart is empty
            </h2>
            <p style={{ fontSize: 15, color: T.sub, fontFamily: T.fontText, marginBottom: 24 }}>
              Browse restaurants and add items to get started
            </p>
            <button
              onClick={() => setCustomerTab("browse")}
              style={{
                padding: "12px 28px", background: T.accent, color: "#fff",
                border: "none", borderRadius: 12, cursor: "pointer",
                fontSize: 15, fontWeight: 600, fontFamily: T.fontText,
              }}
            >Browse Restaurants</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            {/* Items list */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: T.card, borderRadius: 20, border: `1px solid ${T.border}`,
                overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>
                {cart.map((item, i) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "20px 24px",
                      borderBottom: i < cart.length - 1 ? `1px solid ${T.border}` : "none",
                    }}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: T.bg, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 28, flexShrink: 0,
                    }}>
                      {item.img}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 16, fontWeight: 600, color: T.text, fontFamily: T.font }}>
                        {item.name}
                      </p>
                      <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginTop: 2 }}>
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Stepper */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: T.accent, borderRadius: 24, padding: "5px 8px",
                    }}>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => removeFromCart(item)}
                        style={{
                          width: 28, height: 28, borderRadius: 14, border: "none",
                          background: "rgba(255,255,255,0.25)", color: "#fff",
                          fontSize: 18, cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontFamily: T.font,
                        }}
                      >−</motion.button>
                      <span style={{
                        fontSize: 15, fontWeight: 700, color: "#fff",
                        minWidth: 20, textAlign: "center", fontFamily: T.font,
                      }}>{item.qty}</span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => addToCart(item)}
                        style={{
                          width: 28, height: 28, borderRadius: 14, border: "none",
                          background: "rgba(255,255,255,0.25)", color: "#fff",
                          fontSize: 18, cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontFamily: T.font,
                        }}
                      >+</motion.button>
                    </div>

                    <div style={{ textAlign: "right", minWidth: 64 }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div style={{ width: 300, flexShrink: 0 }}>
              <div style={{
                background: T.card, borderRadius: 20, border: `1px solid ${T.border}`,
                overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, background: T.bg }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>Order Summary</h3>
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Subtotal</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.fontText }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Delivery</span>
                    <span style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Calculated at checkout</span>
                  </div>
                  <div style={{ height: 1, background: T.border, margin: "16px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>Estimated Total</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>${cartTotal.toFixed(2)}+</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCustomerTab("checkout")}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 12, border: "none",
                      background: T.accent, color: "#fff", cursor: "pointer",
                      fontSize: 15, fontWeight: 700, fontFamily: T.font,
                    }}
                  >Proceed to Checkout</motion.button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
