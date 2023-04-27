// import Input from "../../components/forms/Input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/pageLogin.css"
import styled from 'styled-components'
import { AppContext } from "../../utils/context/context"

function Login() {
    const [mail, setMail] = useState("");
    const [mdp, setMdp] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();


    const connexion = (e) => {
        e.preventDefault();         //Pour empecher le comportement normal du formulaire
        const tentativeConnexion = { mail, mdp };
        fetch('http://localhost:8000/api/checkUser', {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([tentativeConnexion])
        })
            .then((res) => {
                if (!res.ok) { // error coming back from server
                    throw Error('could not fetch the data for that resource');
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                if (data.status === "success") {
                    /**@todo gerer la connexion */
                    setIsConnected(true);
                    navigate(-1);
                }
                else {
                    setErreur("Mauvais identifiants")
                }
            })
            .catch((err) => {
                console.log(err)
                setErreur("Acces au serveur impossible")
            })
    }

    return (
        <div className="authentification">
            <h1>Login</h1>
            <form onSubmit={connexion}>
                <label>Adresse professionnelle</label>
                <input type="text"
                    required
                    value={mail}
                    onChange={(e) => setMail(e.target.value)} />
                <label>Mot de passe</label>
                <input type="password"
                    required
                    value={mdp}
                    onChange={(e) => setMdp(e.target.value)} />
                <button>Se connecter</button>
                <p>{erreur}</p>
            </form>
        </div>
    )
}

export default Login