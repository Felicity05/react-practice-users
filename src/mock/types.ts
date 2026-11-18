export type Post = {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: Reactions;
    views: number;
    userId: number;
};

type Reactions = {
    likes: number;
    dislikes: number;
}

export type PostResponse = {
    limit: number;
    skip: number;
    total: number;
    posts: Post[];
};