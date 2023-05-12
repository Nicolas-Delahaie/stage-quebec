/**
 * @warning Les required et input type=email ne fonctionne pas, on peut valider le formulaire avec des champs vides
 */

//Elements graphiques
import styled from 'styled-components'
import toast, { Toaster } from "react-hot-toast"
import { Input, InputSubmit } from "../../components/forms"

import { colors, fonts } from "../../utils/styles"

//Autre
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../../utils/context/context"


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

const InputChkbx = styled.input`
    justify-self: center;
`;

function Login() {
    // Variables de la page
    const [mail, setMail] = useState("");
    const [mdp, setMdp] = useState("");
    const [resterConnecte, setResterConnecte] = useState(false);
    const [erreur, setErreur] = useState("");

    const navigate = useNavigate();     //Pour naviguer entre les pages
    const { estConnecte, connexion, deconnexion } = useContext(AppContext);

    // Deconnecte l utilisateur s il est deja connecte
    if (estConnecte && mail === "" && mdp === "" && !resterConnecte) {
        console.log("Deconnexion");
        deconnexion();
        /**
         * @warning FONCTIONNE MAL (affiche en double) a cause du react strictmod dans index.js
         * @details s'affiche en double car le temps que deconnexion modifie la variable estConnecte, la deuxieme page chargee a le temps de s'afficher
        */
        toast.success("Vous avez été déconnecté", { duration: 8000, position: "top-center" });
    }

    const clicConnexion = (e) => {
        e.preventDefault();         //Pour empecher le comportement normal de validation du formulaire

        //Validation du mail
        const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexMail.test(mail)) {
            setErreur("Adresse mail invalide");
        }
        else {
            const duree = resterConnecte ? 24 * 100 : 1 / 60;    //Si on coche la case, on reste connecte pour 100 jours, sinon pour 24h

            fetch('http://localhost:8000/api/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: mail,
                    password: mdp,
                    duration: duree
                })
            })
                .then((res) => {
                    if (!res.ok) {
                        if (res.status === 401) {
                            throw Error("Mot de passe ou mail incorrect");
                        }
                        else if (res.status === 422) {
                            throw Error("Mauvais format de reponse");
                        }
                        else {
                            throw Error("Erreur de serveur");
                        }
                    }
                    else {
                        return res.json();
                    }
                })
                .then(data => {
                    //Connexion pour 100 jours si on coche la case, sinon pour 24h
                    connexion(data.token, duree);
                    navigate(-1);
                })
                .catch((err) => {
                    setErreur(err.message)
                })
        }

    }

    return (
        <DivAuthentification>
            <Toaster />
            <H1Authentification>Connexion</H1Authentification>
            <FormAuthentification onSubmit={clicConnexion}>
                <DivLabelInput>
                    <label>Adresse professionnelle</label>
                    <Input type="email"
                        required={true}
                        value={mail}
                        onChange={(e) => setMail(e.target.value)} />
                </DivLabelInput>
                <DivLabelInput>
                    <label>Mot de passe</label>
                    <Input type="password"
                        required={true}
                        value={mdp}
                        onChange={(e) => setMdp(e.target.value)} />
                </DivLabelInput>
                <DivLabelInput>
                    <label>Rester connecté</label>
                    <InputChkbx type="checkbox"
                        checked={resterConnecte}
                        onChange={(e) => setResterConnecte(e.target.checked)} />
                </DivLabelInput>
                <InputSubmit type="submit" value="Se connecter" />
                <PErreur>{erreur}</PErreur>
            </FormAuthentification>
        </DivAuthentification>
    )
}
export default Login