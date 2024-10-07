import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../assets/css/tcc.css';

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

class TCC extends Component {
  
    state = {
        tccs: []
    }

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

    componentDidMount() {
        this.fillList();
    }

    render() {
        return (
        <div>
            <Navbar />
            <div className='page-content'>
                <h1 className='display-6 fw-bold text-decoration-underline p-3'>Trabalhos de Conclusão de Curso</h1>
                <div class="card mx-5 mb-4 w-25">
                    <div class="card-body">
                    <button type="button" className="btn btn-success fw-bold" data-bs-toggle="modal" data-bs-target="#insertionModal" onClick={this.beginInsertion}><i className="bi bi-plus-circle-dotted fs-6 me-2"></i>Incluir</button>
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
                                                <th scope="row">{tcc.id}</th>
                                                {/* <td>{tcc.nomeCompleto}</td> */}
                                                <td className="text-center">{tcc.titulo}</td>
                                                <td className="text-center">{tcc.aluno}</td>
                                                <td className="text-center">{tcc.orientador}</td>
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
            <div className="modal fade large-modal" id="insertionModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                <div
                    class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl"
                    role="document"
                >
                    <div class="modal-content">
                        <div class="modal-header bg-dark">
                            <h5 class="modal-title text-white" id="modalTitleId">
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
                        <div class="modal-body">
                            <div class="container">
                                <form>
                                    <div class="mb-3 row">
                                        <div class="col-8">
                                        <label
                                            for="inputName"
                                            class="col-4 col-form-label"
                                            >Name</label>
                                        
                                            <input
                                                type="text"
                                                class="form-control"
                                                name="inputName"
                                                id="inputName"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div class="col-8">
                                        <label
                                            for="inputName"
                                            class="col-4 col-form-label"
                                            >Name</label>
                                        
                                            <input
                                                type="text"
                                                class="form-control"
                                                name="inputName"
                                                id="inputName"
                                                placeholder="Name"
                                            />
                                        </div>
                                    </div>
                                    <fieldset class="mb-3 row">
                                        <legend
                                            class="col-form-legend col-4"
                                        >
                                            Group name
                                        </legend>
                                        <div
                                            class="col-8"
                                        >
                                            you can use radio and checkboxes here
                                        </div>
                                    </fieldset>
                                    <div class="mb-3 row">
                                        <div class="offset-sm-4 col-sm-8">
                                            <button type="submit" class="btn btn-primary">
                                                Action
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            
                            
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary">Salvar</button>
                        </div>
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
