import React from 'react';
import './App.css';
import CreatePost from "./components/CreatePost";
import 'bootstrap/dist/css/bootstrap.min.css';

const App : React.FC = () => {
  return (
    <div className="App">
      <h1>Main Page</h1>
      <CreatePost/>  
    </div>
  );
}

export default App;
