import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login.js'
import Home from './components/home/Home.js'
import Aluno from './components/aluno/Aluno.js'
import FirstScreen from './components/firstScreen/FirstScreen.js';
import ProtectedRoute from './HOC/ProtectedRoute';
import Orientador from './components/orientador/Orientador.js';
import TCC from './components/tcc/TCC.js';
import { PasswordModalProvider } from './components/passwordChange/PasswordModalContext'; // O provedor do contexto
import PasswordChangeModal from './components/passwordChange/PasswordChangeModal'; // O modal global

class App extends React.Component{
  
  render(){
    return (
      <BrowserRouter>
        <div className="container-fluid">
        <PasswordModalProvider>
          <Routes>
              <Route exact path="/" element={<FirstScreen />}></Route>
              <Route exact path="/home" element={<ProtectedRoute component={Home} />}></Route>
              <Route exact path="/login" element={<Login />}></Route>
              <Route exact path="/alunos" element={<ProtectedRoute component={Aluno} />}></Route>
              <Route exact path="/orientadores" element={<ProtectedRoute component={Orientador} />}></Route>
              <Route exact path="/tcc" element={<ProtectedRoute component={TCC} />}></Route>
          </Routes>
          <PasswordChangeModal />
        </PasswordModalProvider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
