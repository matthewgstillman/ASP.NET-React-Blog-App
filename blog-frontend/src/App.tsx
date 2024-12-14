import React from 'react';
import './assets/App.css';
import CreatePost from "./components/CreatePost";
import 'bootstrap/dist/css/bootstrap.min.css';
import BlogPosts from "./components/BlogPosts";

const App : React.FC = () => {
  return (
    <div className="App">
      <h1>Main Page</h1>
      <CreatePost/>
      <h1>All Blog Posts</h1>
      <BlogPosts/>  
    </div>
  );
}

export default App;
