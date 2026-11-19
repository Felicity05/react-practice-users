# Final mock — Orders (about 45 minutes)

A teammate wrote `OrdersPage.tsx` in a hurry. It has bugs, and every one of them is a mistake from your error log.
Part A is finding and fixing them. Part B adds two features you've only built once.

Keep talking the whole time: say what you see, why it's wrong, and what you'll change.

## Part A — Bug hunt (20 minutes, no AI)

Read `types.ts`, `api.ts` (the comment at the top) and `OrdersPage.tsx` first.
Then work through these bug reports. Each one is what a user or teammate saw, not where the bug is.

1. "With `?scenario=error`, the page says Loading forever." Also add a Retry button.
2. "Prices look wrong. Ben's order says $1299.99, and Ava's says $86.4."
3. "Dates are one day early for me." (Users are in the US.)
4. "The Total column shows the status, and the Status column shows the price."
5. "Sorting does nothing on All, and Newest/Oldest doesn't change the order on any filter."
6. "With the shipped filter, I see 'No orders yet.' under the rows" — and with `?scenario=empty`, two messages show.
7. "Cancel does nothing for Dana Brooks, and there's a red error in the console."
8. "I clicked Ben, then quickly Ava, and the details show Ben."
9. A reviewer's comments, no user report:
   - "Why is the filtered list in state with an effect?"
   - "Why is the error typed `any`?"
   - "The filter dropdown has no label."
   - "`<th>` needs a `<tr>`."

Also say out loud which ones you'd fix first in a real team, and why.

## Part B — Features (20 minutes, AI allowed)

Use AI for boilerplate, then do the 5-step check from section 11 of the study guide.

1. **Optimistic cancel.** Cancel shows "cancelled" immediately. If the server fails (Dana Brooks), put "pending" back and show "Couldn't cancel Dana Brooks."
2. **New order form.** Customer and total (in dollars, like `12.50`).
   - Validate: customer required, total greater than 0. Errors next to the fields; no request if invalid.
   - "Saving..." while saving, and the button disabled.
   - On success, the order appears without reloading and the form clears.
   - Customer `fail`: show the server's message, and keep what the user typed.

## Check it

| Do this | Expect |
| --- | --- |
| `/?scenario=error` | Error and Retry, not Loading forever; Retry shows 7 orders |
| `/?scenario=empty` | Only "No orders yet." |
| Load `/` | Headers match their columns; Ben shows `$1,299.99`; Ava shows `$86.40` and `Nov 3, 2026` |
| All, newest first | Eli Novak (Nov 6) first, Fatima Ali (Oct 30) last |
| Filter pending | Gus Romero, Ava Martinez, Dana Brooks, Fatima Ali |
| Filter pending, then oldest first | Fatima Ali first; the filter stays applied |
| Filter shipped | 2 orders, no empty message |
| Cancel Ava Martinez | "cancelled" right away, and it stays |
| Cancel Dana Brooks | "cancelled", then back to "pending" with a message; nothing red in the console |
| Click Ben, then quickly Ava | Details end on Ava |
| Add "Hana Lee", 12.5 | New row with `$12.50`; the form clears |
| Add with empty customer, or total 0 | Field errors, no request |
| Add customer `fail` | Server message; the form keeps its values |
| `npm run typecheck` | No errors |

## Afterwards (10 minutes)

1. Which bugs did you find without the bug report pointing to them?
2. For bugs 7 and 8, explain the cause in one sentence each, the way you'd say it to the interviewers.
3. Read the error log (study guide, section 12) once more. Then stop coding for the day.
