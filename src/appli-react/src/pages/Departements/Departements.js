/* --------------------------------- IMPORT --------------------------------- */
/*import pour les fonctionnalités*/
import { useState, useEffect, useContext } from "react"
import { AppContext } from '../../utils/context/context';

/* import pour le style */
import styled from "styled-components"
import { Loader, fonts, colors } from "../../utils/styles"

/* import des composants */
import CarteHorizontale from "../../components/layout/CarteHorizontale"
import ArticleTitle from "../../components/forms/ArticleTitle"

/* import des images */
import Administation from "../../assets/images/Departements/Administration.svg"
import analyses_biomedicales from "../../assets/images/Departements/analyses_biomedicales.svg"
import architecture from "../../assets/images/Departements/architecture.svg"
import Art from "../../assets/images/Departements/Art.svg"
import Biologie from "../../assets/images/Departements/Biologie.svg"
import chimie from "../../assets/images/Departements/chimie.svg"
import Design_interieur from "../../assets/images/Departements/Design_interieur.svg"
import electronique from "../../assets/images/Departements/electronique.svg"
import EPS from "../../assets/images/Departements/EPS.svg"
import GTEA from "../../assets/images/Departements/GTEA.svg"
import informatique from "../../assets/images/Departements/informatique.svg"
import langues_modernes from "../../assets/images/Departements/langues_modernes.svg"
import lettres from "../../assets/images/Departements/lettres.svg"
import maths from "../../assets/images/Departements/maths.svg"
import mecanique from "../../assets/images/Departements/mecanique.svg"
import Philosophie from "../../assets/images/Departements/Philosophie.svg"
import physique from "../../assets/images/Departements/physique.svg"
import sciences_humaines from "../../assets/images/Departements/sciences_humaines.svg"
import Soins_infirmiers from "../../assets/images/Departements/Soins_infirmiers.svg"
import techniques_travail_social from "../../assets/images/Departements/techniques_travail_social.svg"

/* --------------------------------- STYLES --------------------------------- */

const StyledDepartements = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const DivPageDepartements = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 80.5vh;
`;

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

    const [isLoading, setIsLoading] = useState(true);
    const [departement, setDepartement] = useState({});
    const { apiAccess } = useContext(AppContext);

    const fetchDepartements = async () => {
        // -- Recuperation --
        const resultat = await apiAccess({
            url: `http://localhost:8000/api/departementsDetaille`,
            method: "get",
        });

        // -- Analyse --
        if (resultat.success) {
            setDepartement(resultat.datas);
        }
        else {
            /**
             * @todo Gerer l erreur
             */
        }
        setIsLoading(false);

    }

    useEffect(() => {
        fetchDepartements();
    }, [])

    return (
        <DivPageDepartements>
            <ArticleTitle texte="Départements" />
            {
                isLoading || departement.length === undefined ? (
                    <Loader />
                )
                    : (
                        <StyledDepartements>
                            {
                                departement.map((departement) => (
                                    <CarteHorizontale
                                        key={departement.id}
                                        titre={departement.nom}
                                        texteBouton={"Voir plus en détail"}
                                        urlImage={rechercheImage(departement.nom)}
                                        lien={`/departements/${departement.id}`}
                                    >
                                        <p>Coordonnateur : {departement.coordonnateur.name}</p>
                                        <p>Nombre d'étudiant : {departement.nbEleves}</p>
                                    </CarteHorizontale>
                                ))
                            }
                        </StyledDepartements>
                    )
            }
        </DivPageDepartements>
    )
}

export default Departements

