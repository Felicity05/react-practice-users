# Four-day React + TypeScript interview preparation

**Time:** 8 focused hours per day, plus breaks. **Target:** a mid-level React interview with AI assistance allowed.

This plan targets gaps observed in your mock interviews: state and rendering, effect lifecycle, asynchronous requests, cleanup, and explaining behavior precisely. It cannot guarantee an interview pass. Adapt the final day if your interview happens that day.

## How to practice

1. Explain your approach and attempt the core logic yourself, then use AI as permitted in your actual interview. During timed mocks, practice that same AI-assisted workflow.
2. Predict the behavior before running it.
3. Run it and verify specific outcomes.
4. Explain your implementation aloud.
5. Record mistakes, then rebuild the difficult part from memory later.

Use the videos below instead of long reading blocks; documentation remains an optional reference. Watch one concept, pause to predict the behavior, close the video, and implement it from memory. Review AI-generated code, test it, and explain every part you accept.

Use 50–60 minute blocks with breaks. Scheduled hours below are focused work, excluding meals and breaks. Protect sleep; extra hours should be light review rather than exhausted coding.

## Day 1 — State, rendering, and synchronous UI

| Duration | Work |
| --- | --- |
| 2 hours | Watch the Day 1 videos below, code along briefly, then complete selected state challenges without copying solutions. |
| 2 hours | Rebuild the synchronous User Directory from scratch using Exercise A. |
| 1 hour | Practice array operations, immutability, closures, and promises. Predict outputs before running examples. |
| 1 hour | Practice TypeScript unions, props, callbacks, and narrowing with Exercise B. |
| 2 hours | Run a 45-minute directory mock; review mistakes and rebuild the weakest part without notes. |

### Day 1 videos — watch, then build

