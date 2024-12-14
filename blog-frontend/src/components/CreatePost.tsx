import React, { useState, FormEvent } from "react";
import API from "../api";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CreatePost : React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        API.post("/posts", { title, content, author }).then(() => {
            setTitle("");
            setContent("");
            setAuthor("");
            alert("Post created");
        })
    };
    
    return (
        <div className="formContainer">
            <h1>Create a new blog post</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter the title"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formContent">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter the content"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAuthor">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter the author name"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Post
                </Button>
            </Form>
        </div>
    );
}

export default CreatePost;