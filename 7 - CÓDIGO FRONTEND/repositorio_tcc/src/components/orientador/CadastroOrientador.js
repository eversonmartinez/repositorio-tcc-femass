import React, { Component } from 'react'
import logoFemass from './../../assets/images/logo-femass.png';
import logo from './../../assets/images/Logo TCCFLOW.png';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';

function withNavigate(Component) {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

class cadastroOrientador extends Component {
    
    resgister = (event) => {
        console.log("botão apertado");
        event.preventDefault();
        var url = window.server + "/orientadores";

        let cpf = this.state.cpf.replace(/[^\d]/g, '')
        console.log(cpf)

        const data = {
            "nomeCompleto": this.state.nomeCompleto,
            "cpf": this.state.cpf.replace(/[^\d]/g, ''),
            "telefone": this.state.cpf.replace(/[^\d]/g, ''),
            "email": this.state.email
        };
        const token = sessionStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Orientador criado!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
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
        
        setTimeout(() => {
            this.fillList();
        }, 5000);
    }

    txtNomeCompleto_change = (event) => {
        this.setState({ nomeCompleto: event.target.value });
    }

    txtCPF = (event) => {
        this.setState({ cpf: event.target.value });
    }

    txtTelefone = (event) => {
        this.setState({ telefone: event.target.value });
    }

    txtEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    // carregar os dados

    state = {
        listOrientador: [],
        showModalDeletion: false
    }

    // columns = [
    //     {
    //         name: "Ações",
    //         cell: listOrientador => <>
    //             <button class="btn btn-warning">editar</button>
    //             <button class="btn btn-danger" onClick={this.beginDeletion(listOrientador)} >Deletar</button>
    //         </>, width: '12%'
    //     }
    // ];

    fillList = () => {
        const url = window.server + "/orientadores";

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => this.setState({ listOrientador: data, filteredItems: data }));
        
        //console.log(this.state.listOrientador);
    }

    beginView = () => {
        const url = window.server + "/orientadores/" + this.setState.listOrientador.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => {
                this.setState({ toViewItem: data, showModalView: true });
            })
            .catch((error) => {
            });
    }

    componentDidMount() {
        this.fillList();
    }

    // Deletar orientador

    beginDeletion = (listOrientador) => {
        //console.log(listOrientador.nomeCompleto)
        this.setState({ toDeleteItem: listOrientador, showModalDeletion: true });
        console.log(this.state.toDeleteItem.id)
    }

    delete = (listOrientador) => {
        console.log(listOrientador.id)
        this.setState({ toDeleteItem: listOrientador, showModalDeletion: true });
        console.log(this.state.toDeleteItem)

        const url = window.server + "/orientadores/" + this.setState.toDeleteItem.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.fillList();
                    this.setState({ showModalDeletion: false });
                    toast.success('Orientador excluído!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                else {
                    toast.error('Não foi possível excluir', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    throw new Error('Erro na requisição: ' + response.status);
                }
            });
    }


    render() {
        return (
            <div>
                <ToastContainer />
                <div className='container-fluid d-flex flex-column justify-content-between' style={{ 'minHeight': '100vh' }}>
                    <div className='row justify-content-center' style={{ 'marginTop': '10vh' }}>
                        <div className='col-10 col-md-6 col-lg-4 text-center'>
                            <img src={logoFemass} className="img-fluid" style={{ 'maxWidth': '300px' }} alt="Logo da faculdade"></img>
                        </div>
                    </div>
                    <div className='row mt-5 justify-content-center'>
                        <div className='col-10 col-md-6 col-lg-3'>
                            <div className='bg-white border rounded p-4'>
                                <form onSubmit={this.resgister}>
                                    <div><h3 >Cadastro de Orientador</h3></div>
                                    <div class="mb-3 justify-content-center">
                                        <label for="exampleInputEmail1" class="form-label">Nome Completo</label>
                                        <input type="text" class="form-control" id="NomeOrientador" onChange={this.txtNomeCompleto_change} />
                                    </div>
                                    <div class="mb-3 justify-content-center">
                                        <label for="InputCPF" class="form-label">CPF</label>
                                        <InputMask mask="999.999.999-99"
                                            type="text" class="form-control" id="CPFOrientador" onChange={this.txtCPF} >
                                            {(inputProps) => <input {...inputProps} type="text" />}
                                        </InputMask>
                                        {/* <input type="text" class="form-control" id="CPFOrientador" onChange={this.txtCPF} /> */}
                                    </div>
                                    <div class="mb-3 justify-content-center">
                                        <label for="InputTelefone" class="form-label">telefone</label>
                                        <InputMask mask="(99)9999-99999"
                                            type="text" class="form-control" id="TelefoneOrientador" onChange={this.txtTelefone} >
                                            {(inputProps) => <input {...inputProps} type="text" />}
                                        </InputMask>
                                    </div>
                                    <div class="mb-3 justify-content-center">
                                        <label for="exampleInputEmail1" class="form-label">Email</label>
                                        <input type="email" class="form-control" id="NomeOrientador" required placeholder="email@email.com" onChange={this.txtEmail} />
                                    </div>
                                    <div class="mb-3 justify-content-center">
                                        <button class="btn btn-dark" type='submit'>Criar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Tabela de orientadores cadastrado */}
                    <p></p>
                    <h4 className="text-center">Lista de Orientadores</h4>
                    <div class="container">
                        <table class="table table-striped table-hover">
                            <tbody>
                                <tr>
                                    <td className="text-center">Nome</td>
                                    <td className="text-center">Email</td>
                                </tr>
                                {this.state.listOrientador && this.state.listOrientador.length > 0 ? this.state.listOrientador.map(data => (
                                    <tr key={this.state.listOrientador.id}>
                                        {/* <th scope="row">{data.id}</th> */}
                                        <td className="text-center">{data.nomeCompleto}</td>
                                        <td className="text-center">{data.email}</td>
                                        <button class="btn btn-danger" onClick={() => this.delete(data)} >Deletar</button>
                                        {/* <DataTable>
                                            columns={this.columns}
                                        </DataTable> */}
                                    </tr>
                                )) : <tr><td colSpan={4} className='text-center fw-bold'>Nenhum orientador encontrado</td></tr>}
                            </tbody>
                        </table>
                        <button class="btn btn-warning">editar</button>
                        <button class="btn btn-danger" >Deletar</button>
                    </div>
                    <div className='row justify-content-end mt-auto'>
                    <div className='col-6 col-md-4 text-end'>
                        <img src={logo} className="img-fluid mb-3 me-2" style={{ 'maxWidth': '180px' }} alt="Logo da faculdade"></img>
                    </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default withNavigate(cadastroOrientador);