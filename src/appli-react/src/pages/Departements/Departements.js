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

/* ----------------------------------- DOM ---------------------------------- */

function Departements() {

    const [isLoading, setIsLoading] = useState(false);
    const [departementsData, setDepartementsData] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:8000/departements")
            .then((response) => response.json())
            .then(({ departementsData }) => {
                setDepartementsData(departementsData);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    return (
        <DivPageDepartements>
        <ArticleTitle texte="Départements" />
        {
            isLoading ? (
                <Loader />
                )
                : (
                <StyledDepartements>
                    {departementsData.map((departement) => (
                        <CarteHorizontale
                            key={departement.id}
                            titre={departement.nom}
                            texte={departement.description}
                            image={departement.image}
                            lien={`/departements/${departement.id}`}
                        >
                            <p>Coordonateur : {departement.coordonateur}</p>
                            <p>Nombre d'étudiant : {departement.nombreEtdiant}</p>
                            <p>Nombre d'enseignant : {departement.nombreProfesseur}</p>
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