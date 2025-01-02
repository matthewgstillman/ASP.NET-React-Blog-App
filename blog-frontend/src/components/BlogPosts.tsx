import React, { useEffect, useState } from "react";
import API from "../api";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import {useNavigate} from "react-router-dom";

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
    const [showCommentForm, setShowCommentForm] = useState<boolean>(false);

    useEffect(() => {
        API.get("/posts")
            .then((response) => {
                const postList = response.data?.$values.map((post: any) => ({
                    ...post,
                    comments: post.comments?.$values || [],
                })) || [];

                const sortedPosts = postList.sort((a: Post, b: Post) => {
                    const dateA = new Date(a.createdAt).getTime() || 0;
                    const dateB = new Date(b.createdAt).getTime() || 0;
                    return dateB - dateA;
                });

                setPosts(sortedPosts);
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
                setShowCommentForm(false);
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

    const handleShowCommentForm = (postId: number) => {
        setShowCommentForm(true);
        setSelectedPostId(postId);
    };
    
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate("/");
    }
    return (
        <div className="mainContainer">
            {posts.map((post) => (
                <div className="blogPostsContainer" key={post.id}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Header as="h5">{post.title}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <small className="text-muted">
                                    By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                                </small>
                            </Card.Text>
                            <Card.Text>{post.content}</Card.Text>

                            {showCommentForm && selectedPostId === post.id && (
                                <Form className="mt-4">
                                    <Form.Group controlId={`formAuthor-${post.id}`}>
                                        <Form.Label>Your Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            value={commentAuthor}
                                            onChange={(e) => setCommentAuthor(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId={`formComment-${post.id}`} className="mt-3">
                                        <Form.Label>Add a Comment</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter your comment"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
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
                            )}
                        </Card.Body>

                        <Card.Footer className="text-muted">
                            <Card.Title className="mt-3 mb-3">
                                {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                            </Card.Title>

                            {post.comments.length > 0 ? (
                                <ListGroup className="commentList mt-2">
                                    {post.comments.map((comment) => (
                                        <ListGroup.Item key={comment.id} className="mt-1 mb-1">
                                            <strong>{comment.author}</strong>: {comment.text}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p
                                    className="text-muted clickable-text"
                                    onClick={() => handleShowCommentForm(post.id)}
                                >
                                    No comments yet. <span className="text-primary">Be the first to comment!</span>
                                </p>
                            )}

                            {post.comments.length > 0 && (
                                <p
                                    className="text-primary clickable-text mt-3"
                                    onClick={() => handleShowCommentForm(post.id)}
                                >
                                    Add another comment
                                </p>
                            )}
                        </Card.Footer>
                    </Card>
                </div>
            ))}
            <div className="createNewPostButtonContainer">
                <Button
                    className="createPostButton"
                    variant="primary"
                    onClick={handleNavigate}
                >
                    Create New Post
                </Button>
            </div>
        </div>
    );
};

export default BlogPosts;
