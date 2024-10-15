import React, { Component, lazy } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../assets/css/tcc.css';
import Select from 'react-select'
import { Button, Modal } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for default styles

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
        resumo: '',
        tituloTcc: '',
        showModalDeletion: false,
        toDeletionItem: null,
        showModalDeletion: false,
        toViewItem: null
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

    fillOptionsOrientadores = () => {
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
        this.fillOptionsOrientadores();
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
            tituloTcc: '',
            selectedAluno: null,
            selectedCurso: null,
            selectedOrientador: null,
            resumo: '',
        });
    }

    submitTCCForm = (event) => {
        event.preventDefault();
        
        if(!this.validateForm()) return;

        const url = window.server + "/tcc";

        const token = sessionStorage.getItem('token');

        let data = {
            "titulo": this.state.tituloTcc,
            "idAluno": this.state.selectedAluno.value,
            "idOrientador": this.state.selectedOrientador.value,
            "idCurso": this.state.selectedCurso.value
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

    beginEdit = (institute) => {
		this.clearState();
		this.setState({ creating: false })
		this.setState({ editing: true, id: institute.id, name: institute.name, acronym: institute.acronym })
	}

    beginDeletion = (tccs) => {
        this.state.toDeleteItem = tccs;
        this.setState({ showModalDeletion: true });
	}

    delete = () => {
        const url = window.server + "/tcc/" + this.state.toDeleteItem.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => {
                if(response.ok) {
                    this.fillList();
                    this.setState({ showModalDeletion: false });
                    toast.success('TCC excluído!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                }
                else{
                    toast.error('Não foi possível excluir', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    console.error(response);
                    throw new Error('Erro na requisição: ' + response.status);
                }
            });
    }

    closeModal = (operationName) => {
        this.clearState();
        this.setState({ ['showModal' + operationName]: false, ['to' + operationName + 'Item']: null });
    }

    beginView = (tcc) => { 
        const url = window.server + "/tcc/" + tcc.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => {
                if(response.ok) {
                    return response.json();
                } else{
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => {
                console.error(data);
                this.setState({ toViewItem: data, showModalView: true });
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }

    beginEdit = (tcc) => { 

        this.fillOptionsOrientadores();

        const url = window.server + "/tcc/" + tcc.id;

        const token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token, // Adicione o token JWT
                'Content-Type': 'application/json'
            }
        };

        fetch(url,requestOptions)
            .then((response) => {
                if(response.ok) {
                    return response.json();
                } else{
                    throw new Error('Erro na requisição: ' + response.status);
                }
            }).then((data) => {
                console.error(data);
                this.setState({ 
                    toEditItem: data,
                    showModalEdit: true,
                    tituloTcc: data.titulo,
                    resumo: data.resumo,
                    selectedCurso: { value: data.idCurso, label: data.idCurso },
                    selectedAluno: { value: data.idAluno, label: data.idAluno },
                    selectedOrientador: { value: data.idOrientador, label: data.idOrientador } });
            })
            .catch((error) => {
                console.error('Erro:', error);
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

                <ToastContainer />
                
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
                                        <th scope="col">Ações</th>
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
                                                <td className='text-center'>
                                                    <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Visualizar Instituto" onClick={() => this.beginView(tcc)}><i className="bi bi-eye"></i></button>
                                                    <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Editar Instituto" onClick={() => this.beginEdit(tcc)}><i className="bi bi-pencil"></i></button>
                                                    <button className="btn btn-outline-secondary mx-1 px-1 py-0" data-toggle="tooltip" data-placement="top" title="Excluir selecionado" onClick={() => this.beginDeletion(tcc)}><i className="bi bi-trash"></i></button>
                                                </td>
                                            </tr>
                                        )) : <tr><td colSpan={4} className='text-center fw-bold'>Nenhum trabalho encontrado</td></tr> }
                                </tbody>
                                {/* <tfoot className='table-dark'>
                                    <tr>
                                        <td colSpan="3" className="text-center">Footer Content</td>
                                    </tr>       
                                </tfoot> */}
                            </table>
                            <div className='row'>
                                <div className='col-2'>
                                    <label htmlFor="itensQuantityCombo" className="form-label fw-lighter font-small me-2">Itens / pág.</label>
                                    <select className="form-select form-select-sm d-inline" arial-label="Combo for itens per page" value={this.state.itensPerPage} onChange={this.itensQuantityComboChange} id='itensQuantityCombo'>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="25">25</option>
                                    </select>
                                </div>
                                <div className='col-7 text-center '>
                                    <button className="btn btn-danger m-1" onClick={() => this.beginDeletion(this.state.selectedInstitutesId)}>Excluir seleção</button>
                                </div>
                                <div className='col-3 text-end'>
                                    <p className='fw-lighter font-small me-2 d-inline'>Pág. atual:</p>
                                    <button onClick={this.goToFirstPage} className='btn btn-light ps-1 pe-1'><i className="bi bi-chevron-double-left"></i></button>
                                    <button onClick={this.goToPreviousPage} className='btn btn-light ps-1 pe-1'><i className="bi bi-chevron-left"></i></button>
                                    <p className='d-inline ps-2 pe-2 fs-6 align-middle'>{this.state.currentPage + 1}</p>
                                    <button onClick={this.goToNextPage} className='btn btn-light ps-1 pe-1'><i className="bi bi-chevron-right"></i></button>
                                    <button onClick={this.goToLastPage} className='btn btn-light ps-1 pe-1'><i className="bi bi-chevron-double-right"></i></button>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12 text-end'>
                                    <p className='fw-lighter font-small d-inline'>{(this.state.institutes && this.state.institutes.length > 0) ? ('Exibindo itens ' + (Number(this.state.currentOffset)+Number(1)) + ' ao ' + (Number(this.state.currentOffset)+Number(this.state.displayedItens)) + ' de um total de ' + this.state.totalItens) :  ('Não há itens')}</p>
                                </div>
                            </div>
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
                                onClick={this.clearState}
                            ></button>
                        </div>
                        <form onSubmit={this.submitTCCForm}>
                            <div className="modal-body">
                                <div className="container">
                                        <div className="mb-3 row">
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-4 col-form-label fw-bold required">Título</label>
                                                <input type="text" className="form-control" name="tituloTcc" id="tituloTcc" onChange={this.handleChange} value={this.state.tituloTcc} required/>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Resumo</label>
                                                <textarea rows="3" className='form-control' style={{resize: "none"}} name="resumo" onChange={this.handleChange} value={this.state.resumo}></textarea>
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
                                                    onChange={(selectedOption) => this.setState({ selectedCurso: selectedOption, isCursoInvalid: !selectedOption })}
                                                    value={this.state.selectedCurso}
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
                                                    onChange={(selectedOption) => this.setState({ selectedAluno: selectedOption, isAlunoInvalid: !selectedOption })}
                                                    value={this.state.selectedAluno}
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
                                                    value={this.state.selectedOrientador}
                                                    onChange={(selectedOption) => this.setState({ selectedOrientador: selectedOption, isOrientadorInvalid: !selectedOption })}
                                                />
                                                {this.state.isOrientadorInvalid && <div className="invalid-feedback">Por favor, selecione um orientador.</div>}
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" id="btnCloseModal" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.clearState}>Fechar</button>
                                <button type="submit" className="btn btn-primary">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Modal show={this.state.showModalDeletion} onHide={() => this.closeModal('Deletion')} centered>
                <Modal.Header className='bg-dark text-white' closeButton>
                <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tem certeza que deseja excluir o trabalho <span className='fw-bold'>{this.state.toDeletionItem && this.state.toDeletionItem.titulo}</span>?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => this.closeModal('Deletion')}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={this.delete}>
                    Confirmar
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={this.state.showModalView} onHide={() => this.closeModal('View')} centered>
                <Modal.Header className='bg-dark text-white' closeButton>
                <Modal.Title>Resumo {this.state.toViewItem && this.state.toViewItem.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {this.state.toViewItem && <>
                        <div>
                            <h5>Título:</h5>
                            <p>{this.state.toViewItem.titulo}</p>
                        </div>
                        <div>
                            <h5>Resumo:</h5>
                            <p>{this.state.toViewItem.resumo}</p>
                        </div>
                        <div>
                            <h5>Autor:</h5>
                            <p>{this.state.toViewItem.idAluno}</p>
                        </div>
                        <div>
                            <h5>Autor:</h5>
                            <p>{this.state.toViewItem.idOrientador}</p>
                        </div>
                        <div>
                            <h5>Curso:</h5>
                            <p>{this.state.toViewItem.idCurso}</p>
                        </div>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => this.closeModal('View')}>
                    Fechar
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={this.state.showModalEdit} onHide={() => this.closeModal('Edit')} centered size='xl'>
                <Modal.Header className='bg-dark text-white' closeButton>
                <Modal.Title>Editar {this.state.toEditItem && this.state.toEditItem.titulo}</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.submitTCCForm}>
                <Modal.Body>
                    {this.state.toEditItem && <>
                        <div className="modal-body">
                            <div className="container">
                                    <div className="mb-3 row">
                                        <div className="col-12">
                                            <label htmlFor="inputName" className="col-4 col-form-label fw-bold required">Título</label>
                                            <input type="text" className="form-control" name="tituloTcc" id="tituloTcc" onChange={this.handleChange} value={this.state.tituloTcc} required/>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Resumo</label>
                                            <textarea rows="3" className='form-control' style={{resize: "none"}} name="resumo" onChange={this.handleChange} value={this.state.resumo}></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="inputName" className="col-12 col-form-label fw-bold required">Curso</label>
                                            <Select
                                                isDisabled
                                                className={`basic-single ${this.state.isCursoInvalid ? 'is-invalid' : ''}`}
                                                classNamePrefix="select"
                                                name="selectCurso"
                                                options={this.state.optionsCursos}
                                                value={this.state.selectedCurso}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="inputName" className="col-12 col-form-label fw-bold">Aluno</label>
                                            <Select
                                                isDisabled
                                                className={`basic-single ${this.state.isAlunoInvalid ? 'is-invalid' : ''}`}
                                                classNamePrefix="select"
                                                name="selectAluno"
                                                options={this.state.optionsAlunos}
                                                value={this.state.selectedAluno}
                                            />
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
                                                value={this.state.selectedOrientador}
                                                onChange={(selectedOption) => this.setState({ selectedOrientador: selectedOption, isOrientadorInvalid: !selectedOption })}
                                            />
                                            {this.state.isOrientadorInvalid && <div className="invalid-feedback">Por favor, selecione um orientador.</div>}
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.closeModal('Edit')}>
                        Fechar
                    </Button>
                    <button type='submit' className="btn btn-primary">Salvar</button>
                </Modal.Footer>
                </form>
            </Modal>
            
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
