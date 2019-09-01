import React from 'react';
import FileUpload from './components/FileUpload'
import './App.css';

function App() {
  return (
    <div className="container">
      <div className="row">
          <h1 className="col">Files App</h1>
      </div>
      <FileUpload />
    </div>
  );
}

export default App;
