/* --------------------------------- IMPORT --------------------------------- */

// FORM et LAYOUT
import CarteAccueil from "../components/CarteAccueil"

// IMAGES 
import Repartition_plusieurs from "../assets/images/Home/Repartition_plusieurs.svg"
import Tableau from "../assets/images/Home/Tableau.svg"
import Calendrier from "../assets/images/Authentifie/Calendrier.svg"
import Repartir from "../assets/images/Authentifie/Repartir.svg"
import Departements from "../assets/images/Authentifie/Departements.svg"

// LIBRAIRIES
import { useContext, useState, useEffect } from "react"
import { AppContext } from "../utils/context/context"


/* ----------------------------------- DOM ---------------------------------- */

function Home() {
    const { getType, estConnecte } = useContext(AppContext);
    const [type, setType] = useState(getType());

    useEffect(() => {
        setType(getType());
    }, [])

    return (
        <div id="accueil">
            {
                estConnecte ?
                    <div id="authentifie">
                        {type === "administrateur" && <h2>Admin</h2>}
                        {type === "responsable" &&
                            <>
                                <CarteAccueil urlImage={Repartir} titre={'Voir mes scénarios'} texteBouton={'Mes scénarios'} lien={'/scenarios'} />
                                <CarteAccueil urlImage={Calendrier} titre={'Gérer mes contraintes'} texteBouton={'Mes contraintes'} lien={'/profil'} />
                                <CarteAccueil urlImage={Departements} titre={'Voir les départements'} texteBouton={'Les départements'} lien={'/departements/'} />
                            </>
                        }
                        {type === "professeur" &&
                            <>
                                <CarteAccueil urlImage={Repartir} titre={'Voir mes scénarios'} texteBouton={'Mes scénarios'} lien={'/scenarios'} />
                                <CarteAccueil urlImage={Calendrier} titre={'Gérer mes contraintes'} texteBouton={'Mes contraintes'} lien={'/profil'} />
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