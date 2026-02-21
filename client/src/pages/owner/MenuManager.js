import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import T from "../../theme";
import Icons from "../../Icons";
import { Modal, ImageUpload, Field } from "../../components/Shared";
import { api } from "../../api";

export default function MenuManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  const [expandedCat, setExpandedCat] = useState(null);
  const [showAddCat, setShowAddCat]   = useState(false);
  const [newCatName, setNewCatName]   = useState("");
  const [showAddItem, setShowAddItem] = useState(null);
  const [editItem, setEditItem]       = useState(null);
  const [itemForm, setItemForm]       = useState({
    name: "", description: "", deliveryPrice: "", pickupPrice: "", image: null, modifiers: [],
  });
  const [showModModal, setShowModModal] = useState(false);
  const [modForm, setModForm] = useState({ name: "", options: [{ name: "", price: "" }] });

  // Load menu on mount
  useEffect(() => {
    api.getMenu()
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(err => console.error("Failed to load menu:", err))
      .finally(() => setLoading(false));
  }, []);

  // Persist to server
  const persist = useCallback(async (next) => {
    setSaving(true);
    try { await api.saveMenu(next); }
    catch (err) { console.error("Failed to save menu:", err); }
    finally { setSaving(false); }
  }, []);

  const setAndSave = (updater) => {
    setCategories(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(next);
      return next;
    });
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    setAndSave(prev => [...prev, { id: Date.now(), name: newCatName.trim(), items: [] }]);
    setNewCatName("");
    setShowAddCat(false);
  };

  const removeCategory = (catId) => {
    setAndSave(prev => prev.filter(c => c.id !== catId));
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
    setAndSave(prev => prev.map(cat => {
      if (cat.id !== showAddItem) return cat;
      if (editItem) return { ...cat, items: cat.items.map(i => i.id === editItem ? newItem : i) };
      return { ...cat, items: [...cat.items, newItem] };
    }));
    setShowAddItem(null);
    setEditItem(null);
  };

  const removeItem = (catId, itemId) => {
    setAndSave(prev => prev.map(cat =>
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

  if (loading) {
    return <div style={{ color: T.sub, fontFamily: T.fontText, padding: 20 }}>Loading menu…</div>;
  }

  return (
    <div>
      {saving && (
        <div style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 9999,
          background: T.accent, color: "#FFF", padding: "8px 16px",
          borderRadius: 10, fontSize: 13, fontFamily: T.fontText,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>Saving…</div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, overflow: "hidden" }}>
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
                <motion.span animate={{ rotate: expandedCat === cat.id ? 90 : 0 }} transition={{ duration: 0.2 }} style={{ display: "flex", color: T.sub }}>
                  {Icons.chevron}
                </motion.span>
                <span style={{ fontSize: 16, fontWeight: 600, color: T.text, fontFamily: T.font }}>{cat.name}</span>
                <span style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, background: T.bg, padding: "2px 8px", borderRadius: 10 }}>{cat.items.length} items</span>
              </div>
              <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => openAddItem(cat.id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "none", background: T.accent, color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText }}>
                  {Icons.plus}<span>Add Item</span>
                </button>
                <button onClick={() => removeCategory(cat.id)} style={{ display: "flex", alignItems: "center", padding: "6px 8px", borderRadius: 8, border: "none", background: `${T.red}10`, color: T.red, cursor: "pointer" }}>
                  {Icons.trash}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedCat === cat.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                  <div style={{ padding: "4px 20px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                    {cat.items.length === 0 && (
                      <div style={{ gridColumn: "1 / -1", padding: "32px 0", textAlign: "center", color: T.sub, fontSize: 14, fontFamily: T.fontText }}>
                        No items yet. Click "Add Item" to get started.
                      </div>
                    )}
                    {cat.items.map(item => (
                      <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", position: "relative" }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />}
                        <div style={{ padding: "12px 14px" }}>
                          <p style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 2 }}>{item.name}</p>
                          {item.description && <p style={{ fontSize: 12, color: T.sub, fontFamily: T.fontText, marginBottom: 6 }}>{item.description}</p>}
                          <p style={{ fontSize: 14, color: T.accent, fontWeight: 600, fontFamily: T.font }}>
                            ${item.deliveryPrice?.toFixed(2)}{item.pickupPrice !== item.deliveryPrice ? ` / $${item.pickupPrice?.toFixed(2)}` : ""}
                          </p>
                          {item.modifiers?.length > 0 && (
                            <p style={{ fontSize: 11, color: T.sub, fontFamily: T.fontText, marginTop: 4 }}>
                              {item.modifiers.length} modifier group{item.modifiers.length !== 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }}>
                          <button onClick={() => openEditItem(cat.id, item)} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: T.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>{Icons.edit}</button>
                          <button onClick={() => removeItem(cat.id, item.id)} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: T.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.red, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>{Icons.trash}</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {showAddCat ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: T.card, borderRadius: 16, padding: 20, border: `1px solid ${T.border}`, display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Field label="Category Name" value={newCatName} onChange={setNewCatName} placeholder="e.g. Appetizers, Beverages, Entrees" small />
            </div>
            <div style={{ display: "flex", gap: 8, paddingBottom: 12 }}>
              <button onClick={addCategory} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: T.accent, color: "#FFF", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText }}>Add</button>
              <button onClick={() => { setShowAddCat(false); setNewCatName(""); }} style={{ padding: "10px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, color: T.sub, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: T.fontText }}>Cancel</button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowAddCat(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 20px", borderRadius: 16, border: `2px dashed #D1D1D6`, background: "transparent", color: T.accent, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText, transition: "border-color 0.15s, background 0.15s", width: "100%" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = `${T.accent}06`; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = "#D1D1D6"; e.currentTarget.style.background = "transparent"; }}
          >
            {Icons.plus}<span>Add a Category</span>
          </button>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      <Modal open={showAddItem !== null} onClose={() => { setShowAddItem(null); setEditItem(null); }} title={editItem ? "Edit Item" : "Add Item"} width={560}>
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

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.font }}>Modifiers</h3>
            <button onClick={() => setShowModModal(true)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.accent, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText }}>
              {Icons.plus}<span>Add Modifier</span>
            </button>
          </div>
          {itemForm.modifiers.length === 0 && (
            <p style={{ fontSize: 13, color: T.sub, fontFamily: T.fontText }}>No modifiers yet. Add options like "Remove lettuce", "Extra cheese", etc.</p>
          )}
          {itemForm.modifiers.map(mod => (
            <div key={mod.id} style={{ background: T.bg, borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.font }}>{mod.name}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                  {mod.options.map((opt, i) => (
                    <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: T.card, border: `1px solid ${T.border}`, fontFamily: T.fontText, color: T.text }}>
                      {opt.name}{opt.price > 0 ? ` (+$${opt.price.toFixed(2)})` : ""}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => removeModifier(mod.id)} style={{ background: "none", border: "none", color: T.red, cursor: "pointer", padding: 4 }}>{Icons.trash}</button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => { setShowAddItem(null); setEditItem(null); }} style={{ padding: "12px 24px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.card, color: T.sub, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: T.fontText }}>Cancel</button>
          <button onClick={saveItem} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: T.accent, color: "#FFF", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText }}>{editItem ? "Save Changes" : "Add Item"}</button>
        </div>
      </Modal>

      {/* Add Modifier Sub-Modal */}
      <Modal open={showModModal} onClose={() => setShowModModal(false)} title="Add Modifier Group" width={440}>
        <Field label="Modifier Name" value={modForm.name} onChange={v => setModForm(p => ({ ...p, name: v }))} placeholder='e.g. "Customize", "Extras", "Remove"' />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: T.sub, fontFamily: T.fontText, marginBottom: 8 }}>Options</label>
          {modForm.options.map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={opt.name} onChange={e => { const opts = [...modForm.options]; opts[i] = { ...opts[i], name: e.target.value }; setModForm(p => ({ ...p, options: opts })); }} placeholder="Option name" style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: T.fontText, outline: "none", background: T.bg, boxSizing: "border-box" }} />
              <input value={opt.price} onChange={e => { const opts = [...modForm.options]; opts[i] = { ...opts[i], price: e.target.value }; setModForm(p => ({ ...p, options: opts })); }} placeholder="$0.00" type="number" style={{ width: 80, padding: "10px 14px", borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: T.fontText, outline: "none", background: T.bg, boxSizing: "border-box" }} />
              {modForm.options.length > 1 && (
                <button onClick={() => setModForm(p => ({ ...p, options: p.options.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", color: T.red, cursor: "pointer" }}>{Icons.x}</button>
              )}
            </div>
          ))}
          <button onClick={() => setModForm(p => ({ ...p, options: [...p.options, { name: "", price: "" }] }))} style={{ fontSize: 13, color: T.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: T.fontText, padding: 0 }}>+ Add another option</button>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => setShowModModal(false)} style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${T.border}`, background: T.card, color: T.sub, fontSize: 14, cursor: "pointer", fontFamily: T.fontText }}>Cancel</button>
          <button onClick={addModifier} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: T.accent, color: "#FFF", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.fontText }}>Add Modifier</button>
        </div>
      </Modal>
    </div>
  );
}
