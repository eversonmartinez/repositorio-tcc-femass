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
  
  login = () => {
    sessionStorage.setItem('isLogged', true);
    this.props.navigate('/');
  }
  
  render() {
    return (
      <div className='container-fluid d-flex flex-column justify-content-between' style={{'min-height': '100vh'}}>
        <div className='row justify-content-center' style={{'margin-top': '10vh'}}> 
          <div className='col-10 col-md-6 col-lg-4 text-center'>
            <img src={logoFemass} className="img-fluid" style={{'max-width': '300px'}} alt="Logo da faculdade"></img>
          </div>
        </div>  
        <div className='row mt-5 justify-content-center'>
          <div className='col-10 col-md-6 col-lg-3'>
            <div className='bg-white border rounded p-4'>
              <div className="mb-3 row justify-content-center">  
                <div className='col-12'>
                  <label for="loginUser">Login</label>
                  <input type="email" className="form-control" id="loginUser" placeholder="Matrícula"></input>
                </div>
              </div>
              <div className="mb-4 row justify-content-center">
                <div className='col-12'>
                  <label for="loginPassword" class="col-form-label">Senha</label>
                  <input type="password" class="form-control" id="loginPassword"></input>
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
            <img src={logo} className="img-fluid mb-3 me-2" style={{'max-width': '180px'}} alt="Logo da faculdade"></img>
          </div> 
        </div>
      </div>
    )
  }
}

export default withNavigate(Login);
