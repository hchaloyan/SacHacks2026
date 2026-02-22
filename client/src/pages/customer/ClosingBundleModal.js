// ─── CLOSING BUNDLE MODAL ───────────────────────────────────────────────────
// Drop this component into CustomerView.js and render it inside the menu view
// when closingMode is true and the selected restaurant is Boolen Kitchen.
//
// Props:
//   bundle     - array of { id, name, img, price } items (randomly selected)
//   onAccept   - called with (bundle) to add all items to cart at discount
//   onDecline  - closes the modal

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import T from "../../theme";

const DISCOUNT = 0.35; // 35% off

export default function ClosingBundleModal({ bundle, onAccept, onDecline }) {
  const originalTotal = bundle.reduce((s, i) => s + i.price, 0);
  const discountedTotal = originalTotal * (1 - DISCOUNT);
  const savings = originalTotal - discountedTotal;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDecline}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "min(500px, 92vw)",
          background: T.card,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${T.orange}, #FF6B00)`,
          padding: "28px 28px 22px",
          textAlign: "center",
          position: "relative",
        }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🏷️</div>
          <h2 style={{
            fontSize: 22, fontWeight: 800, color: "#FFF",
            fontFamily: T.font, letterSpacing: "-0.02em", margin: 0, marginBottom: 6,
          }}>
            Closing Time Bundle!
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", fontFamily: T.fontText, margin: 0 }}>
            We're closing soon — grab this random bundle at <strong>35% off</strong>
          </p>

          {/* Savings badge */}
          <div style={{
            display: "inline-block", marginTop: 12,
            background: "rgba(255,255,255,0.22)", borderRadius: 20,
            padding: "5px 14px", fontSize: 13, fontWeight: 700,
            color: "#FFF", fontFamily: T.fontText,
          }}>
            Save ${savings.toFixed(2)} on this order!
          </div>
        </div>

        {/* Bundle items */}
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.sub, fontFamily: T.fontText, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>
            What's in the bundle
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {bundle.map(item => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 14px", borderRadius: 12,
                background: T.bg, border: `1px solid ${T.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{item.img}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.font, margin: 0 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, margin: 0, marginTop: 2 }}>{item.desc}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, margin: 0, textDecoration: "line-through" }}>
                    ${item.price.toFixed(2)}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: T.orange, fontFamily: T.font, margin: 0 }}>
                    ${(item.price * (1 - DISCOUNT)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total row */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 16px", borderRadius: 12,
            background: `${T.orange}0E`, border: `1px solid ${T.orange}30`,
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.font }}>Bundle Total</span>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, textDecoration: "line-through", marginRight: 10 }}>
                ${originalTotal.toFixed(2)}
              </span>
              <span style={{ fontSize: 18, fontWeight: 800, color: T.orange, fontFamily: T.font }}>
                ${discountedTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onDecline}
              style={{
                flex: 1, padding: "13px", borderRadius: 12,
                border: `1px solid ${T.border}`, background: T.bg,
                color: T.sub, fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: T.fontText,
              }}
            >
              No thanks
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAccept(bundle)}
              style={{
                flex: 2, padding: "13px", borderRadius: 12,
                border: "none", background: T.orange,
                color: "#FFF", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: T.font,
              }}
            >
              Add Bundle to Cart 🛒
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
