/* --------------------------------- IMPORT --------------------------------- */

/* import pour le style */
import styled from "styled-components"

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

/* ----------------------------------- DOM ---------------------------------- */

function Departements(){
    return (
        <StyledDepartements>
            <ArticleTitle title="Départements" />
            <CarteHorizontale urlImage={Administation} titre="Administration" texteBouton="Voir les détails" lien="/departements/administration">
                <p>Coordonateur : Frédéric Guérin</p>
                <p>Nombre d'étudiant : 200</p>
                <p>Nombre d'enseignant : 10</p>
            </CarteHorizontale>
            <CarteHorizontale urlImage={analyses_biomedicales} titre="Analyses biomédicales" texteBouton="Voir les détails" lien="/departements/analyses-biomedicales">
                <p>Coordonateur : Frédéric Guérin</p>
                <p>Nombre d'étudiant : 200</p>
                <p>Nombre d'enseignant : 10</p>
            </CarteHorizontale>
            <CarteHorizontale urlImage={architecture} titre="Architecture" texteBouton="Voir les détails" lien="/departements/architecture">
                <p>Coordonateur : Frédéric Guérin</p>
                <p>Nombre d'étudiant : 200</p>
                <p>Nombre d'enseignant : 10</p>
            </CarteHorizontale>
        </StyledDepartements>
    )
}

export default Departements