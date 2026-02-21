import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── THEME ───
const T = {
  bg: "#F2F2F7",
  card: "#FFFFFF",
  text: "#1D1D1F",
  sub: "#86868B",
  accent: "#0071E3",
  green: "#34C759",
  orange: "#FF9500",
  red: "#FF3B30",
  border: "rgba(0,0,0,0.06)",
  font: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
  fontText: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
};

// ─── ICONS (simple SVG) ───
const Icons = {
  dashboard: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  orders: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  clock: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  dollar: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 9.5a2.5 2 0 0 1 3-1.5c1.5.5 2 2 .5 3s-3 1.5-1.5 3a2.5 2 0 0 0 3-1" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  image: (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#C7C7CC" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  edit: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  trash: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  chevron: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  x: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  cart: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF9500" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

// ─── SAMPLE DATA ───
const initialCategories = [];

const sampleCustomerRestaurants = [
  { id: 1, name: "Boolen Kitchen", cuisine: "American", rating: 4.8, time: "20-30 min", img: "🍽️" },
  { id: 2, name: "Pizza Express", cuisine: "Italian", rating: 4.6, time: "25-35 min", img: "🍕" },
  { id: 3, name: "Sushi Bay", cuisine: "Japanese", rating: 4.9, time: "15-25 min", img: "🍣" },
];

// ─── SIDEBAR ───
function Sidebar({ active, setActive }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "orders", label: "Orders", icon: Icons.orders },
    { id: "menu", label: "Menu Manager", icon: Icons.menu },
    { id: "hours", label: "Business Hours", icon: Icons.clock },
    { id: "financials", label: "Financials", icon: Icons.dollar },
  ];

  return (
    <div style={{
      width: 240,
      minHeight: "100vh",
      background: T.card,
      borderRight: `1px solid ${T.border}`,
      padding: "24px 12px",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{ padding: "0 12px", marginBottom: 32 }}>
        <h1 style={{
          fontSize: 26,
          fontWeight: 800,
          fontFamily: T.font,
          color: T.accent,
          letterSpacing: "-0.03em",
        }}>boolen</h1>
        <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Merchant</p>
      </div>

      <div style={{
        padding: "12px 14px",
        background: T.bg,
        borderRadius: 12,
        marginBottom: 24,
        marginLeft: 4,
        marginRight: 4,
      }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>My Restaurant</p>
        <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 2 }}>Store</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                fontFamily: T.fontText,
                color: isActive ? T.accent : "#6E6E73",
                background: isActive ? `${T.accent}10` : "transparent",
                transition: "all 0.15s ease",
                textAlign: "left",
              }}
            >
              <span style={{ color: isActive ? T.accent : "#AEAEB2", display: "flex" }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MODAL ───
function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: T.card,
            borderRadius: 20,
            width: "100%",
            maxWidth: width,
            maxHeight: "85vh",
            overflow: "auto",
            boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "20px 24px",
            borderBottom: `1px solid ${T.border}`,
            position: "sticky", top: 0, background: T.card, zIndex: 1,
            borderRadius: "20px 20px 0 0",
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: T.font }}>{title}</h2>
            <button onClick={onClose} style={{
              background: T.bg, border: "none", borderRadius: 20, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: T.sub,
            }}>{Icons.x}</button>
          </div>
          <div style={{ padding: 24 }}>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── IMAGE UPLOAD PLACEHOLDER ───
function ImageUpload({ image, onImage, size = 120 }) {
  const ref = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div
      onClick={() => ref.current?.click()}
      style={{
        width: size, height: size, borderRadius: 16,
        background: image ? `url(${image}) center/cover` : T.bg,
        border: `2px dashed ${image ? "transparent" : "#D1D1D6"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", cursor: "pointer",
        transition: "border-color 0.2s",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {!image && (
        <>
          {Icons.image}
          <span style={{ fontSize: 11, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>Add Photo</span>
        </>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
    </div>
  );
}

// ─── INPUT FIELD ───
function Field({ label, value, onChange, placeholder, type = "text", prefix, small }) {
  return (
    <div style={{ marginBottom: small ? 12 : 16 }}>
      <label style={{
        display: "block", fontSize: 13, fontWeight: 500, color: T.sub,
        fontFamily: T.fontText, marginBottom: 6,
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        {prefix && <span style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: T.sub, fontSize: 15, fontFamily: T.fontText,
        }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: prefix ? "10px 14px 10px 28px" : "10px 14px",
            borderRadius: 10, border: `1px solid ${T.border}`,
            fontSize: 15, fontFamily: T.fontText, outline: "none",
            boxSizing: "border-box", background: T.bg,
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accent}20`; }}
          onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
        />
      </div>
    </div>
  );
}

