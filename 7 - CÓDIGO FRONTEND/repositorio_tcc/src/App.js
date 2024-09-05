import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login.js'

class App extends React.Component{
  
  render(){
    return (
      <BrowserRouter>
        <div className="container-fluid">
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
