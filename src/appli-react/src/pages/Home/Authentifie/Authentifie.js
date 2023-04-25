/* --------------------------------- IMPORT --------------------------------- */
/* import du composant CarteAccueil */
import CarteAccueil from "../../../components/layout/CarteAccueil"

/* import pour créer le style */
import styled from "styled-components"

/* import des images */
import Calendrier from "../../../assets/images/Authentifie/Calendrier.svg"
import Repartir from "../../../assets/images/Authentifie/Repartir.svg"

/* ---------------------------------- STYLE --------------------------------- */

const DivAuthentifie = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
`;

/* ----------------------------------- DOM ---------------------------------- */

function Authentifie(){
    return(
        <DivAuthentifie>
            <CarteAccueil urlImage={Repartir} titre={'Voir mes scénarios'} texteBouton={'Mes scénarios'} lien={'/scenarios'}/>
            <CarteAccueil urlImage={Calendrier} titre={'Gérer mes contraintes'} texteBouton={'Mes contraintes'} lien={'/contraintes'}/>
        </DivAuthentifie>
    )
}

export default Authentifie