import CarteAccueil from "../../../components/layout/CarteAccueil"

import styled from "styled-components"

import Calendrier from "../../../assets/images/Authentifie/Calendrier.svg"
import Repartir from "../../../assets/images/Authentifie/Repartir.svg"

const DivAuthentifie = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
`;

function Authentifie(){
    return(
        <DivAuthentifie>
            <CarteAccueil urlImage={Repartir} titre={'Voir mes scénarios'} texteBouton={'Mes scénarios'} lien={'/scenarios'}/>
            <CarteAccueil urlImage={Calendrier} titre={'Gérer mes contraintes'} texteBouton={'Mes contraintes'} lien={'/contraintes'}/>
        </DivAuthentifie>
    )
}

export default Authentifie