import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';

function withNavigate(Component) {
    return (props) => {
      const navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

class Orientador extends Component {
  
    state = {
        orientadores: []
    }

    backToHome = () => {
        this.props.navigate('/home');
    }   

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
                .then((data) => this.setState({orientadores: data}))
    }

    componentDidMount() {
        this.fillList();
    }

    render() {
        return (
        <div>
            <button className='btn btn-primary m-3' onClick={this.backToHome}><i className='bi bi-arrow-left'></i></button>
            <table className="table table-bordered table-hover" id="data-table">
                <tbody>
                    {this.state.orientadores && this.state.orientadores.length > 0 ? this.state.orientadores.map(orientador => (
                    <tr key={orientador.id}>
                        <th scope="row">{orientador.id}</th>
                        <td>{orientador.nomeCompleto}</td>
                        <td className="text-center">{orientador.cpf}</td>
                    </tr>
                    )) : null}
                </tbody>
            </table>
        </div>
        )
  }
}

export default withNavigate(Orientador);
