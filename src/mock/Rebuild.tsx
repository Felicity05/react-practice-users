//1. The debounce effect.
// 2. The fetch effect, with the empty-query guard, active, AbortController, a loading → success/error union, and cleanup.

import {useEffect, useState} from "react";
import {fetchPosts} from "./api";
import {Post} from "./types";

type RequestState =
    | {status: "loading"}
    | {status: "success", data: Post[]}
    | {status: "error", message: string}

function Rebuild() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [requestState, setRequestState] = useState<RequestState>({status: "loading"});

    //use an effect for setting a timeout after each keystroke and clearing the timeout
    // so only the last keystroke fires the timer timeout
    useEffect(() => {
        const timerId = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timerId); //clear the timeout whenever the user presses a keystroke again
    }, [query])

    const isSearchEmpty = debouncedQuery.trim() === "";

    //use an effect to fetch the data
    useEffect(() => {
        if(isSearchEmpty) return; //makes sure no request is made when the search query is empty

        let activeRequest = true; //helps identify active requests. Becomes false when this run is outdated. The callbacks check it before updating state.
        const requestController = new AbortController(); //create a new AbortController instance to handle the request cancellation
        setRequestState({status: "loading"});

        //fetch posts from the api and accepts the debounced query and the signal
        fetchPosts(debouncedQuery, requestController.signal)
            .then((responseData) => { //on success, we update the request state and set the data
                if(activeRequest) {
                    setRequestState({status: "success", data: responseData.posts});
                }
            })
            .catch((error: Error) => { //we catch the error that might occur while fetching the data and set the error message on the request state
                if(activeRequest) {
                    setRequestState({status: "error", message: error.message});
                }
            })

        //cleanup function runs before running the useEffect again, on rerender when one of the effect dependencies changes, and when the component unmounts.
        return() => {
            activeRequest = false;
            requestController.abort();
        }
    }, [debouncedQuery, isSearchEmpty]); //dependencies on which the effect depends on to run again


    return (<></>);
}