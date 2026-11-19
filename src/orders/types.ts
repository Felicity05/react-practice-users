export type OrderStatus = "pending" | "shipped" | "cancelled";

export const STATUSES: OrderStatus[] = ["pending", "shipped", "cancelled"];

/** What the list endpoint returns. */
export type OrderSummary = {
  id: string;
  customer: string;
  /** Stored in cents: 8640 means $86.40. */
  totalCents: number;
  status: OrderStatus;
  /** Calendar date in YYYY-MM-DD format. */
  date: string;
};

/** What the details endpoint returns. */
export type Order = OrderSummary & {
  items: string[];
  shippingAddress: string;
};

export type NewOrder = Pick<OrderSummary, "customer" | "totalCents">;
