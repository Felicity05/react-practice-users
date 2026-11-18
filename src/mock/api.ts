import {PostResponse} from "./types";

export const fetchPosts = async (query: string, signal?: AbortSignal): Promise<PostResponse> => {
    const url = 'https://dummyjson.com/posts/search?q='

    const response = await fetch(`${url}${encodeURIComponent(query)}`, {signal});

    if(!response.ok) throw new Error('Failed to fetch posts');

    return await response.json();
}