| Video | Follow-up exercise |
| --- | --- |
| [Learn useState in 15 Minutes — Web Dev Simplified](https://www.youtube.com/watch?v=O6P86uwfdR0) | Build a controlled input and a counter. Compare three direct increments with three functional updates; explain the results. |
| [JavaScript Promises in 10 Minutes — Web Dev Simplified](https://www.youtube.com/watch?v=DHvZLI7Db8E) | Create deterministic successful and failing promises; predict the order of `then`, `catch`, and `finally`. |

Keep most of this block for hands-on work rather than replaying videos.

### Linked exercises and resources

- [State as a Snapshot — lesson and challenge](https://react.dev/learn/state-as-a-snapshot): explain what a delayed callback sees after state changes.
- [Choosing the State Structure — lesson and challenges](https://react.dev/learn/choosing-the-state-structure): practice removing redundant state.
- [Queueing a Series of State Updates — lesson and challenges](https://react.dev/learn/queueing-a-series-of-state-updates): compare direct setters with functional updates.
- [Preserving and Resetting State — lesson and challenges](https://react.dev/learn/preserving-and-resetting-state): connect state identity to positions and keys.
- [TypeScript narrowing playground example](https://www.typescriptlang.org/play/typescript/language/type-widening-and-narrowing.ts.html): edit the example, predict which operations are allowed, then inspect compiler feedback.
- [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises): trace success, rejection, and chained handlers.

### Exercise A — Build a User Directory

- [ ] Render name, role, and email in cards.
- [ ] Implement controlled, case-insensitive name search.
- [ ] Derive unique role options from the source data.
- [ ] Combine search and role filtering.
- [ ] Sort A–Z and Z–A without mutating the source array.
- [ ] Expand each card independently using a button and `aria-expanded`.
- [ ] Show an empty state when filters return no matches.
- [ ] Use stable user IDs as keys.

Verify: searching `a` and selecting Engineer returns Anna and Carlos; descending puts Carlos first. Expand Anna, then sort: Anna should remain expanded. Filter Anna out and restore her: explain why her local expansion state resets.

### Exercise B — Type the UI precisely

In the [TypeScript Playground](https://www.typescriptlang.org/play/):

- Define `SortDirection = "asc" | "desc"`.
- Define a user type and typed card props, including a callback that receives a user ID.
- Write a function accepting `unknown` and returning a useful error message without `any`.
- Model a request with a discriminated union for loading, success with data, and error with a message.
- Deliberately access data before narrowing the request status; explain the compiler error.

### Day 1 checkpoint

Explain without notes: state snapshots, derived values versus state, local versus parent state, functional updates, and stable keys.

## Day 2 — Requests, effects, retry, and cleanup

| Duration | Work |
| --- | --- |
| 2 hours | Watch the Day 2 videos, practice setup/cleanup logging, and use the React references for Strict Mode and dependency questions. |
| 2 hours | Complete Exercise C1: fetch real users from DummyJSON, adapt the response, and implement loading/error/retry UI. |
| 1 hour | Implement cleanup and explain why every asynchronous state update needs protection. |
| 1 hour | Force responses to arrive out of order; verify old successes and failures are ignored. |
| 2 hours | Run a 45-minute async mock, review it, and rebuild the request lifecycle from memory. |

### Linked exercises and resources

- [Synchronizing with Effects — lesson and challenges](https://react.dev/learn/synchronizing-with-effects).
- [Fetching data and cleanup](https://react.dev/learn/synchronizing-with-effects#fetching-data).
- [Lifecycle of Reactive Effects — lesson and challenges](https://react.dev/learn/lifecycle-of-reactive-effects).
- [You Might Not Need an Effect — lesson and challenges](https://react.dev/learn/you-might-not-need-an-effect): distinguish derived calculations and event handling from synchronization.
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController): understand cancellation for APIs that support it.

### Day 2 videos — highest priority

| Video | Follow-up exercise |
| --- | --- |
| [Learn useEffect in 13 Minutes — Web Dev Simplified](https://www.youtube.com/watch?v=0ZJgIjIuY7U) | Log setup and cleanup. Change a dependency, unmount, and explain the sequence. |
| [Mastering useEffect: Avoid Race Conditions — Jack Herrington](https://www.youtube.com/watch?v=fXD9Ct03Q6k) | Make A finish after B. Ensure old successes, failures, and finalization callbacks cannot overwrite the current UI. |

The short race-condition video is a supplement, not a replacement for implementing and tracing cleanup yourself.

### Exercise C1 — Fetch from a real API (2 hours)

**Free practice API:** [DummyJSON users documentation](https://dummyjson.com/docs/users). Use its public users endpoint:

```text
https://dummyjson.com/users?limit=20
```

No API key is needed for this public endpoint. This is a real HTTP request serving fake practice data. The response is an object containing `users`, `total`, `skip`, and `limit`, rather than a bare array. See the [general documentation](https://dummyjson.com/docs) for response delays and other testing features.

**First 30 minutes — inspect and adapt**

- [ ] Inspect the response in the browser Network panel.
- [ ] Define the API response type separately from your UI user type.
- [ ] Map `firstName` and `lastName` to your displayed name, retaining ID and email.
- [ ] Use the API's `role` values and derive your dropdown from fetched users. Update your old Engineer/Designer/Manager union to match the API rather than pretending those roles exist in the response.
- [ ] Choose real returned fields, such as phone or company information, for expandable details.

**Next 60 minutes — implement**

- [ ] Fetch on mount using `fetch()` and `async`/`await` or a promise chain.
- [ ] Check `response.ok`; throw a useful error for non-success HTTP statuses.
- [ ] Parse JSON and extract `data.users`.
- [ ] Implement loading, error, Retry, and successful rendering.
- [ ] Keep search, role filtering, sorting, and details working.
- [ ] Add effect cleanup using an `AbortController` and/or an effect-local active flag. Treat cleanup cancellation differently from a user-visible failure and protect every asynchronous state update.
- [ ] Explain that TypeScript annotations do not validate network data at runtime. Identify where validation would belong; a validation library is not required for this exercise.

**Final 30 minutes — verify**

- [ ] Test normal success and use browser network throttling to observe loading.
- [ ] Set DevTools to Offline for a network failure; restore the network and click Retry.
- [ ] Use a deterministic mocked HTTP 500 response to verify the `response.ok` branch. Offline mode alone does not test HTTP error handling.
- [ ] Supply a controlled empty response to test API-empty UI; don't rely on external data disappearing.
- [ ] Unmount during a pending request and confirm obsolete callbacks cannot affect current UI.
- [ ] Explain: `fetch()` generally rejects for network failures or cancellation, but a 404/500 response requires an explicit status check.

Use mocks for repeatable failures, empty data, and response ordering. Keep at least one manual successful request against the real API.

### Exercise C — Async User Directory checklist

- [ ] Load users on mount.
- [ ] Show loading immediately, without an initial empty-state flash.
- [ ] Display errors and support user-triggered retry.
- [ ] Clear the previous error at the start of each attempt.
- [ ] Derive cards and role options from fetched data.
- [ ] Distinguish an empty API response from no filter matches.
- [ ] Ignore obsolete results after cleanup, including error and finalization callbacks.
- [ ] Preserve filter selections during retry.

Use deterministic scenarios rather than randomness: success after 800 ms, failure after 800 ms, empty success, and first-attempt failure followed by success.

Then create a deliberate overlapping-request scenario using a refresh control or a changing request parameter:

1. A starts first and takes 2 seconds; B starts second and takes 200 ms.
2. B succeeds, then A fails. B's successful UI must remain.
3. B fails, then A succeeds. B's error must remain.
4. Unmount before completion; the obsolete callbacks must not update component state.

The current request owns the UI. Cleanup does not select the successful response, reset all state, or automatically retry. Ignoring a response does not cancel its underlying request.

### Day 2 checkpoint

Draw and explain: mount → pending → success/failure → retry → cleanup. Explain that cleanup runs on unmount and before an effect reruns because dependencies changed. In development Strict Mode, also expect an extra setup/cleanup cycle.

## Day 3 — Behavioral testing and independent delivery

| Duration | Work |
| --- | --- |
| 1 hour | Watch selected lessons from the Day 3 testing series and practice asynchronous queries. |
| 2 hours | Write the behavioral tests in Exercise D. |
| 1 hour | Review labels, semantic buttons, keyboard operation, and expansion accessibility. |
| 1 hour | Review unions, narrowing, nullable state, and typed events. |
| 1 hour | Explain your design aloud and answer the question bank below. |
| 2 hours | Complete a fresh 60-minute mock and spend an hour reviewing and fixing it. |

### Linked exercises and resources

- [React Testing Library: worked example](https://testing-library.com/docs/react-testing-library/example-intro/): reproduce the example, then adapt the pattern to your directory.
- [Testing Library: asynchronous utilities](https://testing-library.com/docs/dom-testing-library/api-async/): practice waiting for UI outcomes.
- [Testing Library: query priorities](https://testing-library.com/docs/queries/about/#priority): select controls by role and accessible name.
- [TypeScript: narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html): revisit discriminated unions and `unknown`.
- [WAI: disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/): compare your details toggle with the accessible interaction pattern.

### Day 3 videos — testing

Use [Codevolution’s React Testing tutorial series](https://www.youtube.com/playlist?list=PLC3y8-rFHvwirqe1KHFCHJ0RqNuN61SJd). Select lessons on rendering, queries by role, user interactions, and asynchronous testing. Limit viewing to the scheduled hour; do not try to complete the entire playlist.

After each relevant lesson, write one test against your own directory. Adapt setup to the existing project instead of spending the day migrating test tools.

### Exercise D — Test behavior

- [ ] Loading appears before results.
- [ ] A successful request displays user cards.
- [ ] A failed request displays an error and Retry.
- [ ] Retry transitions from error to loading to success.
- [ ] An empty response displays the API-empty message.
- [ ] Combined filters with no matches display the filtered-empty message.
- [ ] Search ignores case; role selection and sorting combine correctly.
- [ ] Expansion remains attached to the right user after sorting.
- [ ] An older response cannot overwrite the newer request's UI.

Prefer assertions about visible outcomes and controls rather than internal state variables. Use controllable mock requests for response ordering.

### Fresh mock — Product Browser

In 60 minutes, build a React + TypeScript product browser with asynchronous loading, error/retry, name search, category filter, price sorting, expandable details, and distinct empty states. Protect against obsolete responses. Use AI as allowed in your interview. Before accepting its code, inspect it, verify the behavior, and explain the decisions yourself. Record where AI helped and any errors you caught.

Afterward, record incomplete requirements, incorrect explanations, untested cases, and time spent debugging. Rebuild the weakest part.

## Day 4 — Interview rehearsal

| Duration | Work |
| --- | --- |
| 1 hour | Review your error log; rebuild cleanup and explain every line. |
| 2 hours | Complete a 60-minute mock and review it for an hour. |
| 1 hour | Fix the specific gaps exposed by that mock. |
| 1 hour | Prepare three real experience stories: difficult bug, technical tradeoff, and collaboration challenge. |
| 1 hour | Practice concise technical explanations, testing strategy, and debugging an unfamiliar failure. |
| 1 hour | Complete a final 30-minute exercise and review it for 30 minutes. |
| 1 hour | Light review, environment checks, and questions for your interviewer. |

If the interview is on this day, move heavy practice earlier and keep the final hours light.

### Final 30-minute exercise

Given a component that fetches results when a search query changes:

- [ ] Identify redundant state and lifecycle bugs.
- [ ] Prevent an old request from replacing the current results.
- [ ] Support loading, error, and empty UI.
- [ ] Type the response and error handling.
- [ ] Verify a slow old failure cannot hide newer successful results.
- [ ] Explain remaining tradeoffs and how you would test them.

### Experience stories

For each story, cover the situation, your responsibility, the decisions you personally made, alternatives considered, and the outcome. Use real examples and evidence; do not invent metrics.

## Technical question bank

Answer aloud in approximately 60–90 seconds each, then handle a follow-up.

1. Why doesn't a state setter change the variable inside the current handler?
2. What belongs in state, and what should be calculated during rendering?
3. When would you use a functional state updater?
4. How do you decide where state should live?
5. How do keys affect state when a list is reordered? What happens after removal and remounting?
6. When does effect cleanup run? How is that different from resetting state?
7. What does the extra development Strict Mode effect cycle help expose?
8. How can an old rejection overwrite newer successful UI?
9. Why must an obsolete request's `finally` handler also be guarded?
10. What is the difference between ignoring a response and aborting a request?
11. How would you avoid conflicting request states?
12. How would you test loading, retry, and out-of-order responses deterministically?
13. Why use `unknown` instead of `any` for an untrusted error?
14. Why is a details toggle a button, and what does `aria-expanded` communicate?

## Error log

| Mistake | Correct understanding | Exercise to prove it |
| --- | --- | --- |
| Retry remounts the component | Retry can start another request while the component stays mounted | Retry while preserving search text |
| Cleanup resets state | Cleanup stops or invalidates work started by its effect | Unmount while a request is pending |
| Keep whichever response succeeds | Only the current request may update the UI | Make an older success arrive last |
| State changes immediately in the current handler | A render's state values are snapshots | Predict a delayed callback's output |
| Filtering needs its own state | Filtered results can be derived from data and controls | Rebuild filters using only source and selection state |

Add your own mistakes after each practice session.

## Interview execution checklist

1. Clarify behavior and edge cases before coding.
2. Explain state ownership and request transitions.
3. Implement a working vertical slice, then add requirements in order.
4. Narrate decisions rather than every keystroke.
5. Verify concrete inputs and expected outputs.
6. Reserve time for failures, empty states, accessibility, and cleanup.
7. State honestly what you did and did not test.

## Readiness checkpoint

- [ ] Complete the async directory in 45–60 minutes using the AI access permitted in the interview, while owning the implementation and verification.
- [ ] Fetch and adapt a real API response; distinguish network failures from HTTP errors.
- [ ] Explain the state and effect lifecycle accurately without memorized wording.
- [ ] Demonstrate success, failure, retry, both empty states, and obsolete-response protection.
- [ ] Write meaningful behavioral tests.
- [ ] Explain tradeoffs and identify remaining limitations.
- [ ] Tell three clear stories about your own engineering work.

Prioritize understanding, verification, and precise explanations over adding libraries or memorizing trivia. On Day 4, spend most of your time implementing and explaining rather than watching more videos.
