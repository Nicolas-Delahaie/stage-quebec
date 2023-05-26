/**
 * @warning Les required et input type=email ne fonctionne pas, on peut valider le formulaire avec des champs vides
 */

//Elements graphiques
import styled from 'styled-components'
import toast, { Toaster } from "react-hot-toast"
import { Input, InputSubmit } from "../components/forms"

import { Loader, colors, fonts } from "../utils/styles"

//Autre
import { useState, useEffect } from "react"
import { redirect, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../utils/context/context"


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
    const [erreur, setErreur] = useState(null);
    const [isConnecting, setIsConnecting] = useState(null);

    const navigate = useNavigate();     //Pour naviguer entre les pages
    const { estConnecte, connexion, deconnexion, apiAccess } = useContext(AppContext);


    useEffect(() => {
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
    }, []);

    const clicConnexion = async (e) => {
        e.preventDefault();         //Pour empecher le comportement normal de validation du formulaire
        setErreur(null);

        //Validation du mail
        const regexMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexMail.test(mail)) {
            setErreur("Adresse mail invalide");
        }
        else {
            const dureeSessionEnMin = resterConnecte ? 60 * 24 * 100 : 60 * 12;    //Si on coche la case, on reste connecte pour 100 jours, sinon pour 12h

            // -- Envoi de la requete --
            setIsConnecting(true);
            const rep = await apiAccess({
                url: `http://localhost:8000/api/login`,
                method: "post",
                body: {
                    email: mail,
                    password: mdp,
                    duration: dureeSessionEnMin,
                },
                needAuth: false
            });

            // -- Traitement de la reponse --
            if (rep.success) {
                //Connexion pour 100 jours si on coche la case, sinon pour 24h
                connexion(rep.datas.token, dureeSessionEnMin, rep.datas.type);
                navigate("/authentifie");
            }
            else {
                setIsConnecting(false);
                if (rep.statusCode === 401) {
                    setErreur("Mot de passe ou mail incorrect");
                }
                else if (rep.statusCode === 422) {
                    setErreur("Mauvais format de reponse");
                }
                else {
                    setErreur("Erreur de serveur");
                }
            }
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
                        autoFocus
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
                {erreur && <PErreur>{erreur}</PErreur>}
                {isConnecting && <Loader />}
                {isConnecting || <InputSubmit type="submit" value="Se connecter" />}
            </FormAuthentification>
        </DivAuthentification>
    )
}
export default Login