/* --------------------------------- IMPORT --------------------------------- */

// FORM et LAYOUT
import ArticleTitle from "../components/forms/ArticleTitle"
import CarteAccueil from "../components/layout/CarteAccueil"

// IMAGES 
import Repartition_plusieurs from "../assets/images/Home/Repartition_plusieurs.svg"
import Tableau from "../assets/images/Home/Tableau.svg"
import Calendrier from "../assets/images/Authentifie/Calendrier.svg"
import Repartir from "../assets/images/Authentifie/Repartir.svg"
import Departements from "../assets/images/Authentifie/Departements.svg"

// LIBRAIRIES
import styled from "styled-components"
import { useContext, useState, useEffect } from "react"
import { AppContext } from "../utils/context/context"

/* ---------------------------------- STYLE --------------------------------- */

const ArticleStyle = styled.div`
    padding: 1rem 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
`;
const ImageArticle = styled.img`
    width: 40vw;
    height: auto;
    margin: 0 2rem;
`;
const DivAuthentifie = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
`;

/* ----------------------------------- DOM ---------------------------------- */

function Home() {
    const { getType, estConnecte } = useContext(AppContext);
    const [type, setType] = useState(getType());

    useEffect(() => {
        setType(getType());
    }, [])

    return (
        estConnecte ?
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
            :
            <div>
                <ArticleTitle texte={'Présentation'} />
                <ArticleStyle>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    </p>
                    <ImageArticle src={Repartition_plusieurs} alt="image article" />
                </ArticleStyle>
                <ArticleTitle texte={'Fonctionnement'} />
                <ArticleStyle>
                    <ImageArticle src={Tableau} alt="image article" />
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                        Quisquam, voluptatum. Quisquam, voluptatum. Quisquam, voluptatum.
                    </p>
                </ArticleStyle>
            </div>
    )
}
export default Home