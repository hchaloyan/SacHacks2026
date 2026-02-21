import React from "react";
import T from "../../theme";

export default function Financials() {
  return (
    <div style={{
      background: T.card, borderRadius: 16, padding: 40,
      border: `1px solid ${T.border}`, textAlign: "center",
    }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>💰</p>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: T.font, marginBottom: 6 }}>
        Financials
      </h3>
      <p style={{ fontSize: 14, color: T.sub, fontFamily: T.fontText }}>
        Revenue reports and payout details will appear here once orders start coming in.
      </p>
    </div>
  );
}
