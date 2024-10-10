import React, { Component, lazy } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../assets/css/tcc.css';
import Select from 'react-select'
import { isDisabled } from '@testing-library/user-event/dist/utils';

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

const defaultSelectOption = { value: '', label: 'Selecione...', isDisabled: true };

class TCC extends Component {
  
    state = {
        tccs: [],
        optionsAlunos: [],
        optionsOrientadores: [],
        optionsCursos: [
            {value: 1, label: 'Sistemas de Informação'},
            {value: 2, label: 'Administração'},
            {value: 3, label: 'Engenharia de Produção'},
            {value: 4, label : 'Matemática'},
        ],
        isCursoInvalid: false,
        selectedCurso: null,
        isAlunoInvalid: false,
        selectedAluno: null,
        isOrientadorInvalid: false,
        selectedOrientador: null,
        resumo: null,
        tituloTcc: null
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    fillList = () => {
        const url = window.server + "/tcc";

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => response.json())
                .then((data) => this.setState({tccs: data}))
    }

    backToHome = () => {
        this.props.navigate('/home');
    } 

    fillOptionsAlunos = () => {
        const url = window.server + "/alunos";

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => response.json())
                .then((data) => {
                    const optionsAlunos = data.map(aluno => ({
                        value: aluno.id,
                        label: aluno.nomeCompleto
                    }));
                    this.setState({ optionsAlunos });
            })
    }

    fillOptionsProfessores = () => {
        const url = window.server + "/orientadores";

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => response.json())
                .then((data) => {
                    const optionsOrientadores = data.map(orientador => ({
                        value: orientador.id,
                        label: orientador.nomeCompleto
                    }));
                    this.setState({ optionsOrientadores });
            })
    }

    beginInsertion = () => {
        this.fillOptionsAlunos();
        this.fillOptionsProfessores();
    }

    validateForm = () => {
        const { tituloTcc, selectedAluno, selectedCurso, selectedOrientador } = this.state;
        if (!tituloTcc || !selectedAluno || !selectedCurso || !selectedOrientador) {
            if (!selectedAluno) this.setState({ isAlunoInvalid: true });
            if (!selectedCurso) this.setState({ isCursoInvalid: true });
            if (!selectedOrientador) this.setState({ isOrientadorInvalid: true });
            return false;
        }

        return true;
    }

    clearState = () => {
        this.setState({
            tituloTcc: null,
            selectedAluno: null,
            selectedCurso: null,
            selectedOrientador: null,
            resumo: null,
        });
    }

    submitTCCForm = (event) => {
        event.preventDefault();
        
        if(!this.validateForm()) return;

        const url = window.server + "/tcc";

        const token = sessionStorage.getItem('token');

        let data = {
            "titulo": this.state.tituloTcc,
            "idAluno": this.state.selectedAluno,
            "idOrientador": this.state.selectedOrientador,
            "idCurso": this.state.selectedCurso
        }

        if(this.state.resumo) {
            data.resumo = this.state.resumo;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        console.error(JSON.stringify(data));


        fetch(url, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error(response);
                throw new Error('Erro na requisição: ' + response.status);
            }
        })
        .then(data => {
            document.getElementById('btnCloseModal').click();
            this.clearState();
            this.fillList();
            document.getElementById('messageTccCreated').classList.remove('d-none');
            setTimeout(() => document.getElementById('messageTccCreated').classList.add('d-none'), 5000);
            // Lógica para lidar com a resposta da API
        })
        .catch(error => {
            console.error('Erro:', error);
            // Lógica para lidar com o erro
        });
    }

    componentDidMount() {
        this.fillList();
    }

    render() {
        return (
        <div>
            <Navbar />
            <div className='page-content'>
                <h1 className='display-6 fw-bold text-decoration-underline p-3'>Trabalhos de Conclusão de Curso</h1>
                <div className='d-flex justify-content-between row'>
                    <div className='col-5'>
                        <div className="card mx-5 mb-4 w-25">
                            <div className="card-body">
                            <button type="button" className="btn btn-success fw-bold" data-bs-toggle="modal" data-bs-target="#insertionModal" onClick={this.beginInsertion}><i className="bi bi-plus-circle-dotted fs-6 me-2"></i>Incluir</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-3'>
                        <div className='alert alert-success fw-bold pt-1 d-none' id='messageTccCreated' role='alert'><i className='bi bi-check2-square fs-2'></i> Trabalho criado com sucesso!</div>
                    </div>
                </div>
                
                <div className="card mx-5 p-3">
                    <div className="card-body">
                        <div className="table-responsive border-rounded">
                            <table className="table table-hover rounded-2" id="data-table">
                                <thead className='text-center table-dark'>
                                    <tr>
                                        {/* <th scope="col">Id</th> */}
                                        <th scope="col">Título</th>
                                        <th scope="col">Aluno</th>
                                        <th scope="col">Orientador</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.tccs && this.state.tccs.length > 0 ? this.state.tccs.map(tcc => (
                                        <tr key={tcc.id}>
                                                {/* <th scope="row">{tcc.id}</th> */}
                                                {/* <td>{tcc.nomeCompleto}</td> */}
                                                <td className="text-center">{tcc.titulo}</td>
                                                <td className="text-center">{tcc.nomeCompletoAluno}</td>
                                                <td className="text-center">{tcc.nomeCompletoOrientador}</td>
                                            </tr>
                                        )) : <tr><td colSpan={4} className='text-center fw-bold'>Nenhum trabalho encontrado</td></tr> }
                                </tbody>
                                {/* <tfoot className='table-dark'>
                                    <tr>
                                        <td colSpan="3" className="text-center">Footer Content</td>
                                    </tr>       
                                </tfoot> */}
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Modal Body -->
            <!-- if you want to close by clicking outside the modal, delete the last endpoint:data-bs-backdrop and data-bs-keyboard --> */}
            <div className="modal fade large-modal" id="insertionModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                <div
                    className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header bg-dark">
                            <h5 className="modal-title text-white" id="modalTitleId">
                                Novo TCC
                            </h5>
                            <button
                                type="button"
                                className="btn-close text-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                style={{filter: 'invert(1)'}}
                            ></button>
                        </div>
                        <form onSubmit={this.submitTCCForm}>
                            <div className="modal-body">
                                <div className="container">
                                        <div className="mb-3 row">
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-4 col-form-label fw-bold required">Título</label>
                                                <input type="text" className="form-control" name="tituloTcc" id="tituloTcc" onChange={this.handleChange} required/>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Resumo</label>
                                                <textarea rows="3" className='form-control' style={{resize: "none"}}></textarea>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-12 col-form-label fw-bold required">Curso</label>
                                                <Select
                                                    className={`basic-single ${this.state.isCursoInvalid ? 'is-invalid' : ''}`}
                                                    classNamePrefix="select"
                                                    defaultValue={defaultSelectOption}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="selectCurso"
                                                    options={this.state.optionsCursos}
                                                    noOptionsMessage={() => "Não há cursos cadastrados"}
                                                    onChange={(selectedOption) => this.setState({ selectedCurso: selectedOption.value, isCursoInvalid: !selectedOption })}
                                                />
                                                {this.state.isCursoInvalid && <div className="invalid-feedback">Por favor, selecione um curso.</div>}
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Aluno</label>
                                                <Select
                                                    className={`basic-single ${this.state.isAlunoInvalid ? 'is-invalid' : ''}`}
                                                    classNamePrefix="select"
                                                    defaultValue={defaultSelectOption}
                                                    // isLoading={isLoading}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="selectAluno"
                                                    options={this.state.optionsAlunos}
                                                    noOptionsMessage={() => "Não há alunos cadastrados"}
                                                    onChange={(selectedOption) => this.setState({ selectedAluno: selectedOption.value, isAlunoInvalid: !selectedOption })}
                                                />
                                                {this.state.isAlunoInvalid && <div className="invalid-feedback">Por favor, selecione um aluno.</div>}
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Orientador</label>
                                                <Select
                                                    className={`basic-single ${this.state.isOrientadorInvalid ? 'is-invalid' : ''}`}
                                                    classNamePrefix="select"
                                                    defaultValue={defaultSelectOption}
                                                    // isLoading={isLoading}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    name="selectOrientador"
                                                    options={this.state.optionsOrientadores}
                                                    noOptionsMessage={() => "Não há orientadores cadastrados"}
                                                    onChange={(selectedOption) => this.setState({ selectedOrientador: selectedOption.value, isOrientadorInvalid: !selectedOption })}
                                                />
                                                {this.state.isOrientadorInvalid && <div className="invalid-feedback">Por favor, selecione um orientador.</div>}
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id="btnCloseModal" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                <button type="submit" className="btn btn-primary">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* <!-- Optional: Place to the bottom of scripts -->
            <script>
                const myModal = new bootstrap.Modal(
                    document.getElementById("modalId"),
                    options,
                );
            </script> */}
            
        </div>
        )
  }
}

export default withNavigate(TCC);
