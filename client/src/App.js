import React, { useState } from "react";
import T from "./theme";
import LoginPage from "./LoginPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/owner/Dashboard";
import Orders from "./pages/owner/Orders";
import MenuManager from "./pages/owner/MenuManager";
import BusinessHours from "./pages/owner/BusinessHours";
import Financials from "./pages/owner/Financials";
import CustomerView from "./pages/customer/CustomerView";

const viewLabels = {
  dashboard: "Dashboard",
  orders: "Orders",
  menu: "Menu Manager",
  hours: "Business Hours",
  financials: "Financials",
};

export default function App() {
  const [mode, setMode] = useState(null);
  const [activeTab, setActiveTab] = useState("menu");
  const [customerTab, setCustomerTab] = useState("browse");
  const [cart, setCart] = useState([]);
  const [closingMode, setClosingMode] = useState(false);

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

  const clearCart = () => setCart([]);

  const handleLogout = () => {
    setMode(null);
    setCart([]);
    setCustomerTab("browse");
    setActiveTab("menu");
  };

  if (!mode) {
    return <LoginPage onLogin={setMode} />;
  }

  // ─── Owner Dashboard ───
  if (mode === "owner") {
    return (
      <div style={{ fontFamily: T.font, display: "flex", minHeight: "100vh" }}>
        <Sidebar active={activeTab} setActive={setActiveTab} onLogout={handleLogout} />
        <div style={{ flex: 1, padding: "32px 36px", background: T.bg, overflow: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h1 style={{
              fontSize: 28, fontWeight: 700, color: T.text, fontFamily: T.font,
              letterSpacing: "-0.025em", margin: 0,
            }}>{viewLabels[activeTab]}</h1>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 18px", borderRadius: 10, border: `1px solid ${T.border}`,
                background: T.card, color: T.sub, fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: T.fontText,
              }}
            >Sign Out</button>
          </div>
          {activeTab === "dashboard" && <Dashboard closingMode={closingMode} setClosingMode={setClosingMode} />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "menu" && <MenuManager />}
          {activeTab === "hours" && <BusinessHours />}
          {activeTab === "financials" && <Financials />}
        </div>
      </div>
    );
  }

  // ─── Customer View ───
  return (
    <div style={{ fontFamily: T.font }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 20px",
      }}>
        <h1 style={{
          fontSize: 22, fontWeight: 800, color: T.accent, fontFamily: T.font,
          letterSpacing: "-0.03em", margin: 0,
        }}>boolen</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "7px 16px", borderRadius: 10, border: `1px solid ${T.border}`,
            background: T.card, color: T.sub, fontSize: 13, fontWeight: 500,
            cursor: "pointer", fontFamily: T.fontText,
          }}
        >Sign Out</button>
      </div>
      <div style={{ paddingTop: 52 }}>
        <CustomerView
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          customerTab={customerTab}
          setCustomerTab={setCustomerTab}
          closingMode={closingMode}
        />
      </div>
    </div>
  );
}