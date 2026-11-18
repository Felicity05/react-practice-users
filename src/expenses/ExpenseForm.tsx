import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { createExpense } from "./api";
import { CATEGORIES } from "./types";
import type { Category, Expense } from "./types";

export type ExpenseValues = {
  description: string;
  amount: string;
  category: string;
  date: string;
};

export type FieldErrors = Partial<Record<keyof ExpenseValues, string>>;

const emptyValues: ExpenseValues = {
  description: "", amount: "", category: "", date: "",
};

const toCents = (amount: string): number => {
  return Math.round(Number(amount) * 100);
}

export const validate = (values: ExpenseValues): FieldErrors => {
  const errors: FieldErrors = {};
  if (!values.description.trim()) errors.description = "Description is required.";

  if (toCents(values.amount) <= 0) {
    errors.amount = "Enter an amount greater than zero";
  }

  if (!CATEGORIES.some((category) => category === values.category)) {
    errors.category = "Select a category.";
  }

  if (!values.date)  {
    errors.date = "Enter a valid date.";
  }
  return errors;
}

export function ExpenseForm({ onCreated }: { onCreated: (expense: Expense) => void }) {
  const [values, setValues] = useState<ExpenseValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formError, setFormError] = useState("");
  const pending = useRef(false);

  const updateInput = (field: keyof ExpenseValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setFormError("");
    setStatus("idle");
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pending.current) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setFormError("");
    setStatus("idle");

    if (Object.keys(validationErrors).length) return; //if errors return and don't send the request

    pending.current = true;
    setStatus("submitting");
    try {
      const expense = await createExpense({
        description: values.description.trim(),
        amountCents: toCents(values.amount),
        category: values.category as Category,
        date: values.date,
      });
      onCreated(expense); //stores the created expense to pass to the parent component
      setValues(emptyValues); //clears form after successful submit
      setStatus("success");
    } catch (error: unknown) {
      setFormError(error instanceof Error ? error.message : "Unable to save. Please try again.");
      setStatus("idle");
    } finally {
      pending.current = false;
    }
  }

  const setAccessibilityProps = (expenseField: keyof ExpenseValues) => {
    return {
      "aria-invalid": Boolean(errors[expenseField]),
      "aria-describedby": errors[expenseField] ? `expense-${expenseField}-error` : undefined,
    };
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby="add-expense-heading" aria-busy={status === "submitting"}>
      <h2 id="add-expense-heading">Add expense</h2>
      {formError && <p role="alert">{formError}</p>}
      <fieldset disabled={status === "submitting"}>
        <legend>Expense details</legend>
        <label htmlFor="expense-description">Description</label>
        <input id="expense-description" value={values.description} onChange={(event) => updateInput("description", event.target.value)} {...setAccessibilityProps("description")} />
        {errors.description && <p id="expense-description-error">{errors.description}</p>}

        <label htmlFor="expense-amount">Amount (USD)</label>
        <input id="expense-amount" type="number" inputMode="decimal" placeholder="12.50" value={values.amount} onChange={(event) => updateInput("amount", event.target.value)} {...setAccessibilityProps("amount")} />
        {errors.amount && <p id="expense-amount-error">{errors.amount}</p>}

        <label htmlFor="expense-category">Category</label>
        <select id="expense-category" value={values.category} onChange={(event) => updateInput("category", event.target.value)} {...setAccessibilityProps("category")}>
          <option value="">Select a category</option>
          {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        {errors.category && <p id="expense-category-error">{errors.category}</p>}

        <label htmlFor="expense-date">Date</label>
        <input id="expense-date" type="date" value={values.date} onChange={(event) => updateInput("date", event.target.value)} {...setAccessibilityProps("date")} />
        {errors.date && <p id="expense-date-error">{errors.date}</p>}
        <button type="submit">{status === "submitting" ? "Saving..." : "Add expense"}</button>
      </fieldset>
      <p role="status">{status === "submitting" ? "Saving expense..." : status === "success" ? "Expense added." : ""}</p>
    </form>
  );
}