// ─── MENU MANAGER ───
function MenuManager() {
  const [categories, setCategories] = useState(initialCategories);
  const [expandedCat, setExpandedCat] = useState(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [showAddItem, setShowAddItem] = useState(null); // catId
  const [editItem, setEditItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: "", description: "", deliveryPrice: "", pickupPrice: "", image: null, modifiers: [],
  });
  const [showModModal, setShowModModal] = useState(false);
  const [modForm, setModForm] = useState({ name: "", options: [{ name: "", price: "" }] });

  const addCategory = () => {
    if (!newCatName.trim()) return;
    setCategories(prev => [...prev, { id: Date.now(), name: newCatName.trim(), items: [] }]);
    setNewCatName("");
    setShowAddCat(false);
  };

  const removeCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
  };

  const openAddItem = (catId) => {
    setShowAddItem(catId);
    setEditItem(null);
    setItemForm({ name: "", description: "", deliveryPrice: "", pickupPrice: "", image: null, modifiers: [] });
  };

  const openEditItem = (catId, item) => {
    setShowAddItem(catId);
    setEditItem(item.id);
    setItemForm({
      name: item.name,
      description: item.description || "",
      deliveryPrice: item.deliveryPrice?.toString() || "",
      pickupPrice: item.pickupPrice?.toString() || "",
      image: item.image || null,
      modifiers: item.modifiers || [],
    });
  };

  const saveItem = () => {
    if (!itemForm.name.trim() || !showAddItem) return;
    const newItem = {
      id: editItem || Date.now(),
      name: itemForm.name.trim(),
      description: itemForm.description.trim(),
      deliveryPrice: parseFloat(itemForm.deliveryPrice) || 0,
      pickupPrice: parseFloat(itemForm.pickupPrice) || 0,
      image: itemForm.image,
      modifiers: itemForm.modifiers,
      available: true,
    };
    setCategories(prev => prev.map(cat => {
      if (cat.id !== showAddItem) return cat;
      if (editItem) {
        return { ...cat, items: cat.items.map(i => i.id === editItem ? newItem : i) };
      }
      return { ...cat, items: [...cat.items, newItem] };
    }));
    setShowAddItem(null);
    setEditItem(null);
  };

  const removeItem = (catId, itemId) => {
    setCategories(prev => prev.map(cat =>
      cat.id === catId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat
    ));
  };

  const addModifier = () => {
    if (!modForm.name.trim()) return;
    const mod = {
      id: Date.now(),
      name: modForm.name.trim(),
      options: modForm.options.filter(o => o.name.trim()).map(o => ({
        name: o.name.trim(),
        price: parseFloat(o.price) || 0,
      })),
    };
    setItemForm(prev => ({ ...prev, modifiers: [...prev.modifiers, mod] }));
    setModForm({ name: "", options: [{ name: "", price: "" }] });
    setShowModModal(false);
  };

  const removeModifier = (modId) => {
    setItemForm(prev => ({ ...prev, modifiers: prev.modifiers.filter(m => m.id !== modId) }));
  };

  return (
    <div>
      {/* Menu Header Dropdown */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 24,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px", background: T.card, borderRadius: 12,
          border: `1px solid ${T.border}`, cursor: "pointer",
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font }}>All Day Menu</span>
          <span style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText }}>Mon–Sun 11:00 am–9:00 pm</span>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke={T.sub} strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{
            background: T.card, borderRadius: 16,
            border: `1px solid ${T.border}`,
            overflow: "hidden",
          }}>
            {/* Category Header */}
            <div
              onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 20px", cursor: "pointer",
                background: expandedCat === cat.id ? `${T.accent}06` : "transparent",
                transition: "background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <motion.span
                  animate={{ rotate: expandedCat === cat.id ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", color: T.sub }}
                >
                  {Icons.chevron}
                </motion.span>
                <span style={{ fontSize: 16, fontWeight: 600, color: T.text, fontFamily: T.font }}>{cat.name}</span>
                <span style={{
                  fontSize: 12, color: T.sub, fontFamily: T.fontText,
                  background: T.bg, padding: "2px 8px", borderRadius: 10,
                }}>{cat.items.length} items</span>
              </div>
              <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => openAddItem(cat.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "6px 12px", borderRadius: 8, border: "none",
                    background: T.accent, color: "#FFF", fontSize: 13,
                    fontWeight: 600, cursor: "pointer", fontFamily: T.fontText,
                  }}
                >{Icons.plus}<span>Add Item</span></button>
                <button
                  onClick={() => removeCategory(cat.id)}
                  style={{
                    display: "flex", alignItems: "center", padding: "6px 8px",
                    borderRadius: 8, border: "none", background: `${T.red}10`,
                    color: T.red, cursor: "pointer",
                  }}
                >{Icons.trash}</button>
              </div>
            </div>

            {/* Items Grid */}
            <AnimatePresence>
              {expandedCat === cat.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    padding: "4px 20px 20px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 12,
                  }}>
                    {cat.items.length === 0 && (
                      <div style={{
                        gridColumn: "1 / -1",
                        padding: "32px 0",
                        textAlign: "center",
                        color: T.sub,
                        fontSize: 14,
                        fontFamily: T.fontText,
                      }}>
                        No items yet. Click "Add Item" to get started.
                      </div>
                    )}
                    {cat.items.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: T.bg,
                          borderRadius: 14,
                          padding: 16,
                          display: "flex",
                          gap: 14,
                          position: "relative",
                        }}
                      >
                        <div style={{
                          width: 80, height: 80, borderRadius: 12, flexShrink: 0,
                          background: item.image ? `url(${item.image}) center/cover` : "#E5E5EA",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          overflow: "hidden",
                        }}>
                          {!item.image && <span style={{ fontSize: 28 }}>🍽</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                          }}>{item.name}</p>
                          <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 2 }}>
                            Delivery: ${item.deliveryPrice.toFixed(2)}
                          </p>
                          <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText }}>
                            Pickup: ${item.pickupPrice.toFixed(2)}
                          </p>
                          {item.description && (
                            <p style={{
                              fontSize: 12, color: "#8E8E93", fontFamily: T.fontText,
                              marginTop: 4, lineHeight: 1.3,
                              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}>{item.description}</p>
                          )}
                          {item.modifiers?.length > 0 && (
                            <p style={{ fontSize: 11, color: T.accent, fontFamily: T.fontText, marginTop: 4 }}>
                              {item.modifiers.length} modifier{item.modifiers.length > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <div style={{
                          position: "absolute", top: 10, right: 10,
                          display: "flex", gap: 4,
                        }}>
                          <button
                            onClick={() => openEditItem(cat.id, item)}
                            style={{
                              width: 28, height: 28, borderRadius: 8, border: "none",
                              background: T.card, cursor: "pointer", display: "flex",
                              alignItems: "center", justifyContent: "center", color: T.accent,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            }}
                          >{Icons.edit}</button>
                          <button
                            onClick={() => removeItem(cat.id, item.id)}
                            style={{
                              width: 28, height: 28, borderRadius: 8, border: "none",
                              background: T.card, cursor: "pointer", display: "flex",
                              alignItems: "center", justifyContent: "center", color: T.red,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            }}
                          >{Icons.trash}</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Add Category */}
        {showAddCat ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: T.card, borderRadius: 16, padding: 20,
              border: `1px solid ${T.border}`,
              display: "flex", gap: 10, alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <Field label="Category Name" value={newCatName} onChange={setNewCatName} placeholder="e.g. Appetizers, Beverages, Entrees" small />
            </div>
            <div style={{ display: "flex", gap: 8, paddingBottom: 12 }}>
              <button onClick={addCategory} style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: T.accent, color: "#FFF", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: T.fontText,
              }}>Add</button>
              <button onClick={() => { setShowAddCat(false); setNewCatName(""); }} style={{
                padding: "10px 16px", borderRadius: 10, border: `1px solid ${T.border}`,
                background: T.card, color: T.sub, fontSize: 14, fontWeight: 500,
                cursor: "pointer", fontFamily: T.fontText,
              }}>Cancel</button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowAddCat(true)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "16px 20px", borderRadius: 16,
              border: `2px dashed #D1D1D6`, background: "transparent",
              color: T.accent, fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: T.fontText,
              transition: "border-color 0.15s, background 0.15s",
              width: "100%",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = `${T.accent}06`; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#D1D1D6"; e.currentTarget.style.background = "transparent"; }}
          >
            {Icons.plus}
            <span>Add a Category</span>
          </button>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      <Modal
        open={showAddItem !== null}
        onClose={() => { setShowAddItem(null); setEditItem(null); }}
        title={editItem ? "Edit Item" : "Add Item"}
        width={560}
      >
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <ImageUpload image={itemForm.image} onImage={(img) => setItemForm(prev => ({ ...prev, image: img }))} />
          <div style={{ flex: 1 }}>
            <Field label="Item Name" value={itemForm.name} onChange={v => setItemForm(p => ({ ...p, name: v }))} placeholder="e.g. Classic Burger" />
            <Field label="Description" value={itemForm.description} onChange={v => setItemForm(p => ({ ...p, description: v }))} placeholder="Short description of the item" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <Field label="Delivery Price" value={itemForm.deliveryPrice} onChange={v => setItemForm(p => ({ ...p, deliveryPrice: v }))} placeholder="0.00" prefix="$" type="number" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Pickup Price" value={itemForm.pickupPrice} onChange={v => setItemForm(p => ({ ...p, pickupPrice: v }))} placeholder="0.00" prefix="$" type="number" />
          </div>
        </div>

        {/* Modifiers Section */}
        <div style={{
          borderTop: `1px solid ${T.border}`, paddingTop: 20, marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font }}>Modifiers</h3>
            <button
              onClick={() => setShowModModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "6px 14px", borderRadius: 8, border: `1px solid ${T.border}`,
                background: T.card, color: T.accent, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: T.fontText,
              }}
            >{Icons.plus}<span>Add Modifier</span></button>
          </div>

          {itemForm.modifiers.length === 0 && (
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText }}>
              No modifiers yet. Add options like "Remove lettuce", "Extra cheese", etc.
            </p>
          )}

          {itemForm.modifiers.map(mod => (
            <div key={mod.id} style={{
              background: T.bg, borderRadius: 10, padding: "12px 14px", marginBottom: 8,
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.font }}>{mod.name}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                  {mod.options.map((opt, i) => (
                    <span key={i} style={{
                      fontSize: 12, padding: "3px 10px", borderRadius: 6,
                      background: T.card, border: `1px solid ${T.border}`,
                      fontFamily: T.fontText, color: T.text,
                    }}>
                      {opt.name}{opt.price > 0 ? ` (+$${opt.price.toFixed(2)})` : ""}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => removeModifier(mod.id)} style={{
                background: "none", border: "none", color: T.red, cursor: "pointer", padding: 4,
              }}>{Icons.trash}</button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => { setShowAddItem(null); setEditItem(null); }} style={{
            padding: "12px 24px", borderRadius: 12, border: `1px solid ${T.border}`,
            background: T.card, color: T.sub, fontSize: 15, fontWeight: 500,
            cursor: "pointer", fontFamily: T.fontText,
          }}>Cancel</button>
          <button onClick={saveItem} style={{
            padding: "12px 32px", borderRadius: 12, border: "none",
            background: T.accent, color: "#FFF", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: T.fontText,
          }}>{editItem ? "Save Changes" : "Add Item"}</button>
        </div>
      </Modal>

      {/* Add Modifier Sub-Modal */}
      <Modal
        open={showModModal}
        onClose={() => setShowModModal(false)}
        title="Add Modifier Group"
        width={440}
      >
        <Field label="Modifier Name" value={modForm.name} onChange={v => setModForm(p => ({ ...p, name: v }))} placeholder='e.g. "Customize", "Extras", "Remove"' />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: T.sub, fontFamily: T.fontText, marginBottom: 8 }}>Options</label>
          {modForm.options.map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                value={opt.name}
                onChange={e => {
                  const opts = [...modForm.options];
                  opts[i] = { ...opts[i], name: e.target.value };
                  setModForm(p => ({ ...p, options: opts }));
                }}
                placeholder="Option name"
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10,
                  border: `1px solid ${T.border}`, fontSize: 14,
                  fontFamily: T.fontText, outline: "none", background: T.bg,
                  boxSizing: "border-box",
                }}
              />
              <input
                value={opt.price}
                onChange={e => {
                  const opts = [...modForm.options];
                  opts[i] = { ...opts[i], price: e.target.value };
                  setModForm(p => ({ ...p, options: opts }));
                }}
                placeholder="$0.00"
                type="number"
                style={{
                  width: 80, padding: "10px 14px", borderRadius: 10,
                  border: `1px solid ${T.border}`, fontSize: 14,
                  fontFamily: T.fontText, outline: "none", background: T.bg,
                  boxSizing: "border-box",
                }}
              />
              {modForm.options.length > 1 && (
                <button onClick={() => setModForm(p => ({ ...p, options: p.options.filter((_, j) => j !== i) }))} style={{
                  background: "none", border: "none", color: T.red, cursor: "pointer",
                }}>{Icons.x}</button>
              )}
            </div>
          ))}
          <button
            onClick={() => setModForm(p => ({ ...p, options: [...p.options, { name: "", price: "" }] }))}
            style={{
              fontSize: 13, color: T.accent, background: "none", border: "none",
              cursor: "pointer", fontWeight: 600, fontFamily: T.fontText, padding: 0,
            }}
          >+ Add another option</button>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => setShowModModal(false)} style={{
            padding: "10px 20px", borderRadius: 10, border: `1px solid ${T.border}`,
            background: T.card, color: T.sub, fontSize: 14, cursor: "pointer", fontFamily: T.fontText,
          }}>Cancel</button>
          <button onClick={addModifier} style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: T.accent, color: "#FFF", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: T.fontText,
          }}>Add Modifier</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── DASHBOARD VIEW ───
