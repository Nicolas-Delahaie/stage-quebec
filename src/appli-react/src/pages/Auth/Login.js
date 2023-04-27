import {Input, Bouton } from "../../components/forms"
import { colors,fonts } from "../../utils/styles"

import styled from 'styled-components'

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { AppContext } from "../../utils/context/context"
import { useContext } from "react"


/* ---------------------------------- STYLE --------------------------------- */

const DivAuthentification = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80.5vh;
`;

const H1Authentification = styled.h1`
    font-family: ${fonts.titre};
    font-size: 2rem;
    color: ${colors.bleuFonce};
`;

const FormAuthentification = styled.form`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
`;

const DivLabelInput = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const PErreur = styled.p`
    color: ${colors.rouge};
`;

/* ----------------------------------- DOM ---------------------------------- */

function Login() {
    const [mail, setMail] = useState("");
    const [mdp, setMdp] = useState("");
    const [erreur, setErreur] = useState("");
    const navigate = useNavigate();
    const { setIsConnected } = useContext(AppContext);


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
        <DivAuthentification>
            <H1Authentification>Connexion</H1Authentification>
            <FormAuthentification onSubmit={connexion}>
                <DivLabelInput>
                <label>Adresse professionnelle</label>
                <Input type="text"
                    required
                    value={mail}
                    onChange={(e) => setMail(e.target.value)} />
                </DivLabelInput>
                <DivLabelInput>
                <label>Mot de passe</label>
                <Input type="password"
                    required
                    value={mdp}
                    onChange={(e) => setMdp(e.target.value)} />
                </DivLabelInput>
                <Bouton>Se connecter</Bouton>
                <PErreur>{erreur}</PErreur>
            </FormAuthentification>
        </DivAuthentification>
    )
}

export default Login