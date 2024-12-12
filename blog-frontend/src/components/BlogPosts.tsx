import React, { useEffect, useState } from "react";
import API from "../api";

interface Comment {
    id: number;
    author: string;
    text: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    comments: Comment[];
}

const BlogPosts: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        API.get("/posts").then((response: { data: Post[] }) => setPosts(response.data));

    }, []);

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p>By {post.author}</p>
                    <h4>Comments:</h4>
                    {post.comments.map((comment) => (
                        <p key={comment.id}>
                            {comment.author}: {comment.text}
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BlogPosts;
