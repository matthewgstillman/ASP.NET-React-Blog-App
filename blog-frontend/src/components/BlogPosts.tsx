import React, { useEffect, useState } from "react";
import API from "../api";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

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
    const [commentAuthor, setCommentAuthor] = useState<string>("");
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    useEffect(() => {
        API.get("/posts")
            .then((response) => {
                const postList = response.data?.$values.map((post: any) => ({
                    ...post,
                    comments: post.comments?.$values || [],
                })) || [];
                setPosts(postList);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    const handleAddComment = (postId: number) => {
        if (newComment.trim() === "" || commentAuthor.trim() === "") {
            alert("Comment and Author cannot be empty.");
            return;
        }

        const payload = {
            Author: commentAuthor,
            Text: newComment,
            PostId: postId
        };

        API.post(`/posts/${postId}/comments`, payload)
            .then((response) => {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? { ...post, comments: [...post.comments, response.data] }
                            : post
                    )
                );
                setNewComment("");
                setCommentAuthor("");
                setSelectedPostId(null);
            })
            .catch((error) => {
                if (error.response) {
                    const errorMessage = error.response.data.errors
                        ? Object.values(error.response.data.errors).join(" ")
                        : error.response.data.message || "An error occurred.";
                    alert(`Error: ${errorMessage}`);
                } else {
                    alert("Failed to add comment. Please try again.");
                }
            });
    };

    return (
        <div className="mainContainer">
            {posts.map((post) => (
                <div className="blogPostsContainer" key={post.id}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Header as="h5">{post.title}</Card.Header>
                        <Card.Body>
                            <Card.Text>{post.content}</Card.Text>
                            <Card.Text>
                                <small className="text-muted">By {post.author} • {new Date(post.createdAt).toLocaleDateString()}</small>
                            </Card.Text>

                            <Card.Title className="mt-4">Comments</Card.Title>
                            {post.comments.length > 0 ? (
                                <ListGroup className="commentList">
                                    {post.comments.map((comment) => (
                                        <ListGroup.Item key={comment.id}>
                                            <strong>{comment.author}</strong>: {comment.text}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-muted">No comments yet. Be the first to comment!</p>
                            )}

                            <Form className="mt-4">
                                <Form.Group controlId={`formAuthor-${post.id}`}>
                                    <Form.Label>Your Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={selectedPostId === post.id ? commentAuthor : ""}
                                        onChange={(e) => {
                                            setSelectedPostId(post.id);
                                            setCommentAuthor(e.target.value);
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId={`formComment-${post.id}`} className="mt-3">
                                    <Form.Label>Add a Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter your comment"
                                        value={selectedPostId === post.id ? newComment : ""}
                                        onChange={(e) => {
                                            setSelectedPostId(post.id);
                                            setNewComment(e.target.value);
                                        }}
                                    />
                                </Form.Group>

                                <Button
                                    className="mt-3"
                                    variant="primary"
                                    onClick={() => handleAddComment(post.id)}
                                >
                                    Submit
                                </Button>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                        </Card.Footer>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default BlogPosts;
