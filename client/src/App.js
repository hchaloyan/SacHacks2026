import React, { useState } from "react";
import T from "./theme";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/business/Dashboard";
import Orders from "./pages/business/Orders";
import MenuManager from "./pages/business/MenuManager";
import BusinessHours from "./pages/business/BusinessHours";
import Financials from "./pages/business/Financials";
import CustomerView from "./pages/customer/CustomerView";

const viewLabels = {
  dashboard: "Dashboard",
  orders: "Orders",
  menu: "Menu Manager",
  hours: "Business Hours",
  financials: "Financials",
};

export default function App() {
  const [mode, setMode] = useState("owner");
  const [activeTab, setActiveTab] = useState("menu");
  const [customerTab, setCustomerTab] = useState("browse");
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (!ex) return prev;
      if (ex.qty === 1) return prev.filter(c => c.id !== item.id);
      return prev.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

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
            >{m === "owner" ? "Business View" : "Customer View"}</button>
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
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "orders" && <Orders />}
              {activeTab === "menu" && <MenuManager />}
              {activeTab === "hours" && <BusinessHours />}
              {activeTab === "financials" && <Financials />}
            </div>
          </div>
        ) : (
          <CustomerView
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            customerTab={customerTab}
            setCustomerTab={setCustomerTab}
          />
        )}
      </div>
    </div>
  );
}