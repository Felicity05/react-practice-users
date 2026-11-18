// Mock support-ticket server. Treat it like a real backend: don't edit it during the exercise.
//
// Scenarios — add one to the page URL, e.g. http://localhost:3000/?scenario=error
//   (none)            normal: 12 tickets after 500 ms
//   ?scenario=error   getTickets fails with HTTP 500 on page load, then succeeds (test Retry)
//   ?scenario=empty   getTickets returns []
//   ?scenario=slow    every call takes 2500 ms
//
// Deterministic behavior:
//   getTicket("t_2")  is slow (1500 ms); every other ticket takes 300 ms
//   getTicket("t_12") fails with 500
//   updateTicket("t_8") always fails with 500 ("Charged twice")

import { Ticket, TicketSummary, TicketUpdate } from "./types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const scenario = new URLSearchParams(window.location.search).get("scenario");
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, scenario === "slow" ? 2500 : ms));

let db: Ticket[] = [
  { id: "t_1", title: "Can't reset password", customer: "Acme", status: "open", priority: "high", createdAt: "2026-11-12", customerEmail: "it@acme.test", description: "The reset email never arrives. Checked spam." },
  { id: "t_2", title: "Invoice shows wrong total", customer: "Globex", status: "open", priority: "medium", createdAt: "2026-11-11", customerEmail: "billing@globex.test", description: "November invoice adds tax twice." },
  { id: "t_3", title: "Export to CSV fails", customer: "Initech", status: "closed", priority: "low", createdAt: "2026-11-10", customerEmail: "ops@initech.test", description: "Exports over 10k rows time out." },
  { id: "t_4", title: "Login page is slow", customer: "Acme", status: "open", priority: "medium", createdAt: "2026-11-09", customerEmail: "it@acme.test", description: "Takes 8 seconds to load in the morning." },
  { id: "t_5", title: "Add dark mode", customer: "Umbrella", status: "closed", priority: "low", createdAt: "2026-11-08", customerEmail: "design@umbrella.test", description: "Feature request from the design team." },
  { id: "t_6", title: "Webhook not firing", customer: "Globex", status: "open", priority: "high", createdAt: "2026-11-07", customerEmail: "dev@globex.test", description: "order.created stopped firing on Nov 6." },
  { id: "t_7", title: "Typo on pricing page", customer: "Initech", status: "closed", priority: "low", createdAt: "2026-11-06", customerEmail: "ops@initech.test", description: "\"Anual\" should be \"Annual\"." },
  { id: "t_8", title: "Charged twice", customer: "Umbrella", status: "open", priority: "high", createdAt: "2026-11-05", customerEmail: "finance@umbrella.test", description: "Two charges for the same order." },
  { id: "t_9", title: "SSO setup help", customer: "Acme", status: "open", priority: "low", createdAt: "2026-11-04", customerEmail: "it@acme.test", description: "Need help configuring Okta." },
  { id: "t_10", title: "API rate limit too low", customer: "Globex", status: "closed", priority: "medium", createdAt: "2026-11-03", customerEmail: "dev@globex.test", description: "Hitting 429s during nightly sync." },
  { id: "t_11", title: "Mobile layout broken", customer: "Initech", status: "open", priority: "medium", createdAt: "2026-11-02", customerEmail: "ops@initech.test", description: "Sidebar covers content on iPhone." },
  { id: "t_12", title: "Delete my account", customer: "Umbrella", status: "open", priority: "low", createdAt: "2026-11-01", customerEmail: "admin@umbrella.test", description: "Please remove all of our data." },
];
const pageLoadedAt = Date.now();

const toSummary = ({ description, customerEmail, ...summary }: Ticket): TicketSummary => summary;

/** Newest first. */
export async function getTickets(): Promise<TicketSummary[]> {
  // Requests started during the first second fail, so Strict Mode's double mount can't hide the error path.
  const startedDuringPageLoad = Date.now() - pageLoadedAt < 1000;
  await delay(500);
  if (scenario === "error" && startedDuringPageLoad) {
    throw new ApiError("Server error while loading tickets", 500);
  }
  if (scenario === "empty") return [];
  return db.map(toSummary);
}

export async function getTicket(id: string): Promise<Ticket> {
  await delay(id === "t_2" ? 1500 : 300);
  if (id === "t_12") throw new ApiError("Could not load this ticket", 500);
  const ticket = db.find((t) => t.id === id);
  if (!ticket) throw new ApiError("Ticket not found", 404);
  return { ...ticket };
}

export async function updateTicket(id: string, update: TicketUpdate): Promise<TicketSummary> {
  await delay(400);
  if (id === "t_8") throw new ApiError("Could not update this ticket", 500);
  const index = db.findIndex((t) => t.id === id);
  if (index === -1) throw new ApiError("Ticket not found", 404);
  db = db.map((t) => (t.id === id ? { ...t, ...update } : t));
  return toSummary(db[index]);
}
