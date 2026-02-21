import React from "react";
import T from "../../theme";

export default function Orders() {
  return (
    <div style={{
      background: T.card, borderRadius: 16, padding: 40,
      border: `1px solid ${T.border}`, textAlign: "center",
    }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>📋</p>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 6 }}>
        No orders yet
      </h3>
      <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>
        Incoming orders will appear here in real-time.
      </p>
    </div>
  );
}
