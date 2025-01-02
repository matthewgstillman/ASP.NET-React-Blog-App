import React from 'react';
import './assets/App.css';
import CreatePost from "./components/CreatePost";
import 'bootstrap/dist/css/bootstrap.min.css';
import BlogPosts from "./components/BlogPosts";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to="/">My Blog App</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <Nav.Link as={Link} to="/posts">Home</Nav.Link>
                                <Nav.Link as={Link} to="/">Create a New Blog Post</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                
                <Container className="mt-4">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <CreatePost />
                                </>
                            }
                        />

                        <Route
                            path="/posts"
                            element={
                                <>
                                    <BlogPosts />
                                </>
                            }
                        />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
};

export default App;
