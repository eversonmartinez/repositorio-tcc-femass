import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login.js'
import Home from './components/home/Home.js'
import Aluno from './components/aluno/Aluno.js'
import FirstScreen from './components/firstScreen/FirstScreen.js';
import ProtectedRoute from './HOC/ProtectedRoute';
import TCC from './components/tcc/TCC.js';
import CadastroOrientador from './components/orientador/CadastroOrientador.js';
import Users from './components/users/Users.js';

class App extends React.Component{
  
  render(){
    return (
      <BrowserRouter>
        <div className="container-fluid">
          <Routes>
            <Route exact path="/" element={<FirstScreen />}></Route>
            <Route exact path="/home" element={<ProtectedRoute component={Home} />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/alunos" element={<ProtectedRoute component={Aluno} />}></Route>
            <Route exact path="/orientadores" element={<ProtectedRoute component={CadastroOrientador} />}></Route>
            <Route exact path="/tcc" element={<ProtectedRoute component={TCC} />}></Route>
            <Route exact path="/users" element={<ProtectedRoute component={Users} />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
