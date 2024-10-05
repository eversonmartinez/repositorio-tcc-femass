import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';

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
            <button className='btn btn-primary m-3' onClick={this.backToHome}><i className='bi bi-arrow-left'></i></button>
            <table className="table table-bordered table-hover" id="data-table">
                <tbody>
                    {this.state.tccs && this.state.tccs.map( tcc => {
                            return <tr key={tcc.id}>
                                <th scope="row">{tcc.id}</th>
                                <td>{tcc.nomeCompleto}</td>
                                <td className="text-center"></td>
                                <td className="text-center"></td>
                                <td className="text-center"></td>
                            </tr>
                        })}
                </tbody>
            </table>
        </div>
        )
  }
}

export default withNavigate(TCC);
