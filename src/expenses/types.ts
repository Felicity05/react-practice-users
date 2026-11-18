export type Category = "Food" | "Travel" | "Office" | "Software";

export const CATEGORIES: Category[] = ["Food", "Travel", "Office", "Software"];

export type Expense = {
  id: string;
  description: string;
  /** Stored in cents to avoid floating-point rounding: 1250 means $12.50. */
  amountCents: number;
  category: Category;
  /** Calendar date in YYYY-MM-DD format. */
  date: string;
};

export type NewExpense = Omit<Expense, "id">;
