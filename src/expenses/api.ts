// Mock expenses server. Treat it like a real backend: don't edit it during the exercise.
//
// Scenarios — add one to the page URL, e.g. http://localhost:3000/?scenario=error
//   (none)            normal: 8 expenses after 600 ms
//   ?scenario=error   getExpenses fails with HTTP 500 on page load, then succeeds (test Retry)
//   ?scenario=empty   getExpenses returns []
//   ?scenario=slow    every call takes 2500 ms
//
// Deterministic failures:
//   createExpense fails with 422 if the description is "fail"
//   deleteExpense fails with 500 for "Conference ticket" (id "exp_5")

import { Expense, NewExpense } from "./types";

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

let db: Expense[] = [
  { id: "exp_1", description: "Team lunch", amountCents: 8640, category: "Food", date: "2026-11-02" },
  { id: "exp_2", description: "Flight to Austin", amountCents: 32900, category: "Travel", date: "2026-10-28" },
  { id: "exp_3", description: "Figma seat", amountCents: 1500, category: "Software", date: "2026-11-01" },
  { id: "exp_4", description: "Printer paper", amountCents: 2399, category: "Office", date: "2026-10-30" },
  { id: "exp_5", description: "Conference ticket", amountCents: 49900, category: "Travel", date: "2026-11-05" },
  { id: "exp_6", description: "Coffee with candidate", amountCents: 1275, category: "Food", date: "2026-11-04" },
  { id: "exp_7", description: "GitHub Team plan", amountCents: 4000, category: "Software", date: "2026-10-31" },
  { id: "exp_8", description: "Standing desk", amountCents: 54999, category: "Office", date: "2026-10-27" },
];
let nextId = 9;
const pageLoadedAt = Date.now();

export async function getExpenses(): Promise<Expense[]> {
  // Requests started during the first second fail, so Strict Mode's double mount can't hide the bug.
  const startedDuringPageLoad = Date.now() - pageLoadedAt < 1000;
  await delay(600);
  if (scenario === "error" && startedDuringPageLoad) {
    throw new ApiError("Server error while loading expenses", 500);
  }
  if (scenario === "empty") return [];
  return db.map((expense) => ({ ...expense }));
}

export async function createExpense(input: NewExpense): Promise<Expense> {
  await delay(500);
  if (input.description.trim().toLowerCase() === "fail") {
    throw new ApiError("Description was rejected by the server", 422);
  }
  const created: Expense = { ...input, id: `exp_${nextId++}` };
  db = [...db, created];
  return { ...created };
}

export async function deleteExpense(id: string): Promise<void> {
  await delay(500);
  if (id === "exp_5") {
    throw new ApiError("Could not delete this expense", 500);
  }
  db = db.filter((expense) => expense.id !== id);
}
