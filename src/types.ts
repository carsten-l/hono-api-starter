export type Post = {
    id: number;
    title: string;
    content: string;
    published?: boolean;
    authorId: number;
}

export type NewPost = Omit<Post, 'id'>;