function DashboardView() {
  const stats = [
    { label: "Today's Orders", value: "0", change: "—", color: T.accent },
    { label: "Revenue", value: "$0.00", change: "—", color: T.green },
    { label: "Active Menu Items", value: "0", change: "", color: T.orange },
    { label: "Avg. Order Value", value: "$0.00", change: "", color: "#AF52DE" },
  ];

  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28,
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: T.card, borderRadius: 16, padding: "20px 22px",
              border: `1px solid ${T.border}`,
            }}
          >
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: T.font, letterSpacing: "-0.02em" }}>{s.value}</p>
            {s.change && <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>{s.change}</p>}
          </motion.div>
        ))}
      </div>

      <div style={{ background: T.card, borderRadius: 16, padding: 28, border: `1px solid ${T.border}`, textAlign: "center" }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>📊</p>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 6 }}>Welcome to Boolen</h3>
        <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText, maxWidth: 400, margin: "0 auto" }}>
          Start by setting up your menu in the Menu Manager. Once you're live, orders and analytics will appear here.
        </p>
      </div>
    </div>
  );
}

// ─── ORDERS VIEW ───
function OrdersView() {
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: 40, border: `1px solid ${T.border}`, textAlign: "center" }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>📋</p>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 6 }}>No orders yet</h3>
      <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Incoming orders will appear here in real-time.</p>
    </div>
  );
}

