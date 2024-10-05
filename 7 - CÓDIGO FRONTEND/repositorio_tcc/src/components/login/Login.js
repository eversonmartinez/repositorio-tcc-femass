import React, { Component } from 'react'
import logoFemass from './../../assets/images/logo-femass.png';
import logo from './../../assets/images/Logo TCCFLOW.png';
import './login.css';
import { useNavigate } from 'react-router-dom';

function withNavigate(Component) {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class Login extends Component {
  
  state = {
    login: '',
    password: ''
  }

  txtLogin_change = (event) => {
    this.setState({ login: event.target.value });
  }

  txtPassword_change = (event) => {
    this.setState({ password: event.target.value });
  }

  login = async () => {

    var url = window.server + "/auth/login"

    //verificar se algum dos campos não foi preenchido
    if(!this.state.login || !this.state.password) {return;}

    const data = {
      "email": this.state.login,
      "password": this.state.password
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
        .then((data) => {
            if (data.token) {
              // Armazene o token em localStorage ou sessionStorage
              sessionStorage.setItem('token', data.token)
              this.props.navigate('/');
            } else {
              // Trate erros
              console.error('Autenticação falhou.');
            }
          })
      .catch(e => { console.log(e) }) 
  }
  
  render() {
    return (
      <div className='container-fluid d-flex flex-column justify-content-between' style={{'minHeight': '100vh'}}>
        <div className='row justify-content-center' style={{'marginTop': '10vh'}}> 
          <div className='col-10 col-md-6 col-lg-4 text-center'>
            <img src={logoFemass} className="img-fluid" style={{'maxWidth': '300px'}} alt="Logo da faculdade"></img>
          </div>
        </div>  
        <div className='row mt-5 justify-content-center'>
          <div className='col-10 col-md-6 col-lg-3'>
            <div className='bg-white border rounded p-4'>
              <div className="mb-3 row justify-content-center">  
                <div className='col-12'>
                  <label htmlFor="loginUser">Login</label>
                  <input type="email" className="form-control" id="loginUser" placeholder="Matrícula" onChange={this.txtLogin_change}></input>
                </div>
              </div>
              <div className="mb-4 row justify-content-center">
                <div className='col-12'>
                  <label htmlFor="loginPassword" className="col-form-label">Senha</label>
                  <input type="password" className="form-control" id="loginPassword" onChange={this.txtPassword_change}></input>
                </div>
              </div>
              <div className='mb-5 row justify-content-center'>
                <div className='col-12 d-grid'>
                  <button className='btn btn-custom' onClick={this.login}>Entrar no sistema</button>
                </div>
              </div>
            </div>
          </div>
        </div> 
        <div className='row justify-content-end mt-auto'>
          <div className='col-6 col-md-4 text-end'>
            <img src={logo} className="img-fluid mb-3 me-2" style={{'maxWidth': '180px'}} alt="Logo da faculdade"></img>
          </div> 
        </div>
      </div>
    )
  }
}

export default withNavigate(Login);
