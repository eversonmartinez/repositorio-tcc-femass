import React, { Component } from 'react'
import logoFemass from './../../assets/images/logo-femass.png';
import logo from './../../assets/images/Logo TCCFLOW.png';
import { useNavigate } from 'react-router-dom';

function withNavigate(Component) {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class cadastroOrientador extends Component {
    
    // resgister = () => {
    //     const data = {
    //         "nomeCompleto": this.state.nomeCompleto,
    //         "CPF": this.state.CPF,
    //         "password": this.state.password,
    //         "confirmPassword": this.state.confPassword
    //     }
    // }

    // validatePassword = () => {
    //     if (this.state.password !== this.state.confPassword) {
    //         document.getElementById('passwordConfNewUser').setCustomValidity('As senhas não conferem');
    //     } else {
    //         document.getElementById('passwordConfNewUser').setCustomValidity('');
    //     }
    // }

    // txtNomeCompleto_change = (event) => {
    //     this.setState({ nomeCompleto: event.target.value });
    // }

    // txtCPF = (event) => {
    //     this.setState({ CPF: event.target.value });
    // }

    // txtNewPassword_change = (event) => {
    //     this.setState({ password: event.target.value }, () => this.validatePassword());
    // }

    // txtConfPassword_change = (event) => {
    //     this.setState({ confPassword: event.target.value }, () => this.validatePassword());
    // }

    render() {

        return (
            <div className='container-fluid d-flex flex-column justify-content-between' style={{ 'minHeight': '100vh' }}>
                <div className='row justify-content-center' style={{ 'marginTop': '10vh' }}>
                    <div className='col-10 col-md-6 col-lg-4 text-center'>
                        <img src={logoFemass} className="img-fluid" style={{ 'maxWidth': '300px' }} alt="Logo da faculdade"></img>
                    </div></div>
                <div className='row mt-5 justify-content-center'>
                    <div className='col-10 col-md-6 col-lg-3'>
                        <div className='bg-white border rounded p-4'>
                            
                            <form>
                                <div><h1 class="display-6">Cadastro de Orientador</h1></div>
                                <div class="mb-3 justify-content-center">
                                    <label for="exampleInputEmail1" class="form-label">Nome Completo</label>
                                    <input type="text" class="form-control" id="NomeOrientador" onChange={this.txtNomeCompleto_change} />
                                </div>
                                <div class="mb-3 justify-content-center">
                                    <label for="InputCPF" class="form-label">CPF</label>
                                    <input type="text" class="form-control" id="CPFOrientador" onChange={this.txtCPF} />
                                </div>
                                <div class="mb-3 justify-content-center">
                                    <label for="InputPassword1" class="form-label">Senha</label>
                                    <input type="password" class="form-control" id="exampleInputPassword1" onChange={this.txtNewPassword_change} />
                                </div>
                                <div class="mb-3 justify-content-center">
                                    <label for="InputPassword2" class="form-label">Comfirmar Senha</label>
                                    <input type="password" class="form-control" id="exampleInputPassword1" onChange={this.txtConfPassword_change} />
                                </div>
                                <button type="button" class="btn btn-dark">Criar</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className='row justify-content-end mt-auto'>
                    <div className='col-6 col-md-4 text-end'>
                        <img src={logo} className="img-fluid mb-3 me-2" style={{ 'maxWidth': '180px' }} alt="Logo da faculdade"></img>
                    </div>
                </div>
            </div>

        )
    }
}

export default withNavigate(cadastroOrientador);