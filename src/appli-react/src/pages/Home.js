/* --------------------------------- IMPORT --------------------------------- */

// IMAGES 
import Repartition_plusieurs from "../assets/images/Home/Repartition_plusieurs.svg"
import Tableau from "../assets/images/Home/Tableau.svg"
import Calendrier from "../assets/images/Authentifie/Calendrier.svg"
import Repartir from "../assets/images/Authentifie/Repartir.svg"
import Departements from "../assets/images/Authentifie/Departements.svg"

// LIBRAIRIES
import { useContext, useState, useEffect } from "react"
import { AppContext } from "../utils/context/context"
import { Link } from "react-router-dom"


/* ----------------------------------- DOM ---------------------------------- */

function Home() {
    const { getType, estConnecte } = useContext(AppContext);
    const [type, setType] = useState(getType());

    useEffect(() => {
        setType(getType());
    }, [])

    function CarteAccueil(urlImage, titre, lien) {
        return (
            <Link to={lien} className="carteAccueil">
                <img src={urlImage} alt={titre} />
                <h2>{titre}</h2>
            </Link>
        )
    }

    return (
        <div id="accueil">
            {
                estConnecte ?
                    <div id="authentifie">
                        {type === "administrateur" &&
                            <>
                                {CarteAccueil(Repartir, "Scénarios", "/scenarios")}
                                {CarteAccueil(Departements, "Départements", "/departements")}
                                {CarteAccueil(Calendrier, "Profil", "/profil")}
                            </>
                        }
                        {type === "responsable" &&
                            <>
                                {CarteAccueil(Repartir, "Scénarios", "/scenarios")}
                                {CarteAccueil(Departements, "Départements", "/departements")}
                                {CarteAccueil(Calendrier, "Profil", "/profil")}
                            </>
                        }
                        {type === "professeur" &&
                            <>
                                {CarteAccueil(Repartir, "Scénarios", "/scenarios")}
                                {CarteAccueil(Calendrier, "Profil", "/profil")}
                            </>
                        }
                    </div>
                    :
                    <div id="nonAuthentifie">
                        <h1 className>Présentation</h1>
                        <section>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                            </p>
                            <img src={Repartition_plusieurs} alt="image article" />
                        </section>
                        <h2>Fonctionnement</h2>
                        <section>
                            <img src={Tableau} alt="image article" />
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                                Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                            </p>
                        </section>
                    </div>
            }
        </div>
    )
}
export default Home