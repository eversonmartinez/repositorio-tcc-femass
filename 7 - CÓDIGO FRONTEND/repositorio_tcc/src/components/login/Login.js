import React, { Component } from 'react'
import logoFemass from './../../assets/images/logo-femass.png';
import logo from './../../assets/images/Logo TCCFLOW.png';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for default styles

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
    if(!this.state.login || !this.state.password) {
      toast.warning('Preencha todos os campos para prosseguir.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const data = {
      "password": this.state.password
    }

    if(this.state.login.includes('@')) {
      data.email = this.state.login;
    } else if (/^\d{6,}$/.test(this.state.login)) {
      // A string é composta apenas por números e tem pelo menos 6 caracteres
      data.matricula = this.state.login;
    } else {
      toast.warning('Campo de login inválido.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch(url, requestOptions)
      .then((response) => response.json().then((data) => ({
        ok: response.ok,
        data
      })))
        .then(response => {
          if (response.ok && response.data.token) {
              // Armazene o token em localStorage ou sessionStorage
              sessionStorage.setItem('token', response.data.token);
              toast.success('Login realizado!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              setTimeout(() => {
                if(response.data.mustChangePassword) { sessionStorage.setItem('mustChangePassword', JSON.stringify(true)); }
                this.props.navigate('/');
              }, 1000);
            } else if (!response.ok){
              toast.error('Login falhou. Verifique suas credenciais.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else if(!response.data.token) {
              toast.error('Erro inesperado', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
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
      toast.warning('Campos preenchidos inválidos', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
          toast.success('Usuário criado!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            this.goToLogin();
          }, 2000);
          return;
        } else {
          toast.error('Erro ao criar', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          throw new Error('Falha na requisição: ' + response.status);
        }
       })
      .catch(e => { console.error(e) }) 
  }

  render() {

    let box = '';

    if(this.state.box === 'login') {  
      box = <>
        <div>
          <ToastContainer />
        </div>
        <div className="mb-3 row justify-content-center">  
          <div className='col-12'>
            <label htmlFor="loginUser">Login</label>
            <input type="text" className="form-control" id="loginUser" placeholder="Matrícula ou e-mail" onChange={this.txtLogin_change}></input>
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
        <div className="alert d-none" id="message" role="alert">
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
