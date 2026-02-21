const BASE = "http://localhost:4000/api";

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${method} ${path} failed: ${res.status}`);
  return res.json();
}

export const api = {
  // Menu
  getMenu: ()             => req("GET",  "/menu"),
  saveMenu: (menu)        => req("PUT",  "/menu", menu),

  // Orders
  getOrders: ()           => req("GET",  "/orders"),
  createOrder: (order)    => req("POST", "/orders", order),
  updateOrder: (id, data) => req("PATCH",`/orders/${id}`, data),
  deleteOrder: (id)       => req("DELETE",`/orders/${id}`),

  // Business Hours
  getHours: ()            => req("GET",  "/hours"),
  saveHours: (hours)      => req("PUT",  "/hours", hours),

  // Financials
  getFinancials: ()       => req("GET",  "/financials"),
};
