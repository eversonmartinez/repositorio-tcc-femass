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
import ChangePassword from './HOC/ChangePassword.js';

class App extends React.Component{
  
  render(){

    //Envolvimento do componente em diversos HOCS
    const ProtectedHome = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Home} {...props} />} />
    );
    const ProtectedAluno = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Aluno} {...props} />} />
    );
    const ProtectedOrientador = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={Orientador} {...props} />} />
    );
    const ProtectedTCC = (props) => (
      <ProtectedRoute component={() => <ChangePassword component={TCC} {...props} />} />
    );

    return (
      <BrowserRouter>
        <div className="container-fluid">
        <PasswordModalProvider>
          <Routes>
              <Route exact path="/" element={<FirstScreen />}></Route>
              <Route exact path="/login" element={<Login />}></Route>
              <Route exact path="/home" element={<ProtectedHome />}></Route>
              <Route exact path="/alunos" element={<ProtectedAluno />}></Route>
              <Route exact path="/orientadores" element={<ProtectedOrientador />}></Route>
              <Route exact path="/tcc" element={<ProtectedTCC />}></Route>
          </Routes>
          <PasswordChangeModal />
        </PasswordModalProvider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
