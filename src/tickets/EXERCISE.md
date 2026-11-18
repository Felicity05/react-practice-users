# Code-along mock 2 — Support Tickets (60 minutes)

You've joined a support-tools team. `TicketsPage.tsx` already loads and lists tickets.
Work through the features **in priority order**. Get each one working in the browser before you start the next.
You probably won't finish all of them. Finishing the top ones well matters more.

Use AI from the start for boilerplate, then check what it wrote (study guide, section 11). Keep talking.

## First 5 minutes: explore before you code

Read `types.ts`, `api.ts` (especially the comment at the top) and `TicketsPage.tsx`. Run the app.
Say out loud what the starter does, how data flows, and anything that looks wrong.
Notice there are two ticket types. Say why.

## Features (priority order)

1. **Bug report from a teammate:** "Clicking Close does nothing. The ticket only changes after I click something else."
   Find the cause and fix it. If the server fails (try closing "Charged twice"), show "Couldn't update Charged twice."
   instead of an unhandled error in the console.
2. **Status tabs.** Buttons for All, Open and Closed, each with a count: `All (12)`, `Open (8)`, `Closed (4)`.
   The current tab is visually marked and has `aria-pressed`. Counts update when a ticket is closed.
3. **Search.** A labeled input that matches the title **or** the customer, ignoring case. It combines with the tab.
   Empty states: server has none (`?scenario=empty`) → "No tickets yet."; nothing matches → `No tickets match "xyz".`
4. **Pagination.** 5 tickets per page, Previous / Next buttons disabled at the ends, and "Page 1 of 3".
   Changing the tab or the search goes back to page 1.
5. **Details panel.** Clicking a ticket title loads it with `getTicket(id)` and shows the description and customer email.
   - Show "Loading..." in the panel while it loads, and an error if it fails ("Delete my account" always fails).
   - Click "Invoice shows wrong total" (slow), then quickly another ticket. The panel must show the **last** one clicked.
6. **Change priority inline with an optimistic update.** A priority dropdown on each row.
   - The row updates **immediately**.
   - If the server fails ("Charged twice"), put the old priority back and show "Couldn't update Charged twice."
7. **Bulk close.** A checkbox on each row, "Select all on this page", and a "Close selected (n)" button.
   - Close all selected tickets in parallel. Report partial failures: "Closed 4. Couldn't close Charged twice."
   - Successful tickets leave the selection; failed ones stay selected.

## Stretch

- Keep the tab, search and page in the URL, so a refresh keeps them.
- Sort by priority (high → low), with newest first inside each priority.
- Move loading into a custom hook, `useTickets()`.

## Check it

| Do this | Expect |
| --- | --- |
| Load `/` | Loading, then 5 tickets, "Page 1 of 3" |
| `/?scenario=empty` | "No tickets yet." |
| Close "Can't reset password" | Changes right away; `Open (7)`, `Closed (5)` |
| Close "Charged twice" | Message, ticket stays open, no red error in the console |
| Open tab | 8 tickets over 2 pages |
| Search `acme` | Can't reset password, Login page is slow, SSO setup help |
| Search `PAGE` on the Open tab | Only "Login page is slow" |
| Go to page 3 of All, then click Open | Page 1 of 2, not an empty page |
| Click "Invoice shows wrong total", then quickly "Login page is slow" | Panel ends on "Login page is slow" |
| Click "Delete my account" | Error in the panel, the list still works |
| Set "Charged twice" priority to low | Shows low, then goes back to high with a message |
| On the Open tab, page 1: Select all, then Close selected | "Closed 4. Couldn't close Charged twice."; it stays selected |

## Afterwards (30 minutes)

1. List what you finished, what broke, and what you couldn't explain.
2. Explain the bug from feature 1: why didn't React re-render?
3. Explain how you kept the details panel from showing the wrong ticket.
4. Why does `getTickets` return `TicketSummary` instead of `Ticket`?
5. Rebuild the weakest part from memory.
