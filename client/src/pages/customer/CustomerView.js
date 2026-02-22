import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import T from "../../theme";
import Icons from "../../Icons";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";

const sampleRestaurants = [
  { id: 1, name: "Boolen Kitchen", cuisine: "American", rating: 4.8, time: "20-30 min", img: "🍽️" },
  { id: 2, name: "Pizza Express", cuisine: "Italian", rating: 4.6, time: "25-35 min", img: "🍕" },
  { id: 3, name: "Sushi Bay", cuisine: "Japanese", rating: 4.9, time: "15-25 min", img: "🍣" },
];

const sampleMenu = [
  { id: 1, name: "Classic Burger", desc: "Angus beef, lettuce, tomato, special sauce", price: 12.99, img: "🍔", cat: "Entrees" },
  { id: 2, name: "Caesar Salad", desc: "Romaine, croutons, parmesan, caesar dressing", price: 9.99, img: "🥗", cat: "Appetizers" },
  { id: 3, name: "Margherita Pizza", desc: "Fresh mozzarella, basil, tomato sauce", price: 14.99, img: "🍕", cat: "Entrees" },
  { id: 4, name: "Iced Lemonade", desc: "Fresh-squeezed with mint", price: 4.99, img: "🍋", cat: "Beverages" },
  { id: 5, name: "Chocolate Cake", desc: "Rich dark chocolate with ganache", price: 7.99, img: "🍫", cat: "Desserts" },
  { id: 6, name: "Garlic Fries", desc: "Crispy fries tossed with roasted garlic", price: 5.99, img: "🍟", cat: "Appetizers" },
];

export default function CustomerView({ cart, addToCart, removeFromCart, clearCart, customerTab, setCustomerTab }) {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  // ─── Cart Page ───
  if (customerTab === "cart") {
    return (
      <CartPage
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        setCustomerTab={setCustomerTab}
        cartTotal={cartTotal}
        cartCount={cartCount}
      />
    );
  }

  // ─── Checkout Page ───
  if (customerTab === "checkout") {
    return (
      <CheckoutPage
        cart={cart}
        cartTotal={cartTotal}
        setCustomerTab={setCustomerTab}
        clearCart={clearCart}
      />
    );
  }

  // ─── Order Confirmation ───
  if (customerTab === "confirmation") {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 32, fontFamily: T.fontText,
      }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: T.text, fontFamily: T.font, marginBottom: 8 }}>
            Order Placed!
          </h2>
          <p style={{ fontSize: 15, color: T.sub, marginBottom: 32, lineHeight: 1.6 }}>
            Your order has been sent to the restaurant. You can track its status in the app.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setView("list"); setCustomerTab("browse"); }}
            style={{
              padding: "14px 32px", borderRadius: 14, border: "none",
              background: T.accent, color: "#FFF", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: T.font,
            }}
          >
            Back to Restaurants
          </motion.button>
        </div>
      </div>
    );
  }

  // ─── Restaurant List ───
  if (view === "list") {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        maxWidth: 540, margin: "0 auto", padding: "48px 20px",
      }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: T.accent, fontFamily: T.font, letterSpacing: "-0.03em" }}>boolen</h1>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, fontFamily: T.font, marginTop: 12, letterSpacing: "-0.02em" }}>Restaurants near you</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sampleRestaurants.map(r => (
            <motion.button
              key={r.id}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => { setSelected(r); setView("menu"); }}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 20px", background: T.card, borderRadius: 16,
                border: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left",
                fontFamily: T.fontText,
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 12, background: T.bg,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0,
              }}>{r.img}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: T.text, fontFamily: T.font }}>{r.name}</p>
                <p style={{ fontSize: 13, color: T.sub, marginTop: 2 }}>{r.cuisine}</p>
                <p style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>⭐ {r.rating} · {r.time}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Menu ───
  if (view === "menu" && selected) {
    const cats = [...new Set(sampleMenu.map(m => m.cat))];
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        maxWidth: 540, margin: "0 auto",
        padding: cartCount > 0 ? "32px 20px 100px" : "32px 20px",
      }}>
        <button onClick={() => setView("list")} style={{
          background: "none", border: "none", color: T.accent, fontSize: 15,
          fontWeight: 500, cursor: "pointer", fontFamily: T.fontText, padding: 0, marginBottom: 16,
        }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: T.bg,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          }}>{selected.img}</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text, fontFamily: T.font }}>{selected.name}</h1>
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText }}>⭐ {selected.rating} · {selected.time}</p>
          </div>
        </div>

        {cats.map(cat => (
          <div key={cat} style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 13, fontWeight: 600, color: T.sub, textTransform: "uppercase",
              letterSpacing: "0.05em", fontFamily: T.fontText, marginBottom: 10,
            }}>{cat}</h3>
            {sampleMenu.filter(m => m.cat === cat).map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <div key={item.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 16px", background: T.card, borderRadius: 14,
                  marginBottom: 8, border: `1px solid ${T.border}`,
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                    <span style={{ fontSize: 28 }}>{item.img}</span>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: T.text, fontFamily: T.font }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 2 }}>{item.desc}</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.font, marginTop: 4 }}>${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    {inCart ? (
                      <motion.div
                        key="stepper"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          background: T.accent, borderRadius: 20, padding: "4px 6px",
                          flexShrink: 0,
                        }}
                      >
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
                        }}>{inCart.qty}</span>
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
                      </motion.div>
                    ) : (
                      <motion.button
                        key="add"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(item)}
                        style={{
                          width: 36, height: 36, borderRadius: 18, border: "none",
                          background: T.bg, color: T.accent,
                          fontSize: 16, cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "center", flexShrink: 0,
                          fontWeight: 600, fontFamily: T.font,
                        }}
                      >+</motion.button>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ))}

        {cartCount > 0 && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              padding: "12px 20px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              borderTop: `1px solid ${T.border}`,
            }}
          >
            <button
              onClick={() => setCustomerTab("cart")}
              style={{
                width: "100%", maxWidth: 500, margin: "0 auto",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 24px", borderRadius: 16, border: "none",
                background: T.accent, color: "#FFF", cursor: "pointer", fontFamily: T.font,
              }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>View Cart ({cartCount})</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>${cartTotal.toFixed(2)}</span>
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return null;
}