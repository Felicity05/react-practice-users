// Async mock: build Post Search here. Requirements are in src/mock/EXERCISE.md.

import React, {useEffect, useState} from "react";
import {fetchPosts} from "./api";
import {Post} from "./types";
import PostCard from "./PostCard";
import {getErrorMessage} from "../errors";

type RequestState =
  | {state: 'loading'}
  | {state: 'success', posts: Post[]}
  | {state: 'error', message: string}

export function PostSearch() {
  const [requestState, setRequestState] = useState<RequestState>({state: 'loading'});
  const [retryCount, setRetryCount] = useState(0);

  //debounce cancels the previous timer when the user types again, so only the last keystroke's timer fires
  //the usual React pattern is to use two pieces of state and an effect with a cleanup
  const [query, setQuery] = useState("");                   // updates on every keystroke
  const [debouncedQuery, setDebouncedQuery] = useState(""); // updates 300 ms after typing stops

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeoutId);   // each keystroke cancels the previous timer
  }, [query]);

  const emptySearch = debouncedQuery.trim() === "";

  useEffect(() => {
    if (emptySearch) return;

    let active = true;
    const controller = new AbortController();

    setRequestState({state: 'loading'});

    fetchPosts(debouncedQuery, controller.signal)
        .then(data => {
          if (active) {
            setRequestState({state: 'success', posts: data.posts});
          }
        })
        .catch((error: unknown) => {
          if (active) {
            setRequestState({state: 'error', message: getErrorMessage(error)});
          }
        });

    // cleanup already makes sure the result matches the current search
    return () => {
      active = false;
      controller.abort();
    }
  }, [debouncedQuery, retryCount, emptySearch]);

  return (
      <div>
        <label htmlFor="search">Search posts</label>
        <input id="search" value={query} type="text" placeholder="Search posts..." onChange={(e) => setQuery(e.target.value)}/>
        <p>Searching for: {debouncedQuery}</p>

        {emptySearch && <p>Enter a search term to start searching</p>}

        {!emptySearch && requestState.state === 'loading' && <p>Loading...</p> }

        {!emptySearch && requestState.state === 'error' && (
            <div>
                <p>Error: {requestState.message}</p>
                <button onClick={() => setRetryCount((prevCount) => prevCount + 1)}>Try again</button>
            </div>
        )}

        {!emptySearch && requestState.state === 'success' && (requestState.posts.length === 0 ?
          <p>No posts matched "{debouncedQuery}" </p>
            : <div>
                {requestState.posts.map((post) => <PostCard key={post.id} post={post}/>)}
              </div>)}
      </div>
  );
}
