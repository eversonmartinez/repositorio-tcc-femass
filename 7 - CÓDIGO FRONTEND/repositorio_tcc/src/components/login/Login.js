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
    password: '',
    confPassword: '',
    nomeCompleto: '',
    box: 'login'
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

  cleanState = () => {
    this.setState({
      nomeCompleto: '',
      matricula: '',
      login: '',
      password: '',
      confPassword: ''
    });
  }

  goToRegistration = () => {
    this.cleanState();
    this.setState({box: 'registration'});
  }

  goToLogin = () => {
    this.cleanState();
    this.setState({box: 'login'});
  }

  validatePassword = () => {
    if(this.state.password !== this.state.confPassword) {
      document.getElementById('passwordConfNewUser').setCustomValidity('As senhas não conferem');
    } else {
      document.getElementById('passwordConfNewUser').setCustomValidity('');
    }
  }

  txtNomeCompleto_change = (event) => {
    this.setState({ nomeCompleto: event.target.value });
  }

  txtMatricula_change = (event) => {
    this.setState({ matricula: event.target.value });
  }

  txtNewLogin_change = (event) => {
    this.setState({ login: event.target.value });
  }

  txtNewPassword_change = (event) => {
    this.setState({ password: event.target.value }, () => this.validatePassword());
  }

  txtConfPassword_change = (event) => {
    this.setState({ confPassword: event.target.value }, () => this.validatePassword());
  }

  validateForm = () => {
    const { nomeCompleto, matricula, login, password, confPassword } = this.state;
    if (!nomeCompleto || !matricula || !login || !password || !confPassword) {
      return false;
    }
    this.validatePassword();
    const passwordConfElement = document.getElementById('passwordConfNewUser');
    return passwordConfElement.checkValidity();
  };
  
  register = (event) => {
    event.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    var url = window.server + "/auth/register"

    const data = {
      "nomeCompleto": this.state.nomeCompleto,
      "matricula": this.state.matricula,
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
      .then((response) => {
        if (response.status === 200) {
          document.getElementById('messageUserRegistered').classList.remove('d-none');
          setTimeout(() => {
            this.goToLogin();
            document.getElementById('messageUserRegistered').classList.add('d-none');
          }, 3000);
          return;
        } else {
          throw new Error('Falha na requisição: ' + response.status);
        }
       })
      .catch(e => { console.error(e) }) 
  }

  render() {

    let box = '';

    if(this.state.box === 'login') {  
      box = <>
        <div className="mb-3 row justify-content-center">  
          <div className='col-12'>
            <label htmlFor="loginUser">Login</label>
            <input type="email" className="form-control" id="loginUser" placeholder="E-mail" onChange={this.txtLogin_change}></input>
          </div>
        </div>
        <div className="mb-4 row justify-content-center">
          <div className='col-12'>
            <label htmlFor="loginPassword" className="col-form-label">Senha</label>
            <input type="password" className="form-control" id="loginPassword" onChange={this.txtPassword_change}></input>
          </div>
        </div>
        <div className='mb-3 row justify-content-center'>
          <div className='col-12 d-grid'>
            <button className='btn btn-custom' onClick={this.login}>Entrar no sistema</button>
          </div>
        </div>
        <div className='mb-1 row'>
          <a href='#' className='text-decoration-none' onClick={this.goToRegistration}>Registre-se</a>
        </div>
      </> ;
    } else if(this.state.box === 'registration') {
      box = <>
        <div className="alert alert-warning" role="alert">
          Essa função provavelmente será removida, visto que o cadastro é feito pelo professor
        </div>
        <div className="alert alert-success d-none" id="messageUserRegistered" role="alert">
          Usuário cadastrado com sucesso!
        </div>

        <div className="alert alert-danger d-none" role="alert" id="messageAllFields">
          <i className='bi bg-info'></i>Preencha todos os campos!
        </div>
        
        <h2 className='fw-bold fs-4 text-decoration-underline mb-3' style={{color: '#404040'}}>Registre-se</h2>
        <form onSubmit={this.register}>
          <div className="mb-3 row justify-content-center">  
            <div className='col-12'>
              <label htmlFor="loginUser" className='required'>Nome completo</label>
              <input type="text" className="form-control" id="nomeNewUser" required onChange={this.txtNomeCompleto_change}></input>
            </div>
          </div>
          <div className="mb-3 row justify-content-center">  
            <div className='col-12'>
              <label htmlFor="loginUser" className='required'>Matrícula</label>
              <input type="text" className="form-control" id="matriculaNewUser" required maxLength={11} onChange={this.txtMatricula_change}></input>
            </div>
          </div>
          <div className="mb-3 row justify-content-center">  
            <div className='col-12'>
              <label htmlFor="loginUser" className='required'>E-mail</label>
              <input type="email" className="form-control" id="loginNewUser" required placeholder="email@email.com" onChange={this.txtNewLogin_change}></input>
            </div>
          </div>
          <div className="mb-4 row justify-content-center">
            <div className='col-12'>
              <label htmlFor="loginPassword" className="col-form-label required">Senha</label>
              <input type="password" className="form-control" id="passwordNewUser" required onChange={this.txtNewPassword_change}></input>
            </div>
          </div>
          <div className="mb-4 row justify-content-center">
            <div className='col-12'>
              <label htmlFor="loginPassword" className="col-form-label required">Confirme a senha</label>
              <input type="password" className="form-control" id="passwordConfNewUser" onChange={this.txtConfPassword_change}></input>
            </div>
          </div>
          <div className='mb-3 row'>
            <div className='col-12 d-flex justify-content-between'>
              <button className='btn btn-secondary' onClick={this.goToLogin}>Abandonar</button>
              <button className='btn btn-dark' type='submit'>Criar</button>
            </div>
          </div>
        </form>
      </>;
    }

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
              {box}
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
