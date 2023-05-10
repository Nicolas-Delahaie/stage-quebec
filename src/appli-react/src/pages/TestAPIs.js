import styled from 'styled-components'
import { useContext } from 'react';
import { AppContext } from '../utils/context/context';
import Cookies from 'js-cookie';

function TestApis() {
    const { getToken } = useContext(AppContext);
    const token = getToken();             //Initialise le token
    console.log(token);

    var chemin;

    const envoi = (e) => {
        e.preventDefault();         //Pour empecher le comportement normal du formulaire

        fetch(`http://localhost:8000/api/${chemin}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(datas => console.log(datas))
            .catch(error => console.error(error));
    }

    console.log(getToken())
    return (
        <div>
            <h1>Test des APIs</h1>
            <p>Token : {token ? token : "Deconnecté"}</p>
            <form>
                <input value={chemin} onChange={(e) => chemin = e.target.value} />
                <button onClick={envoi}>ENVOIE REQUETE</button>
            </form>
        </div>
    )
}
export default TestApis