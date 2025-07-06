export type Post = {
    id: number;
    title: string;
    content: string;
    published?: boolean;
    authorId: number;
}

export type NewPost = Omit<Post, 'id'>;

export type User = {
    id: number;
    email: string;
    password: string;
    name?: string;
};

export type LoginUser = Omit<User, 'id'>;