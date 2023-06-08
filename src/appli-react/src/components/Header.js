// Librairies
import { useContext, useState, useEffect } from "react"
import { AppContext } from "../utils/context/context"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

// Images
import home from "../assets/svg/home.svg"



/* ----------------------------------- DOM ---------------------------------- */

function Header() {
    const { estConnecte, deconnexion, getType } = useContext(AppContext);
    const [type, setType] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        setType(getType());
    }, [estConnecte])

    return (
        <header className={estConnecte ? "headerConnecte" : "headerDeconnecte"}>
            <Link to="/">
                <img src={home} alt="logo" className="logo" />
            </Link>


            <div className="zoneBoutons">
                {estConnecte && type === "administrateur" &&
                    <>
                        <Link className="btnLien" to="/scenarios">Scénarios</Link>
                        <Link className="btnLien" to="/departements/">Départements</Link>
                        <Link className="btnLien" to="profil">Mon profil</Link>
                    </>
                }
                {estConnecte && type === "responsable" &&
                    <>
                        <Link className="btnLien" to="/scenarios">Scénarios</Link>
                        <Link className="btnLien" to="/departements/">Départements</Link>
                        <Link className="btnLien" to="profil">Mon profil</Link>
                    </>
                }
                {estConnecte && type === "professeur" &&
                    <>
                        <Link className="btnLien" to="/scenarios">Scénarios</Link>
                        <Link className="btnLien" to="profil">Mon profil</Link>
                    </>
                }
            </div>

            {estConnecte ?
                <button className="btnConexion" onClick={() => deconnexion()}>Se déconnecter</button>
                :
                <Link className="btnConexion btnLien" to="/login"> Se connecter</Link>
            }
        </header>
    )
}

export default Header