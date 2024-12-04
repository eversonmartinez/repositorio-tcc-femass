import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../assets/css/tcc.css';
import Select from 'react-select'
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { motion, AnimatePresence } from 'framer-motion';
import { TCCService } from '../../service/TCCService';
import { AlunoService } from '../../service/AlunoService';
import { OrientadorService } from '../../service/OrientadorService';
import { CursoService } from '../../service/CursoService';


const defaultSelectOption = { value: '', label: 'Selecione...', isDisabled: true };

class MeuTCC extends Component {
  
    state = {
        tccExistente: false,
        resumo: '',
        tituloTcc: '',
        curso: '',
        aluno: '',
        orientador: '',
        categoria: '',
        subcategoria: '',
        keywords: '',
        changesMade: true,
    }

    tccService = new TCCService();

    handleChange = (event) => {
        if(event.target.name.startsWith('filter')) this.applyFilters();
        this.setState({ [event.target.name]: event.target.value });
    };

    fillList = () => {
        this.tccService.listAll()
            .then((response) => this.setState({tccs: response.data, filteredItems: response.data}))
            .catch((error) => {
                toast.error('Erro ao carregar os dados', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            });
    }

    fillOptionsCategorias = () => {
        this.cursoService.listAll()
            .then((response) => {
                    const optionsCursos = response.data.map(curso => ({
                        value: curso.id,
                        label: curso.nome
                    }));
                    this.setState({ optionsCursos });
            })
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

        let data = {
            "titulo": this.state.tituloTcc,
            "idAluno": this.state.selectedAluno.value,
            "idOrientador": this.state.selectedOrientador.value,
            "idCurso": this.state.selectedCurso.value
        }

        if(this.state.resumo) {
            data.resumo = this.state.resumo;
        }

        var request = null;
        if(!this.state.toEditItem){
            request = this.tccService.insert(data);
        } else {
            request = this.tccService.update(this.state.toEditItem.id, data);
        }

        // .then(response => {
        //     if (response.ok) {
        //         return response.json();
        //     } else {
        //         throw new Error('Erro na requisição: ' + response.status);
        //     }
        // })
        // .then(data => {
        request
        .then(response => {
            if(this.state.toEditItem){
                this.setState({showModalEdit: false})
                toast.success('TCC atualizado!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            } else{
                document.getElementById('btnCloseModal').click();
                toast.success('TCC criado!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            this.clearState();
            this.fillList();
            // Lógica para lidar com a resposta da API
        })
        .catch(error => {
            toast.error('Ocorreu um erro', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            // Lógica para lidar com o erro
        });
    }

    getMyTcc = () => {
        // this.tccService.getMyTcc()
        //     .then((response) => {
        //         this.setState({
        //             tccExistente: true,
        //             tituloTcc: response.data.titulo,
        //             resumo: response.data.resumo,
        //             curso: response.data.curso,
        //             aluno: response.data.aluno,
        //             orientador: response.data.orientador,
        //             categoria: response.data.categoria,
        //             subcategoria: response.data.subcategoria,
        //             keywords: response.data.keywords,
        //         });
        //     })
        //     .catch((error) => {
        //         toast.error('Erro ao carregar os dados', {
        //             position: "top-right",
        //             autoClose: 2000,
        //             hideProgressBar: false,
        //             closeOnClick: true,
        //             pauseOnHover: true,
        //             draggable: true,
        //             progress: undefined,
        //             });
        //     });
    }

    componentDidMount() {
        this.getMyTcc();
    }

    render() {
        return (
        <div className="tcc-page bg-light min-vh-100">
            <Navbar />
            <ToastContainer/>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='page-content container-fluid px-4'
            >
                <div className="row mb-4 mt-4">
                    <div className="col-12">
                        <h1 className='display-5 fw-bold mb-4 tittle tittleAfter'>Meu TCC</h1>
                    </div>
                </div>

                        {/* <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="card border-0 shadow-sm"
                        > */}
                        {/* </motion.div> */}

                <div className='px-4'>
                    <div className="document-container">
                        <div className="mb-3 row">
                            <div className='row mb-4'>
                                <div className="col-12">
                                    <label htmlFor="inputTitle" className="form-label fw-bold">Título</label>
                                    <input type="text" id="inputTitle" className="form-control" name="tituloTcc" onChange={this.handleChange} value={this.state.tituloTcc} required/>
                                </div>
                            </div>
                            <div className='row mb-4'>
                                <div className="col-12">
                                    <label htmlFor="inputOverview" className="form-label fw-bold">Resumo</label>
                                    <textarea rows="5" id="inputOverview" className='form-control' style={{resize: "none"}} name="resumo" onChange={this.handleChange} value={this.state.resumo}></textarea>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className="col-12">
                                    <label htmlFor="inputCourse" className="form-label fw-bold">Curso</label>
                                    <input type="text" id="inputCourse" disabled className='form-control' />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className="col-sm-12 col-md-6 mb-sm-3 mb-md-0">
                                    <label htmlFor="inputStudent" className="form-label fw-bold">Aluno</label>
                                    <input type="text" id="inputStudent" className="form-control" disabled />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <label htmlFor="inputOrientador" className="form-label fw-bold">Orientador</label>
                                    <input type="text" id="inputOrientador" className="form-control" disabled />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className="col-sm-12 col-md-6 mb-sm-3 mb-md-0">
                                    <label htmlFor="selectCategoria" className="form-label fw-bold">Categoria</label>
                                    <Select
                                        className={`basic-single ${this.state.isCursoInvalid ? 'is-invalid' : ''}`}
                                        classNamePrefix="select"
                                        name="selectCategoria"
                                        id="selectCategoria"
                                        defaultValue={defaultSelectOption}
                                        options={this.state.optionsCursos}
                                        value={this.state.selectedCurso}
                                        placeholder="Selecione..."
                                    />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <label htmlFor="selectSubcategoria" className="form-label fw-bold">Subcategoria</label>
                                    <Select
                                        className={`basic-single ${this.state.isCursoInvalid ? 'is-invalid' : ''}`}
                                        classNamePrefix="select"
                                        name="selectSubcategoria"
                                        id="selectSubcategoria"
                                        defaultValue={defaultSelectOption}
                                        options={this.state.optionsCursos}
                                        value={this.state.selectedCurso}
                                        placeholder="Selecione..."
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12">
                                    <label htmlFor="selectKeywords" className="form-label fw-bold">Palavras-Chave</label>
                                    <Select
                                        className={`basic-single ${this.state.isCursoInvalid ? 'is-invalid' : ''}`}
                                        classNamePrefix="select"
                                        name="selectKeywords"
                                        id="selectKeywords"
                                        defaultValue={defaultSelectOption}
                                        options={this.state.optionsCursos}
                                        value={this.state.selectedCurso}
                                        placeholder="Selecione..."
                                    />
                                </div>
                            </div>
                        </div>
                        {this.state.changesMade &&
                            <div className="row mt-4 actions" >
                                <div className="col-12 d-flex justify-content-end gap-3">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => this.closeModal('Deletion')} 
                                        className='px-4'
                                    >
                                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                                        Reverter
                                    </Button>
                                    <Button 
                                        variant="success" 
                                        onClick={() => this.closeModal('Deletion')} 
                                        className='px-4'
                                    >
                                        <i className="bi bi-check-lg me-2"></i>
                                        Salvar
                                    </Button>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </motion.div>

        </div>
        )
  }
}

export default MeuTCC;
