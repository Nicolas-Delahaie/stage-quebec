import { useContext } from 'react';
import { AppContext } from '../utils/context/context';
import { useState } from 'react';


function TestApis() {
    const { getToken } = useContext(AppContext);
    const [token, setToken] = useState(getToken());             //Initialise le token

    var chemin;

    const envoi = async (e) => {
        e.preventDefault();         //Pour empecher le comportement normal du formulaire

        //Verification de la validite du token
        const tokenRecupere = await getToken();
        setToken(tokenRecupere);

        if (tokenRecupere !== undefined) {
            fetch(`http://localhost:8000/api/${chemin}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token.slice(1, -1)}`,
                    'Content-type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(datas => console.log(datas))
                .catch(error => console.error(error));
        }
    }

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