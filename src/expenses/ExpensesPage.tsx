import React, { useEffect, useState } from "react";
import {deleteExpense, getExpenses} from "./api";
import {CATEGORIES, Expense} from "./types";
import { ExpenseForm } from "./ExpenseForm";

const expenseColumns:string[] = ["Description", "Category", "Amount", "Date",];
const sortOptions = ["newest", "oldest", "amount high->low", "amount low->high"];

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCounter, setRetryCounter] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
      setLoading(true);
      setError("");

    getExpenses()
      .then((data) => {
        setExpenses(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));

  }, [retryCounter]);

  if (loading) return <p>Loading...</p>;

  const handleRetry = () => {
    setRetryCounter((prevState) => prevState + 1);
  };

  if (error) return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleRetry}>Retry</button>
    </div>);

  const filteredExpenses = selectedCategory ? expenses.filter((expense) => expense.category === selectedCategory) : [...expenses];
  const visibleExpenses = filteredExpenses.sort((a, b) => {
          switch(sortOption){
              case "newest":
                  return b.date.localeCompare(a.date);
              case "oldest":
                  return a.date.localeCompare(b.date);
              case "amount high->low":
                  return b.amountCents - a.amountCents;
              case "amount low->high":
                  return a.amountCents - b.amountCents;
              default:
                  return 0;
          }
      });

  const totalExpenses = visibleExpenses.reduce((total, expense) => total + expense.amountCents, 0) / 100;

  const handleDeleteRow = (expense: Expense) => {
      setDeleteError("");

      // Optimistic: remove the row before the server answers
      setExpenses((prev) => prev.filter((e) => e.id !== expense.id));


      deleteExpense(expense.id)
          .catch(() => {
              // Roll back: put the row back
              setExpenses((prev) => [...prev, expense]);
              setDeleteError(`Couldn't delete ${expense.description}.`);
          });
  };

  return (
    <div>
      <h1>Expenses</h1>
        <label htmlFor="category">Category:</label>
        <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All</option>
            {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
            ))}
        </select>
        <label htmlFor="sort">Sort:</label>
        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>

        {expenses.length === 0 && <p>No expenses yet</p>}
        {deleteError && <p role="alert">{deleteError}</p>}
      <table>
          <thead>
              <tr>
                  {expenseColumns.map((column) => (
                      <th key={column}>{column}</th>
                  ))}
              </tr>
          </thead>
        <tbody>
            {expenses.length > 0 && visibleExpenses.length === 0 && <tr><td colSpan={expenseColumns.length}>No expenses in category "{selectedCategory}"</td></tr>}
            {visibleExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.description}</td>
              <td>{expense.category}</td>
              <td>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(expense.amountCents / 100)}</td>
              <td>{new Date(expense.date).toLocaleDateString("en-US",
                  {timeZone: "UTC", month: "short", day: "numeric", year: "numeric"})}</td>
              <td>
                  <button onClick={() => handleDeleteRow(expense)}>Delete item</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Expenses: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalExpenses)}</p>
      <ExpenseForm onCreated={(expense) => setExpenses((previous) => [...previous, expense])} />
    </div>
  );
}
