import React, { useEffect, useState } from "react";
import API from "../api";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

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
        <div className="mainContainer">
            {posts.map((post) => (
                <div className="blogPostsContainer" key={post.id}>
                    <Card style={{ width: '50vw' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text>
                                {post.content}
                            </Card.Text>
                            <Card.Text>
                                Comments
                            </Card.Text>
                            <Card.Text>
                                {post.comments.map((comment) => (
                                    <p key={comment.id}>
                                        {comment.author}: {comment.text}
                                    </p>
                                ))}
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default BlogPosts;