// ─── HOURS VIEW ───
function HoursView() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [hours, setHours] = useState(
    days.reduce((acc, d) => ({ ...acc, [d]: { open: "11:00", close: "21:00", closed: false } }), {})
  );

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: 24, border: `1px solid ${T.border}` }}>
      {days.map(day => (
        <div key={day} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 0",
          borderBottom: day !== "Sunday" ? `1px solid ${T.border}` : "none",
        }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: T.text, fontFamily: T.font, width: 100 }}>{day}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {hours[day].closed ? (
              <span style={{ fontSize: 14, color: T.red, fontFamily: T.fontText, fontWeight: 500 }}>Closed</span>
            ) : (
              <>
                <input type="time" value={hours[day].open}
                  onChange={e => setHours(h => ({ ...h, [day]: { ...h[day], open: e.target.value } }))}
                  style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: T.fontText, background: T.bg }}
                />
                <span style={{ color: T.sub, fontSize: 13 }}>to</span>
                <input type="time" value={hours[day].close}
                  onChange={e => setHours(h => ({ ...h, [day]: { ...h[day], close: e.target.value } }))}
                  style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: T.fontText, background: T.bg }}
                />
              </>
            )}
            <button
              onClick={() => setHours(h => ({ ...h, [day]: { ...h[day], closed: !h[day].closed } }))}
              style={{
                width: 44, height: 26, borderRadius: 13, border: "none",
                background: hours[day].closed ? "#E5E5EA" : T.green,
                cursor: "pointer", position: "relative", transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 11, background: "#FFF",
                position: "absolute", top: 2,
                left: hours[day].closed ? 2 : 20,
                transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FINANCIALS VIEW ───
function FinancialsView() {
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: 40, border: `1px solid ${T.border}`, textAlign: "center" }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>💰</p>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 6 }}>Financials</h3>
      <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>Revenue reports and payout details will appear here once orders start coming in.</p>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ─── CUSTOMER SIDE ───
