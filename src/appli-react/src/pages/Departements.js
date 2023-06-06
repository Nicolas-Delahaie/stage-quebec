/* --------------------------------- IMPORT --------------------------------- */
// Librairies
import { useState, useEffect, useContext } from "react"

// Fichiers
import { AppContext } from '../utils/context/context';

// Composants
import Loader from '../components/Loader.js';
import CarteHorizontale from "../components/CarteHorizontale"


/* ----------------------------------- DOM ---------------------------------- */

function Departements() {
    const { apiAccess } = useContext(AppContext);

    const [isLoading, setIsLoading] = useState(null);
    const [departements, setDepartements] = useState(null);
    const [erreur, setErreur] = useState(null)

    var image;

    const getDepartements = async () => {
        // -- Recuperation --
        setIsLoading(true);
        const resultat = await apiAccess({
            url: `http://localhost:8000/api/departements_detailles`,
            method: "get",
        });
        setIsLoading(false);

        // -- Analyse --
        if (resultat.success) {
            setDepartements(resultat.datas);
            image = require(`../assets/images/Departements/${resultat.datas[0].nom_image}`).default
        }
        else {
            setErreur(resultat.erreur);
        }
    }

    useEffect(() => {
        getDepartements();
    }, [])

    return (
        <div id="departements">
            <h1>Départements</h1>
            {erreur && <h1>{erreur}</h1>}
            {isLoading && <Loader />}
            {departements &&
                <div>
                    {
                        departements.map((departement) => (
                            <CarteHorizontale
                                key={departement.id}
                                titre={departement.nom}
                                urlImage={image}  //urlImage={require("../assets/images/Departements/Biologie.svg").default}
                                lien={`/departements/${departement.id}`}
                            >
                                <p>
                                    Coordonnateur : {departement.coordonnateur.name}<br />
                                    Nombre d'étudiant : {departement.nbEleves}
                                </p>
                            </CarteHorizontale>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default Departements

