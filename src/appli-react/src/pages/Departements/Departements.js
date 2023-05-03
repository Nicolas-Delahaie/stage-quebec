/* --------------------------------- IMPORT --------------------------------- */
/*import pour les fonctionnalités*/
import { useState, useEffect } from "react"

/* import pour le style */
import styled from "styled-components"
import { Loader } from "../../utils/styles"

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
    switch (nomDepartement) {
        case "Administration":
            return Administation;
        case "Analyses Biomedicales":
            return analyses_biomedicales;
        case "Architecture":
            return architecture;
        case "Arts Visuels":
            return Art;
        case "Biologie":
            return Biologie;
        case "Chimie":
            return chimie;
        case "Design Interieur":
            return Design_interieur;
        case "Education Physique":
            return EPS;
        case "GTEA":
            return GTEA;
        case "Genie Mecanique":
            return mecanique;
        case "Genie Electronique":
            return electronique;
        case "Informatique":
            return informatique;
        case "Langues Modernes":
            return langues_modernes;
        case "Lettres":
            return lettres;
            /*fautes à corriger*/
        case "Mathémathiques":
            return maths;
        case "Philisophie":
            return Philosophie;
            /*  ------------------ */
        case "Physique":
            return physique;
        case "Sciences humaines":
            return sciences_humaines;
        case "Soins Infirmiers":
            return Soins_infirmiers;
        case "Techniques Travail Social":
            return techniques_travail_social;
        default:
            return null;
    }
}

/* ----------------------------------- DOM ---------------------------------- */

function Departements() {
    
    const [isLoading, setIsLoading] = useState(false);
    const [departementsData, setDepartementsData] = useState({});
    const [coordonnateur, setCoordonnateur] = useState({});
    const [copieCoordonnateur, setCopieCoordonnateur] = useState({});


    const rechercheCoordonnateur = (idCoordonnateur) => {
        fetch(`http://localhost:8000/api/users/${idCoordonnateur}`)
        .then((response) => response.json())
        .then((response) => {
            setCoordonnateur(response);
            setCopieCoordonnateur({...coordonnateur});
        })
        .catch((error) => {
            console.log(error);
        }
        )
    }

    useEffect(() => { 
        setIsLoading(true);
        fetch("http://localhost:8000/api/departements")
            .then((response) => response.json())
            .then((response) => {
                console.log('fetch');
                setDepartementsData(response);
            })

            .catch((error) => {
                console.log(error);
            });
            setIsLoading(false);
    }, [])

    return (
        <DivPageDepartements>
            <ArticleTitle texte="Départements" />
            {
                isLoading || departementsData.length === undefined ?  (
                    <Loader />
                )
                    : (
                        <StyledDepartements>
                            {                               
                                departementsData.map( (departement) => (
                                    //rechercheCoordonnateur(departement.coordonnateur_id),
                                    <CarteHorizontale
                                        key={departement.id}
                                        titre={departement.nom}
                                        texte={departement.description}
                                        urlImage={rechercheImage(departement.nom)}
                                        lien={`/departements/${departement.id}`}
                                    >
                                        <p>Coordonnateur : {copieCoordonnateur.name}</p>
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