// ═══════════════════════════════════════════════
function CustomerSide() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);

  const sampleMenu = [
    { id: 1, name: "Classic Burger", desc: "Angus beef, lettuce, tomato, special sauce", price: 12.99, img: "🍔", cat: "Entrees" },
    { id: 2, name: "Caesar Salad", desc: "Romaine, croutons, parmesan, caesar dressing", price: 9.99, img: "🥗", cat: "Appetizers" },
    { id: 3, name: "Margherita Pizza", desc: "Fresh mozzarella, basil, tomato sauce", price: 14.99, img: "🍕", cat: "Entrees" },
    { id: 4, name: "Iced Lemonade", desc: "Fresh-squeezed with mint", price: 4.99, img: "🍋", cat: "Beverages" },
    { id: 5, name: "Chocolate Cake", desc: "Rich dark chocolate with ganache", price: 7.99, img: "🍫", cat: "Desserts" },
    { id: 6, name: "Garlic Fries", desc: "Crispy fries tossed with roasted garlic", price: 5.99, img: "🍟", cat: "Appetizers" },
  ];

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

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
          {sampleCustomerRestaurants.map(r => (
            <motion.button
              key={r.id}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => { setSelected(r); setView("menu"); }}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: 18, background: T.card, borderRadius: 16,
                border: `1px solid ${T.border}`, cursor: "pointer",
                textAlign: "left", width: "100%",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14, background: T.bg,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0,
              }}>{r.img}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 17, fontWeight: 600, color: T.text, fontFamily: T.font }}>{r.name}</p>
                <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText, marginTop: 2 }}>{r.cuisine} · {r.time}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                {Icons.star}
                <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.fontText }}>{r.rating}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (view === "menu" && selected) {
    const cats = [...new Set(sampleMenu.map(m => m.cat))];
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        maxWidth: 540, margin: "0 auto", padding: "32px 20px",
        paddingBottom: cartCount > 0 ? 100 : 32,
      }}>
        <button onClick={() => { setView("list"); setCart([]); }} style={{
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
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText }}>{Icons.star} {selected.rating} · {selected.time}</p>
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
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(item)}
                    style={{
                      width: 36, height: 36, borderRadius: 18, border: "none",
                      background: inCart ? T.accent : T.bg, color: inCart ? "#FFF" : T.accent,
                      fontSize: 16, cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                      fontWeight: 600, fontFamily: T.font,
                    }}
                  >{inCart ? inCart.qty : "+"}</motion.button>
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
            <button style={{
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

// ═══════════════════════════════════════════════
// ─── MAIN APP ───
// ═══════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState("owner");
  const [activeTab, setActiveTab] = useState("menu");

  const viewLabels = { dashboard: "Dashboard", orders: "Orders", menu: "Menu Manager", hours: "Business Hours", financials: "Financials" };

  return (
    <div style={{ fontFamily: T.font }}>
      {/* Top Toggle */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "10px 0",
      }}>
        <div style={{
          display: "flex", background: T.bg, borderRadius: 10, padding: 3,
        }}>
          {["owner", "customer"].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "8px 24px", borderRadius: 8, border: "none",
                background: mode === m ? T.card : "transparent",
                color: mode === m ? T.text : T.sub,
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: T.fontText,
                boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >{m === "owner" ? "Owner View" : "Customer View"}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 52 }}>
        {mode === "owner" ? (
          <div style={{ display: "flex", minHeight: "calc(100vh - 52px)" }}>
            <Sidebar active={activeTab} setActive={setActiveTab} />
            <div style={{ flex: 1, padding: "32px 36px", background: T.bg, overflow: "auto" }}>
              <h1 style={{
                fontSize: 28, fontWeight: 700, color: T.text, fontFamily: T.font,
                letterSpacing: "-0.025em", marginBottom: 24,
              }}>{viewLabels[activeTab]}</h1>
              {activeTab === "dashboard" && <DashboardView />}
              {activeTab === "orders" && <OrdersView />}
              {activeTab === "menu" && <MenuManager />}
              {activeTab === "hours" && <HoursView />}
              {activeTab === "financials" && <FinancialsView />}
            </div>
          </div>
        ) : (
          <CustomerSide />
        )}
      </div>
    </div>
  );
}
