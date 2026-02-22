import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import T from "../../theme";
import Icons from "../../Icons";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";
// FIX #3: Import the standalone ClosingBundleModal instead of using a local duplicate
import ClosingBundleModal from "./ClosingBundleModal";

const imageContext = require.context('./images', false, /\.(png|jpe?g|svg|webp|avif)$/);

const getImg = (name) => {
  try {
    return imageContext(`./${name}`);
  } catch (err) {
    return name;
  }
};

const sampleRestaurants = [
  { id: 1, name: "Boolen Kitchen", cuisine: "American", rating: 4.8, img: getImg("boolenstore.jpg"), priceRange: "$$", tags: ["0.5 miles", "CAR 8 min", "BIKE 8 min"] },
  { id: 2, name: "Woodstock's Pizza", cuisine: "Italian", rating: 4.6, img: getImg("woodstocks-pizza.jpg"), priceRange: "$$", tags: ["0.6 miles", "CAR 8 min", "BIKE 10 min"] },
  { id: 3, name: "Hikari", cuisine: "Japanese", rating: 4.9, img: getImg("hikari.png"), priceRange: "$$", tags: ["0.4 miles", "CAR 8 min", "BIKE 8 min"] },
  { id: 4, name: "Guads Tacos", cuisine: "Mexican", rating: 4.5, img: getImg("GuadsLogo.jpg"), priceRange: "$$", tags: ["0.4 miles", "CAR 7 min", "BIKE 6 min"] },
];

const sampleMenu = [
  { id: 1, name: "Classic Burger", desc: "Angus beef, lettuce, tomato, special sauce", price: 12.99, img: "🍔", cat: "Entrees" },
  { id: 2, name: "Caesar Salad", desc: "Romaine, croutons, parmesan, caesar dressing", price: 9.99, img: "🥗", cat: "Appetizers" },
  { id: 3, name: "Margherita Pizza", desc: "Fresh mozzarella, basil, tomato sauce", price: 14.99, img: "🍕", cat: "Entrees" },
  { id: 4, name: "Iced Lemonade", desc: "Fresh-squeezed with mint", price: 4.99, img: "🍋", cat: "Beverages" },
  { id: 5, name: "Chocolate Cake", desc: "Rich dark chocolate with ganache", price: 7.99, img: "🍫", cat: "Desserts" },
  { id: 6, name: "Garlic Fries", desc: "Crispy fries tossed with roasted garlic", price: 5.99, img: "🍟", cat: "Appetizers" },
];

const categories = ["All", "American", "Italian", "Japanese", "Mexican", "BBQ", "Healthy"];

// ─── Helpers ────────────────────────────────────────────────────────────────

function ImgOrEmoji({ src, size = 48, style = {}, alt = "" }) {
  const isPath = typeof src === "string" && (
    src.startsWith("/") || src.startsWith("./") || src.startsWith("../") ||
    src.startsWith("http") ||
    /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(src)
  );
  if (isPath) {
    return <img src={src} alt={alt} style={{ width: size, height: size, objectFit: "cover", borderRadius: 8, ...style }} />;
  }
  return <span style={{ fontSize: size, lineHeight: 1, ...style }}>{src}</span>;
}

// ─── Top Navbar ─────────────────────────────────────────────────────────────

