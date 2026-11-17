# Async mock — Post Search (45 minutes)

Build `PostSearch` in `PostSearch.tsx`, from scratch. Don't copy from `UserList.tsx` or `dummyApi.ts`; write it from memory.
Use AI the way you'd use it in the interview: small asks, and explain every line you keep.

Work in priority order. Get each feature working in the browser before starting the next.
Say your plan out loud first: the state you need, its type, and when the request runs.

## API (DummyJSON, no key needed)

| Purpose | URL |
| --- | --- |
| Search posts | `https://dummyjson.com/posts/search?q=<text>` |
| Slow response | add `&delay=2000` |
| HTTP 500 | `https://dummyjson.com/http/500` |

The response is an object: `{ posts, total, skip, limit }`.
Each post has `id`, `title`, `body`, `tags` (string array), `reactions` (`{ likes, dislikes }`) and `views`.
Open a search URL in the browser first and write your types from what you see.

## Features (priority order)

1. **Search box.** A labeled text input. Searching starts as the user types (no submit button).
2. **Fetch results.** Request the search URL with the current text (encode it with `encodeURIComponent`). Show each post's title and tags.
3. **Request states.** Show "Loading..." while a request runs, then results or an error. Model this with a discriminated union.
4. **Debounce.** Wait 300 ms after the user stops typing before requesting. Typing "react" quickly makes one request, not five.
5. **No stale results.** An older, slower response must never replace a newer one. Cancel or ignore obsolete requests, including their errors.
6. **Two empty states.**
   - Empty search box: "Type to search posts" (no request at all).
   - Search returned 0 posts: "No posts match "<text>"".
7. **Error and retry.** On failure, show the message and a Retry button that repeats the same search. Keep the search text.
8. **Expand a post.** A button on each post shows its body. Use `aria-expanded`. Expanded state belongs to that post.

## Stretch (only if time remains)

- Show "17 results" from `total`.
- Highlight posts with more than 1,000 likes.
- Move the request into a custom hook, such as `usePostSearch(query)`.

## Check it

| Do this | Expect |
| --- | --- |
| Load the page | "Type to search posts", no request in the Network tab |
| Type "love" quickly | One request after you stop typing; 17 posts |
| Type "zzzqqq" | "No posts match "zzzqqq"" |
| Clear the box | Back to "Type to search posts" |
| Temporarily point the request at `/http/500` | Error message and Retry; the search text stays |
| Add `&delay=2000` to one query only, then quickly type a different one | The newer search's results stay on screen |
| Expand a post, then change the search and come back | Explain what happens to its expanded state and why |

## Afterwards (review, about 15 minutes)

Write down: which features you finished, what broke, and anything you couldn't explain.
Then rebuild the request lifecycle (effect + cleanup) once more from memory.
