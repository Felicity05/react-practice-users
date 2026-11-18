# Code-along mock — Expense Tracker (60 minutes)

You've joined a team, and this is their starter: `ExpensesPage.tsx` already loads and lists expenses.
Work through the features **in priority order**. Get each one working in the browser before you start the next.
You probably won't finish all of them. That's normal; finishing the top ones well matters more.

Use AI the way you would in the interview. Keep talking: say your plan, what you ask AI, and what you change.

## First 5 minutes: explore before you code

Read `types.ts`, `api.ts` (especially the comment at the top) and `ExpensesPage.tsx`. Run the app.
Say out loud what the starter does, how data flows, and anything that looks wrong.

## Features (priority order)

1. **Bug report from a teammate:** "When the server fails, the page says Loading forever."
   Reproduce it with `?scenario=error`, fix it, and add a Retry button. Retry should then succeed.
2. **Readable table.** Add column headers. Show amounts as currency (`8640` → `$86.40`) and dates as `Nov 2, 2026`.
   Make sure the date shown matches the date in the data.
3. **Category filter.** A labeled dropdown with "All" plus each category. Filtering happens in the browser.
4. **Sort.** A labeled dropdown: Newest first (default), Oldest first, Amount high → low, Amount low → high.
5. **Total.** Show the total of the **visible** rows, as currency. It updates when the filter changes.
6. **Empty states.**
   - The server has no expenses (`?scenario=empty`): "No expenses yet."
   - The filter hides everything: "No expenses in <category>."
7. **Add expense.** A form with description, amount (in dollars, like `12.50`), category and date.
   - Validate: description required, amount greater than 0, date required. Show errors next to the fields.
   - While saving, disable the button and show "Saving...".
   - On success, the new row appears **without reloading the list**, and the form clears.
   - Server errors (description `fail`) show a message, and the user keeps what they typed.
8. **Delete with an optimistic update.** A Delete button on each row.
   - The row disappears **immediately**, before the server answers.
   - If the server fails ("Conference ticket" always fails), put the row back and show "Couldn't delete Conference ticket."

## Stretch

- Keep the filter and sort in the URL, so a refresh keeps them.
- Move the data loading into a custom hook, `useExpenses()`.
- Edit an expense's amount inline.

## Check it

| Do this | Expect |
| --- | --- |
| Load `/` | Loading, then 8 rows with headers, currency and readable dates |
| `/?scenario=error` | Error message and Retry (not Loading forever); Retry loads 8 rows |
| `/?scenario=empty` | "No expenses yet." |
| Pick Travel | 2 rows; total $828.00 |
| Pick Food, sort Amount high → low | Team lunch, then Coffee with candidate; total $99.15 |
| Pick a category, then sort | The filter stays applied |
| Add "Taxi", amount 12.5, Travel | New row with $12.50; the total updates |
| Add with an empty description or amount 0 | Field errors, no request |
| Add with description `fail` | Error message; the form keeps its values |
| Delete "Team lunch" | Gone right away and stays gone |
| Delete "Conference ticket" | Disappears, comes back after about 0.5 s, with a message |
| `/?scenario=slow`, then click Add twice fast | Only one expense is added |

## Afterwards (30 minutes)

1. List what you finished, what broke, and what you couldn't explain.
2. Explain the bug from feature 1: what caused it, and why your fix works.
3. Answer: why store money in cents? What can go wrong turning `"12.50"` into cents?
4. Rebuild the weakest part from memory.