function CustomerNav({ cartCount, cartTotal, setCustomerTab }) {
  return (
    <div style={{
      position: "sticky", top: 52, zIndex: 100,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${T.border}`,
      padding: "0 40px",
      display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, height: 60,
    }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setCustomerTab("cart")}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 20px", borderRadius: 12, border: "none",
          background: cartCount > 0 ? T.accent : T.bg,
          color: cartCount > 0 ? "#fff" : T.sub,
          cursor: "pointer", fontFamily: T.font, fontWeight: 600, fontSize: 14,
          transition: "all 0.2s",
        }}
      >
        <span>🛒</span>
        {cartCount > 0 ? (
          <>
            <span>{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
            <span style={{
              background: "rgba(255,255,255,0.25)", borderRadius: 8,
              padding: "2px 8px", fontSize: 13,
            }}>${cartTotal.toFixed(2)}</span>
          </>
        ) : (
          <span>Cart</span>
        )}
      </motion.button>
    </div>
  );
}

// ─── Restaurant Card ─────────────────────────────────────────────────────────

function RestaurantCard({ restaurant, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
      onClick={onClick}
      style={{
        background: T.card, borderRadius: 20,
        border: `1px solid ${T.border}`,
        overflow: "hidden", cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{
        height: 160, background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative",
      }}>
        {(typeof restaurant.img === "object" || (
          typeof restaurant.img === "string" &&
          /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(restaurant.img)
        )) ? (
          <img
            src={restaurant.img}
            alt={restaurant.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", top: 0, left: 0 }}
          />
        ) : (
          <span style={{ fontSize: 60 }}>{restaurant.img}</span>
        )}
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 4 }}>
            {restaurant.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
            <span style={{ fontSize: 13 }}>⭐</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: T.fontText }}>
              {restaurant.rating}
            </span>
          </div>
        </div>
        <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText }}>
          {restaurant.cuisine} · {restaurant.priceRange}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>

          {restaurant.tags.slice(0, 2).map(tag => (
            <div key={tag} style={{
              padding: "4px 10px", borderRadius: 20,
              background: `${T.accent}10`, fontSize: 12,
              color: T.accent, fontFamily: T.fontText, fontWeight: 500,
            }}>{tag}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Cart Sidebar ────────────────────────────────────────────────────────────

function CartSidebar({ cart, addToCart, removeFromCart, cartTotal, cartCount, setCustomerTab }) {
  return (
    <div style={{
      width: 320, flexShrink: 0,
      position: "sticky", top: 116,
      height: "calc(100vh - 116px)",
      overflowY: "auto",
      padding: "24px 0",
    }}>
      <div style={{
        background: T.card, borderRadius: 16,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${T.border}`,
          background: T.bg,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>
            Your Order
          </h3>
        </div>

        {cart.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🛒</div>
            <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Your cart is empty</p>
            <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>Add items to get started</p>
          </div>
        ) : (
          <>
            <div style={{ padding: "12px 20px" }}>
              {cart.map(item => (
                <div key={item.id} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "10px 0",
                  borderBottom: `1px solid ${T.border}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.font }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 2 }}>
                      {/* FIX #1: Use item.price (already discounted for bundle items) for display */}
                      ${(item.price * item.qty).toFixed(2)}
                      {item.bundleDiscount && (
                        <span style={{ color: T.orange, marginLeft: 6, fontWeight: 600 }}>
                          (Bundle Deal)
                        </span>
                      )}
                    </p>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    background: T.accent, borderRadius: 20, padding: "3px 6px",
                  }}>
                    <button
                      onClick={() => removeFromCart(item)}
                      style={{
                        width: 24, height: 24, borderRadius: 12, border: "none",
                        background: "rgba(255,255,255,0.25)", color: "#fff",
                        fontSize: 16, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", fontWeight: 700,
                        fontFamily: T.font,
                      }}
                    >−</button>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", minWidth: 16, textAlign: "center", fontFamily: T.font }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        width: 24, height: 24, borderRadius: 12, border: "none",
                        background: "rgba(255,255,255,0.25)", color: "#fff",
                        fontSize: 16, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", fontWeight: 700,
                        fontFamily: T.font,
                      }}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText }}>Subtotal</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.fontText }}>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText }}>Delivery fee</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.fontText }}>from $1.99</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCustomerTab("cart")}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: T.accent, color: "#fff", cursor: "pointer",
                  fontSize: 15, fontWeight: 700, fontFamily: T.font,
                  display: "flex", justifyContent: "space-between",
                }}
              >
                <span>View Cart</span>
                <span>${cartTotal.toFixed(2)}</span>
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main CustomerView ───────────────────────────────────────────────────────

export default function CustomerView({ cart, addToCart, removeFromCart, clearCart, customerTab, setCustomerTab, closingMode }) {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showBundle, setShowBundle] = useState(false);
  const [bundle, setBundle] = useState([]);
  // FIX #2: Track whether the bundle has already been shown for the current restaurant visit
  const [bundleSeen, setBundleSeen] = useState(false);

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  // FIX #2: Only show the bundle once per visit. Reset bundleSeen when leaving Boolen Kitchen.
  useEffect(() => {
    if (closingMode && selected?.name === "Boolen Kitchen" && view === "menu" && !bundleSeen) {
      const shuffled = [...sampleMenu].sort(() => Math.random() - 0.5);
      // FIX #1: Preserve originalPrice on each item so the modal and cart can both
      // reference the pre-discount price without mutating the source data.
      setBundle(shuffled.slice(0, 3).map(item => ({ ...item, originalPrice: item.price })));
      setShowBundle(true);
      setBundleSeen(true);
    }
  }, [closingMode, selected, view, bundleSeen]);

  // Reset bundleSeen when the user navigates away from Boolen Kitchen
  useEffect(() => {
    if (selected?.name !== "Boolen Kitchen" || view !== "menu") {
      setBundleSeen(false);
      setShowBundle(false);
    }
  }, [selected, view]);

  // FIX #1: Add bundle items with a discounted price AND a bundleDiscount flag so
  // the cart can display them correctly without corrupting the source menu data.
  const handleBundleAccept = (items) => {
    items.forEach(item => addToCart({
      ...item,
      price: parseFloat((item.originalPrice * 0.65).toFixed(2)),
      bundleDiscount: true,
    }));
    setShowBundle(false);
  };

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
      />
    );
  }

  // ─── Confirmation Page ───
  if (customerTab === "confirmation") {
    return (
      <div style={{
        background: T.bg, minHeight: "calc(100vh - 52px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 40,
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          style={{
            background: T.card, borderRadius: 28,
            border: `1px solid ${T.border}`,
            boxShadow: "0 8px 48px rgba(0,0,0,0.10)",
            padding: "56px 64px", textAlign: "center",
            maxWidth: 520, width: "100%",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 16, stiffness: 300, delay: 0.1 }}
            style={{
              width: 88, height: 88, borderRadius: "50%",
              background: `${T.green}18`,
              border: `3px solid ${T.green}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px",
              fontSize: 40,
            }}
          >
            ✓
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 style={{
              fontSize: 30, fontWeight: 800, color: T.text,
              fontFamily: T.font, letterSpacing: "-0.03em", marginBottom: 10,
            }}>
              Order Placed!
            </h1>
            <p style={{ fontSize: 16, color: T.sub, fontFamily: T.fontText, lineHeight: 1.6, marginBottom: 36 }}>
              Your order has been received.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                clearCart();
                setView("list");
                setSelected(null);
                setCustomerTab("browse");
              }}
              style={{
                padding: "14px 36px", borderRadius: 14, border: "none",
                background: T.accent, color: "#fff", cursor: "pointer",
                fontSize: 16, fontWeight: 700, fontFamily: T.font,
              }}
            >
              Back to Restaurants
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const filteredRestaurants = activeCategory === "All"
    ? sampleRestaurants
    : sampleRestaurants.filter(r => r.cuisine === activeCategory || r.tags.includes(activeCategory));

  return (
    <div style={{ background: T.bg, minHeight: "calc(100vh - 52px)" }}>
      <CustomerNav
        cartCount={cartCount}
        cartTotal={cartTotal}
        setCustomerTab={setCustomerTab}
      />

      {/* ─── Restaurant List ─── */}
      {view === "list" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px" }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontSize: 36, fontWeight: 800, color: T.text,
              fontFamily: T.font, letterSpacing: "-0.03em", marginBottom: 8,
            }}>
              What are you craving?
            </h1>
            <p style={{ fontSize: 16, color: T.sub, fontFamily: T.fontText }}>
              Delivering to Davis, CA · {sampleRestaurants.length} restaurants nearby
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 18px", borderRadius: 24, border: "none",
                  background: activeCategory === cat ? T.accent : T.card,
                  color: activeCategory === cat ? "#fff" : T.text,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  fontFamily: T.fontText,
                  border: `1px solid ${activeCategory === cat ? T.accent : T.border}`,
                  transition: "all 0.15s",
                }}
              >{cat}</button>
            ))}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}>
            {filteredRestaurants.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <RestaurantCard
                  restaurant={r}
                  onClick={() => { setSelected(r); setView("menu"); }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Menu View ─── */}
      {view === "menu" && selected && (() => {
        const cats = [...new Set(sampleMenu.map(m => m.cat))];
        return (
          <div style={{ background: T.bg }}>
            {/* Back bar */}
            <div style={{
              background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${T.border}`, padding: "0 40px",
              display: "flex", alignItems: "center", gap: 12, height: 52,
              position: "sticky", top: 112, zIndex: 99,
            }}>
              <button
                onClick={() => { setSelected(null); setView("list"); }}
                style={{
                  background: "none", border: "none", color: T.accent, fontSize: 15,
                  fontWeight: 600, cursor: "pointer", fontFamily: T.font,
                  display: "flex", alignItems: "center", gap: 6, padding: 0,
                }}
              >← Restaurants</button>
              <span style={{ color: T.sub }}>›</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font }}>
                {selected.name}
              </span>

              {/* Closing mode badge */}
              {closingMode && selected.name === "Boolen Kitchen" && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 500,
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "10px 18px", borderRadius: 24,
                    background: T.orange, border: "none",
                    fontSize: 13, fontWeight: 700, color: "#FFF", fontFamily: T.fontText,
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(255,149,0,0.4)",
                  }}
                  // Allow the user to re-open the bundle modal from the badge after declining
                  onClick={() => {
                    if (!showBundle && bundle.length > 0) setShowBundle(true);
                  }}
                >
                  Closing Deal Available!
                </motion.div>
              )}
            </div>

            <div style={{
              maxWidth: 1200, margin: "0 auto", padding: "32px 40px",
              display: "flex", gap: 40, alignItems: "flex-start",
            }}>
              {/* Left: Menu content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Restaurant header */}
                <div style={{
                  background: T.card, borderRadius: 20,
                  border: `1px solid ${T.border}`,
                  padding: "28px 32px", marginBottom: 28,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: 20, background: T.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: `1px solid ${T.border}`, overflow: "hidden",
                    }}>
                      <ImgOrEmoji src={selected.img} size={44} alt={selected.name} style={{ borderRadius: 12 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, fontFamily: T.font, letterSpacing: "-0.02em" }}>
                        {selected.name}
                      </h1>
                      <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>
                        {selected.cuisine} · {selected.priceRange}
                      </p>
                      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span>⭐</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: T.fontText }}>
                            {selected.rating}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.sub }}>
                          <span>🕐</span>
                          <span style={{ fontSize: 14, fontFamily: T.fontText }}>{selected.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu categories */}
                {cats.map(cat => (
                  <div key={cat} style={{ marginBottom: 32 }}>
                    <h2 style={{
                      fontSize: 20, fontWeight: 700, color: T.text,
                      fontFamily: T.font, marginBottom: 16,
                      paddingBottom: 12, borderBottom: `2px solid ${T.border}`,
                    }}>{cat}</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {sampleMenu.filter(m => m.cat === cat).map(item => {
                        const inCart = cart.find(c => c.id === item.id);
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                              background: T.card, borderRadius: 16,
                              border: `1px solid ${T.border}`,
                              padding: "16px", position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 4 }}>
                                  {item.name}
                                </p>
                                <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginBottom: 10, lineHeight: 1.4 }}>
                                  {item.desc}
                                </p>
                                <p style={{ fontSize: 15, fontWeight: 700, color: T.accent, fontFamily: T.font }}>
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div style={{
                                width: 64, height: 64, borderRadius: 12,
                                background: T.bg, display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 32, flexShrink: 0,
                              }}>
                                {item.img}
                              </div>
                            </div>

                            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                              <AnimatePresence mode="wait">
                                {inCart ? (
                                  <motion.div
                                    key="stepper"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 6,
                                      background: T.accent, borderRadius: 20, padding: "4px 8px",
                                    }}
                                  >
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => removeFromCart(item)}
                                      style={{
                                        width: 26, height: 26, borderRadius: 13, border: "none",
                                        background: "rgba(255,255,255,0.25)", color: "#fff",
                                        fontSize: 18, cursor: "pointer", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        fontWeight: 700, fontFamily: T.font,
                                      }}
                                    >−</motion.button>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", minWidth: 18, textAlign: "center", fontFamily: T.font }}>
                                      {inCart.qty}
                                    </span>
                                    <motion.button
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => addToCart(item)}
                                      style={{
                                        width: 26, height: 26, borderRadius: 13, border: "none",
                                        background: "rgba(255,255,255,0.25)", color: "#fff",
                                        fontSize: 18, cursor: "pointer", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        fontWeight: 500, fontFamily: T.font,
                                      }}
                                    >+</motion.button>
                                  </motion.div>
                                ) : (
                                  <motion.button
                                    key="add"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => addToCart(item)}
                                    style={{
                                      width: 30, height: 30, borderRadius: 15, border: "none",
                                      background: T.accent, color: "#fff",
                                      fontSize: 20, cursor: "pointer", display: "flex",
                                      alignItems: "center", justifyContent: "center",
                                      fontWeight: 500, fontFamily: T.font,
                                    }}
                                  >+</motion.button>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Sticky Cart */}
              <CartSidebar
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cartTotal={cartTotal}
                cartCount={cartCount}
                setCustomerTab={setCustomerTab}
              />
            </div>

            {/* Closing Bundle Modal */}
            <AnimatePresence>
              {showBundle && (
                <ClosingBundleModal
                  bundle={bundle}
                  onAccept={handleBundleAccept}
                  onDecline={() => setShowBundle(false)}
                />
              )}
            </AnimatePresence>
          </div>
        );
      })()}
    </div>
  );
}