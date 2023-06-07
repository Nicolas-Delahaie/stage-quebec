/* --------------------------------- IMPORT --------------------------------- */
// Librairies
import { useState, useEffect, useContext } from "react"

// Fichiers
import { AppContext } from '../utils/context/context';

// Composants
import Loader from '../components/Loader.js';
import CarteHorizontale from "../components/CarteHorizontale"

// Images
import Administation from "../assets/images/Departements/Administration.svg"
import analyses_biomedicales from "../assets/images/Departements/analyses_biomedicales.svg"
import architecture from "../assets/images/Departements/architecture.svg"
import Art from "../assets/images/Departements/Art.svg"
import Biologie from "../assets/images/Departements/Biologie.svg"
import chimie from "../assets/images/Departements/chimie.svg"
import Design_interieur from "../assets/images/Departements/Design_interieur.svg"
import electronique from "../assets/images/Departements/electronique.svg"
import EPS from "../assets/images/Departements/EPS.svg"
import GTEA from "../assets/images/Departements/GTEA.svg"
import informatique from "../assets/images/Departements/informatique.svg"
import langues_modernes from "../assets/images/Departements/langues_modernes.svg"
import lettres from "../assets/images/Departements/lettres.svg"
import maths from "../assets/images/Departements/maths.svg"
import mecanique from "../assets/images/Departements/mecanique.svg"
import Philosophie from "../assets/images/Departements/Philosophie.svg"
import physique from "../assets/images/Departements/physique.svg"
import sciences_humaines from "../assets/images/Departements/sciences_humaines.svg"
import Soins_infirmiers from "../assets/images/Departements/Soins_infirmiers.svg"
import techniques_travail_social from "../assets/images/Departements/techniques_travail_social.svg"


/* -------------------- FONCTIONS DE LA PAGE DEPARTEMENTS ------------------- */
function rechercheImage(nomDepartement) {
    const imagesDepartement = {
        "Administration": Administation,
        "Analyses Biomedicales": analyses_biomedicales,
        "Architecture": architecture,
        "Arts Visuels": Art,
        "Biologie": Biologie,
        "Chimie": chimie,
        "Design Interieur": Design_interieur,
        "Education Physique": EPS,
        "GTEA": GTEA,
        "Genie Mecanique": mecanique,
        "Genie Electronique": electronique,
        "Informatique": informatique,
        "Langues Modernes": langues_modernes,
        "Lettres": lettres,
        "Mathémathiques": maths,
        "Philisophie": Philosophie,
        "Physique": physique,
        "Sciences humaines": sciences_humaines,
        "Soins Infirmiers": Soins_infirmiers,
        "Techniques Travail Social": techniques_travail_social,
    }

    return imagesDepartement[nomDepartement] || null;
}

/* ----------------------------------- DOM ---------------------------------- */

function Departements() {
    const { apiAccess } = useContext(AppContext);

    const [isLoading, setIsLoading] = useState(null);
    const [departements, setDepartements] = useState(null);
    const [erreur, setErreur] = useState(null)

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
                                urlImage={rechercheImage(departement.nom)}
                                lien={`/departements/${departement.id}`}
                            >
                                <p>
                                    Coordonnateur : {departement.coordonnateur.prenom} {departement.coordonnateur.nom}<br />
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

