import React, { useState, useEffect } from "react";
import T from "../../theme";
import { api } from "../../api";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function BusinessHours() {
  const [hours, setHours] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getHours()
      .then(data => setHours(data))
      .catch(err => console.error("Failed to load hours:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveHours(hours);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save hours:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!hours) {
    return <div style={{ color: T.sub, fontFamily: T.fontText, padding: 20 }}>Loading hours…</div>;
  }

  return (
    <div>
      <div style={{
        background: T.card, borderRadius: 16, padding: 24,
        border: `1px solid ${T.border}`,
      }}>
        {days.map(day => (
          <div key={day} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: day !== "Sunday" ? `1px solid ${T.border}` : "none",
          }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: T.text, fontFamily: T.font, width: 100 }}>
              {day}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {hours[day]?.closed ? (
                <span style={{ fontSize: 14, color: T.red, fontFamily: T.fontText, fontWeight: 500 }}>Closed</span>
              ) : (
                <>
                  <input type="time" value={hours[day]?.open || "11:00"}
                    onChange={e => setHours(h => ({ ...h, [day]: { ...h[day], open: e.target.value } }))}
                    style={{
                      padding: "6px 10px", borderRadius: 8, border: `1px solid ${T.border}`,
                      fontSize: 14, fontFamily: T.fontText, background: T.bg,
                    }}
                  />
                  <span style={{ color: T.sub, fontSize: 13 }}>to</span>
                  <input type="time" value={hours[day]?.close || "21:00"}
                    onChange={e => setHours(h => ({ ...h, [day]: { ...h[day], close: e.target.value } }))}
                    style={{
                      padding: "6px 10px", borderRadius: 8, border: `1px solid ${T.border}`,
                      fontSize: 14, fontFamily: T.fontText, background: T.bg,
                    }}
                  />
                </>
              )}
              <button
                onClick={() => setHours(h => ({ ...h, [day]: { ...h[day], closed: !h[day]?.closed } }))}
                style={{
                  width: 44, height: 26, borderRadius: 13, border: "none",
                  background: hours[day]?.closed ? "#E5E5EA" : T.green,
                  cursor: "pointer", position: "relative", transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 11, background: "#FFF",
                  position: "absolute", top: 2,
                  left: hours[day]?.closed ? 2 : 20,
                  transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          marginTop: 20, padding: "12px 28px", borderRadius: 12, border: "none",
          background: saved ? T.green : T.accent, color: "#FFF",
          fontSize: 15, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
          fontFamily: T.fontText, opacity: saving ? 0.7 : 1,
          transition: "background 0.3s",
        }}
      >
        {saving ? "Saving…" : saved ? "✓ Saved" : "Save Hours"}
      </button>
    </div>
  );
}