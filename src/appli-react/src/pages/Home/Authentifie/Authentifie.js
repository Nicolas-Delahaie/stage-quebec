/**
 * @todo gérer l'absence de type (également la non connexion)
 */
/* --------------------------------- IMPORT --------------------------------- */
/* import du composant CarteAccueil */
import CarteAccueil from "../../../components/layout/CarteAccueil"

/* import pour créer le style */
import styled from "styled-components"

/* import des images */
import Calendrier from "../../../assets/images/Authentifie/Calendrier.svg"
import Repartir from "../../../assets/images/Authentifie/Repartir.svg"
import Departements from "../../../assets/images/Authentifie/Departements.svg"

import { useContext } from "react"
import { AppContext } from "../../../utils/context/context"
import { useState } from "react"

/* ---------------------------------- STYLE --------------------------------- */

const DivAuthentifie = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
`;

/* ----------------------------------- DOM ---------------------------------- */

function Authentifie() {

    const { getType } = useContext(AppContext);
    const [type, setType] = useState(getType());

    return (
        <DivAuthentifie>
            {(() => {
                switch (type) {
                    case 'professeur':
                        return (
                            <>
                                <CarteAccueil urlImage={Repartir} titre={'Voir mes scénarios'} texteBouton={'Mes scénarios'} lien={'/scenarios'} />
                                <CarteAccueil urlImage={Calendrier} titre={'Gérer mes contraintes'} texteBouton={'Mes contraintes'} lien={'/profil'} />
                            </>
                        )
                    case 'responsable':
                        return (
                            <>
                                <CarteAccueil urlImage={Repartir} titre={'Voir mes scénarios'} texteBouton={'Mes scénarios'} lien={'/scenarios'} />
                                <CarteAccueil urlImage={Calendrier} titre={'Gérer mes contraintes'} texteBouton={'Mes contraintes'} lien={'/profil'} />
                                <CarteAccueil urlImage={Departements} titre={'Voir les départements'} texteBouton={'Les départements'} lien={'/departements/'} />
                            </>
                        )
                    default:
                        return (
                            <>
                                <CarteAccueil urlImage={Repartir} titre={'Voir mes scénarios'} texteBouton={'Mes scénarios'} lien={'/scenarios'} />
                                <CarteAccueil urlImage={Calendrier} titre={'Gérer mes contraintes'} texteBouton={'Mes contraintes'} lien={'/profil'} />
                            </>
                        )
                }
            })()}

        </DivAuthentifie>
    )
}

export default Authentifie