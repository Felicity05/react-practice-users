export type Status = "open" | "closed";
export type Priority = "low" | "medium" | "high";

export const PRIORITIES: Priority[] = ["low", "medium", "high"];

/** What the list endpoint returns: no description, to keep the list small. */
export type TicketSummary = {
  id: string;
  title: string;
  customer: string;
  status: Status;
  priority: Priority;
  /** Calendar date in YYYY-MM-DD format. */
  createdAt: string;
};

/** What the details endpoint returns. */
export type Ticket = TicketSummary & {
  description: string;
  customerEmail: string;
};

export type TicketUpdate = Partial<Pick<TicketSummary, "status" | "priority">>;
