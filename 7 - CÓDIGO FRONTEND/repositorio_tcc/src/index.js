import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//Endereço do servidor a ser utilizado nas requisições HTTP
window.server = 'http://localhost:8080'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);