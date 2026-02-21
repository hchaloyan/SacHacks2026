import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // higher limit for base64 images

// ── Database setup ──────────────────────────────────────────────────────────
const dbPath = join(__dirname, "db.json");
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, {
  menu: [],       // [{ id, name, items: [...] }]  (categories)
  orders: [],     // [{ id, items, total, status, createdAt }]
  hours: {},      // { Monday: { open, close, closed }, ... }
  financials: {}, // { totalRevenue, totalOrders, ... }
});

async function initDb() {
  await db.read();
  // Seed defaults if empty
  if (!db.data.hours || Object.keys(db.data.hours).length === 0) {
    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    db.data.hours = days.reduce((acc, d) => ({
      ...acc,
      [d]: { open: "11:00", close: "21:00", closed: false },
    }), {});
    await db.write();
  }
  if (!db.data.financials || Object.keys(db.data.financials).length === 0) {
    db.data.financials = { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };
    await db.write();
  }
}

// ── Menu routes ──────────────────────────────────────────────────────────────
app.get("/api/menu", async (req, res) => {
  await db.read();
  res.json(db.data.menu);
});

app.put("/api/menu", async (req, res) => {
  await db.read();
  db.data.menu = req.body;
  await db.write();
  res.json({ ok: true });
});

// ── Orders routes ────────────────────────────────────────────────────────────
app.get("/api/orders", async (req, res) => {
  await db.read();
  res.json(db.data.orders);
});

app.post("/api/orders", async (req, res) => {
  await db.read();
  const order = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    status: req.body.status || "pending",
  };
  db.data.orders.unshift(order);
  // Update financials
  db.data.financials.totalOrders += 1;
  db.data.financials.totalRevenue = +(db.data.financials.totalRevenue + (order.total || 0)).toFixed(2);
  db.data.financials.avgOrderValue = +(db.data.financials.totalRevenue / db.data.financials.totalOrders).toFixed(2);
  await db.write();
  res.json(order);
});

app.patch("/api/orders/:id", async (req, res) => {
  await db.read();
  const id = Number(req.params.id);
  const idx = db.data.orders.findIndex(o => o.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.data.orders[idx] = { ...db.data.orders[idx], ...req.body };
  await db.write();
  res.json(db.data.orders[idx]);
});

app.delete("/api/orders/:id", async (req, res) => {
  await db.read();
  const id = Number(req.params.id);
  db.data.orders = db.data.orders.filter(o => o.id !== id);
  await db.write();
  res.json({ ok: true });
});

// ── Business Hours routes ────────────────────────────────────────────────────
app.get("/api/hours", async (req, res) => {
  await db.read();
  res.json(db.data.hours);
});

app.put("/api/hours", async (req, res) => {
  await db.read();
  db.data.hours = req.body;
  await db.write();
  res.json({ ok: true });
});

// ── Financials routes ────────────────────────────────────────────────────────
app.get("/api/financials", async (req, res) => {
  await db.read();
  res.json(db.data.financials);
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});