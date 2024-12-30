import React, { useEffect, useState } from "react";
import API from "../api";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

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
    const [newComment, setNewComment] = useState<string>("");
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    useEffect(() => {
        API.get("/posts")
            .then((response: { data: Post[] }) => setPosts(response.data))
            .catch((error) => {
                console.error("Error fetching posts:", error.message);
            });
    }, []);

    const handleAddComment = (postId: number) => {
        if (newComment.trim() === "") {
            alert("Comment cannot be empty.");
            return;
        }

        const comment = {
            Author: "Current User",  
            Text: newComment,
        };

        API.post(`/posts/${postId}/comments`, comment)
            .then((response) => {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? { ...post, comments: [...post.comments, response.data] }
                            : post
                    )
                );
                setNewComment("");
                setSelectedPostId(null);
                alert("Comment added successfully!");
            })
            .catch((error) => {
                if (error.response) {
                    console.error("Server responded with:", error.response.data);
                    alert(`Error: ${error.response.data}`);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    alert("No response from server.");
                } else {
                    console.error("Request setup error:", error.message);
                    alert("Unexpected error occurred.");
                }
            });
    };

    return (
        <div className="mainContainer">
            {posts.map((post) => (
                <div className="blogPostsContainer" key={post.id}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Text>{post.content}</Card.Text>
                            <Card.Text>
                                <strong>Author:</strong> {post.author}
                            </Card.Text>
                            <Card.Text>
                                <strong>Comments:</strong>
                            </Card.Text>
                            {post.comments.length > 0 ? (
                                post.comments.map((comment) => (
                                    <p key={comment.id}>
                                        {comment.author}: {comment.text}
                                    </p>
                                ))
                            ) : (
                                <p>No comments yet. Be the first to comment!</p>
                            )}

                            <Form className="commentForm">
                                <Form.Group controlId={`formComment-${post.id}`}>
                                    <Form.Label>Add a Comment</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your comment"
                                        value={selectedPostId === post.id ? newComment : ""}
                                        onChange={(e) => {
                                            setSelectedPostId(post.id);
                                            setNewComment(e.target.value);
                                        }}
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    onClick={() => handleAddComment(post.id)}
                                >
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default BlogPosts;
