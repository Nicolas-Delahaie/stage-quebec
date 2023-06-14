// Librairies
import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import { AppContext } from "../utils/context/context"

// Composants
import Loader from '../components/Loader.js';

function Login() {
    // Variables de la page
    const [mail, setMail] = useState("");
    const [mdp, setMdp] = useState("");
    const [resterConnecte, setResterConnecte] = useState(false);
    const [erreur, setErreur] = useState(null);
    const [isConnecting, setIsConnecting] = useState(null);

    const navigate = useNavigate();     //Pour naviguer entre les pages
    const { estConnecte, connexionFront, deconnexion, apiAccess } = useContext(AppContext);


    useEffect(() => {
        // Deconnecte l utilisateur s il est deja connecte
        if (estConnecte && mail === "" && mdp === "" && !resterConnecte) {
            deconnexion();
            /**
             * @warning FONCTIONNE MAL (affiche en double) a cause du react strictmod dans index.js
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
                connexionFront(rep.datas.token, dureeSessionEnMin, rep.datas.type, rep.datas.estCoordo);
                navigate(-1);
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
        <div className="page" id="login">
            <Toaster />
            <section>
                <h2>Connexion</h2>
                <form onSubmit={clicConnexion} >
                    <div className="DivInput">
                        <label>Adresse professionnelle</label>
                        <input className="champsSaisie"
                            type="email"
                            required={true}
                            value={mail}
                            autoFocus
                            onChange={(e) => setMail(e.target.value)} />
                    </div>
                    <div className="DivInput">
                        <label>Mot de passe</label>
                        <input className="champsSaisie"
                            type="password"
                            required={true}
                            value={mdp}
                            onChange={(e) => setMdp(e.target.value)} />
                    </div>
                    <div className="DivCheckbox">
                        <input type="checkbox"
                            checked={resterConnecte}
                            onChange={(e) => setResterConnecte(e.target.checked)} />
                        <label>Rester connecté</label>
                    </div>
                    {erreur && <p className="centrerH">{erreur}</p>}
                    {isConnecting &&
                        <div className="centrerH">
                            <Loader />
                        </div>}
                    {!isConnecting && <input className="btnValider" type="submit" value="Se connecter" />}
                </form>
            </section>
        </div>
    )
}
export default Login