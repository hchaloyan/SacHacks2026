import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import T from "../theme";
import Icons from "../Icons";

// ─── MODAL ───
export function Modal({ open, onClose, title, children, width = 520 }) {
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

// ─── IMAGE UPLOAD ───
export function ImageUpload({ image, onImage, size = 120 }) {
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
export function Field({ label, value, onChange, placeholder, type = "text", prefix, small }) {
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
