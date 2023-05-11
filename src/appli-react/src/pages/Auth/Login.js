// import Input from "../../components/forms/Input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import { useContext } from "react"
import { AppContext } from "../../utils/context/context"
import "../../styles/pageLogin.css"

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

        fetch('http://localhost:8000/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: mail,
                password: mdp
            })
        })
            .then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        throw Error("Mauvais identifiants");
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
                connexion(data.token, resterConnecte, data.expired_at);
                navigate(-1);
            })
            .catch((err) => {
                setErreur(err.message)
            })
    }

    return (
        <div className="authentification">
            <Toaster />
            <h1>Login</h1>
            <form onSubmit={clicConnexion}>
                <label>Adresse professionnelle</label>
                <input type="email"
                    required
                    value={mail}
                    onChange={(e) => setMail(e.target.value)} />

                <label>Mot de passe</label>
                <input type="password"
                    required
                    value={mdp}
                    onChange={(e) => setMdp(e.target.value)} />

                <label>Rester connecté</label>
                <input type="checkbox"
                    checked={resterConnecte}
                    onChange={(e) => setResterConnecte(e.target.checked)} />

                <button>Se connecter</button>
                <p>{erreur}</p>
            </form>
        </div>
    )
}

export default Login