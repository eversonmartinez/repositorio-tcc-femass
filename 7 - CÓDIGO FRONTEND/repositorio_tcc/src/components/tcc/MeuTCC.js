import React, { Component } from 'react'
import Navbar from '../navbar/Navbar';
import '../../assets/css/tcc.css';
import Select from 'react-select'
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { TCCService } from '../../service/TCCService';
import { CategoriaService } from '../../service/CategoriaService';
import { SubcategoriaService } from '../../service/SubcategoriaService';


//const defaultSelectOption = { value: '', label: 'Selecione...', isDisabled: true };

class MeuTCC extends Component {
  
    state = {
        tccExistente: false,
        originalresumo: '',
        resumo: '',
        originaltituloTcc: '',
        tituloTcc: '',
        curso: '',
        aluno: '',
        orientador: '',
        originalcategoria: '',
        selectedCategoria: '',
        originalsubcategoria: '',
        selectedSubcategoria: '',
        originalkeywords: '',
        keywords: '',
        changesMade: false,
        optionsCategorias: [],
        optionsSubcategorias: []
    }

    tccService = new TCCService();
    categoriaService = new CategoriaService();
    subcategoriaService = new SubcategoriaService();

    handleChange = (event) => {
        this.setState({ changesMade: true });
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChangeSelect = (option, elementName) => {
        this.setState({ changesMade: true });
        if(elementName.startsWith('selectedCategoria')) this.fillOptionsSubcategorias(option.value);
        this.setState({ [elementName]: option });
    }

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
        this.categoriaService.listAll()
            .then((response) => {
                const optionsCategorias = response.data.map(categoria => ({
                    value: categoria.id,
                    label: categoria.nomeCategoria
                }));
                this.setState({ optionsCategorias });
            });
    }

    fillOptionsSubcategorias = (categoria) => {
        this.subcategoriaService.findAllByCategoria(categoria)
            .then((response) => {
                if(response.status !== 200){ throw new Error('Erro na requisição: ' + response.status); }
                
                const optionsSubcategorias = response.data.map(subcategoria => ({
                    value: subcategoria.id,
                    label: subcategoria.nomeSubcategoria
                }));
                this.setState({ optionsSubcategorias });
                return;
            })
            .catch((error) => { });
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

    revertFields = () => {
        this.setState({
            tituloTcc: this.state.originaltituloTcc,
            resumo: this.state.originalresumo,
            selectedCategoria: this.state.originalcategoria,
            selectedSubcategoria: this.state.originalsubcategoria,
            selectedKeywords: this.state.originalkeywords,
            changesMade: false
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
        //Método ainda não implementado no backend  

        // this.tccService.getMyTcc()
        //     .then((response) => {
        //         this.setState({
        //             tccExistente: true,
        //             originaltituloTcc: response.data.titulo,
        //             tituloTcc: response.data.titulo,
        //             originalresumo: response.data.resumo,
        //             resumo: response.data.resumo,
        //             curso: response.data.curso,
        //             aluno: response.data.aluno,
        //             orientador: response.data.orientador,
        //             originalcategoria: response.data.categoria,
        //             selectedCategoria: response.data.categoria,
        //             originalsubcategoria: response.data.subcategoria,
        //             selectedSubcategoria: response.data.subcategoria,
        //             originalkeywords: response.data.keywords,
        //             keywords: response.data.keywords
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
        this.fillOptionsCategorias();
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
                                    <label htmlFor="inputStudent" className="form-label fw-bold">Autor</label>
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
                                        className={`basic-single`}
                                        classNamePrefix="select"
                                        name="selectedCategoria"
                                        id="selectCategoria"
                                        options={this.state.optionsCategorias}
                                        value={this.state.selectedCategoria}
                                        onChange={(selectedOption, actionMeta) => this.handleChangeSelect(selectedOption, actionMeta.name)}
                                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                                        placeholder="Selecione..."
                                    />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <label htmlFor="selectSubcategoria" className="form-label fw-bold">Subcategoria</label>
                                    <Select
                                        className={`basic-single`}
                                        classNamePrefix="select"
                                        name="selectedSubcategoria"
                                        id="selectSubcategoria"
                                        options={this.state.optionsSubcategorias}
                                        value={this.state.selectedSubcategoria}
                                        onChange={(selectedOption, actionMeta) => this.handleChangeSelect(selectedOption, actionMeta.name)}
                                        isDisabled={!this.state.selectedCategoria}
                                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
                                        placeholder={`${!this.state.selectedCategoria ? 'Selecione uma categoria...' : 'Selecione...'}`}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12">
                                    <label htmlFor="selectKeywords" className="form-label fw-bold">Palavras-Chave</label>
                                    <Select
                                        className={`basic-single`}
                                        classNamePrefix="select"
                                        name="selectKeywords"
                                        id="selectKeywords"
                                        options={this.state.optionsCursos}
                                        value={this.state.selectedCurso}
                                        noOptionsMessage={() => 'Nenhuma opção encontrada'}
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
                                        onClick={this.revertFields} 
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
