// Mock orders server. Treat it like a real backend: don't edit it during the exercise.
//
// Scenarios — add one to the page URL, e.g. http://localhost:3000/?scenario=error
//   (none)            normal: 7 orders after 500 ms
//   ?scenario=error   getOrders fails with HTTP 500 on page load, then succeeds (test Retry)
//   ?scenario=empty   getOrders returns []
//
// Deterministic behavior:
//   getOrder("o_2")   is slow (1500 ms); every other order takes 300 ms
//   updateOrder("o_4") always fails with 500 (Dana Brooks)
//   createOrder fails with 422 if the customer is "fail"

import { NewOrder, Order, OrderStatus, OrderSummary } from "./types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const scenario = new URLSearchParams(window.location.search).get("scenario");
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let db: Order[] = [
  { id: "o_1", customer: "Ava Martinez", totalCents: 8640, status: "pending", date: "2026-11-03", items: ["Desk lamp", "Notebook"], shippingAddress: "12 Pine St, Austin TX" },
  { id: "o_2", customer: "Ben Okafor", totalCents: 129999, status: "shipped", date: "2026-11-01", items: ["Laptop stand", "Monitor"], shippingAddress: "88 Lake Ave, Denver CO" },
  { id: "o_3", customer: "Chloe Kim", totalCents: 1500, status: "cancelled", date: "2026-11-05", items: ["Stickers"], shippingAddress: "5 Elm Rd, Portland OR" },
  { id: "o_4", customer: "Dana Brooks", totalCents: 24900, status: "pending", date: "2026-11-02", items: ["Office chair"], shippingAddress: "301 Oak Blvd, Miami FL" },
  { id: "o_5", customer: "Eli Novak", totalCents: 4275, status: "shipped", date: "2026-11-06", items: ["Mouse", "Mouse pad"], shippingAddress: "9 Birch Ln, Seattle WA" },
  { id: "o_6", customer: "Fatima Ali", totalCents: 60000, status: "pending", date: "2026-10-30", items: ["Standing desk"], shippingAddress: "47 Cedar Ct, Chicago IL" },
  { id: "o_7", customer: "Gus Romero", totalCents: 999, status: "pending", date: "2026-11-04", items: ["USB cable"], shippingAddress: "2 Maple Dr, Boston MA" },
];
let nextId = 8;
const pageLoadedAt = Date.now();

const toSummary = ({ items, shippingAddress, ...summary }: Order): OrderSummary => summary;

export async function getOrders(): Promise<OrderSummary[]> {
  // Requests started during the first second fail, so Strict Mode's double mount can't hide the error path.
  const startedDuringPageLoad = Date.now() - pageLoadedAt < 1000;
  await delay(500);
  if (scenario === "error" && startedDuringPageLoad) {
    throw new ApiError("Server error while loading orders", 500);
  }
  if (scenario === "empty") return [];
  return db.map(toSummary);
}

export async function getOrder(id: string): Promise<Order> {
  await delay(id === "o_2" ? 1500 : 300);
  const order = db.find((o) => o.id === id);
  if (!order) throw new ApiError("Order not found", 404);
  return { ...order, items: [...order.items] };
}

export async function updateOrder(id: string, update: { status: OrderStatus }): Promise<OrderSummary> {
  await delay(400);
  if (id === "o_4") throw new ApiError("Could not update this order", 500);
  db = db.map((o) => (o.id === id ? { ...o, ...update } : o));
  return toSummary(db.find((o) => o.id === id)!);
}

export async function createOrder(input: NewOrder): Promise<OrderSummary> {
  await delay(500);
  if (input.customer.trim().toLowerCase() === "fail") {
    throw new ApiError("Customer was rejected by the server", 422);
  }
  const created: Order = {
    ...input,
    id: `o_${nextId++}`,
    status: "pending",
    date: "2026-11-19",
    items: [],
    shippingAddress: "",
  };
  db = [...db, created];
  return toSummary(created);
}
