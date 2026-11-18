import {Post} from "./types";
import {useState} from "react";

export default function PostCard({post} : { post: Post }) {
    const [showMore, setShowMore] = useState(false);

    return (
        <div style={{border: '1px solid black'}}>
            <p>{post.title}</p>
            <p>{post.tags.join(', ')}</p>
            <button onClick={() => setShowMore((prevShow) => !prevShow)} aria-expanded={showMore}>
                {showMore ? 'Show Less' : 'Show More'}
            </button>
            {showMore && <p>{post.body}</p>}
        </div>
    )
}
