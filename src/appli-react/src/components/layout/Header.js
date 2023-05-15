/**
 * Header de l'application
 */

/* --------------------------------- IMPORTS -------------------------------- */

/* import pour créer le style */
import styled from "styled-components"

/* import des variables de style */
import { colors } from "../../utils/styles"

/* import du logo d'accueil*/
import home from "../../assets/svg/home.svg"

/* import du composant Link de react-router-dom servant à faire les liens sous React */
import { Link } from "react-router-dom"

/* import du composant Lien de notre application */
import Lien from "../forms/Lien"

/* import du contexte de notre application contenant les variables globales comme par exemple si l'utilisateur est connecté et sous quelle type */
import { useContext, useState } from "react"
import { AppContext } from "../../utils/context/context"

/* import du curseur personnalisé */
import whiteCursor from "../../assets/svg/whiteCursor.svg"
import cursor from "../../assets/svg/cursor.svg"

/* --------------------------------- STYLES --------------------------------- */

/*Container général du header */
const HeaderStyle = styled.header`
    display: grid;
    grid-template-columns: ${props => props.estConnecte ? "1fr 70% 1fr" : "1fr 1fr"};
    align-items: center;
    justify-content: center;
    padding: 0 2rem;
    background-color: ${colors.bleuMoyen};
    height: 10vh;
    cursor: url(${whiteCursor}), auto;
`;

const DivLien = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${props => props.estConnecte ? "center" : "flex-end"};
`;

const ImgLogo = styled.img`
    height: 5vh;
    width: 5vh;
    cursor: url(${whiteCursor}), auto;
`;

const ButtonTexte = styled.div`
    cursor: url(${cursor}), auto;
`;

/* ----------------------------------- DOM ---------------------------------- */

/**
 * 
 * @returns Le header de l'application
 */
function Header() {
    const { estConnecte, deconnexion, getType } = useContext(AppContext);
    const [type, setType] = useState(getType());

    return (
        <HeaderStyle estConnecte={estConnecte}>
            <Link to="/">
                <ImgLogo src={home} alt="logo" />
            </Link>

            {/* Si l'utilisateur est connecté, on affiche le bouton de déconnexion, sinon on affiche le bouton de connexion */}
            {estConnecte ?
    (
        <>
            {(() => {
                switch (type.slice(1, -1)) {
                    case 'professeur':
                        return (
                            <DivLien estConnecte={estConnecte} >
                                <Lien to="/scenarios">
                                    <ButtonTexte>Mes scénarios</ButtonTexte>
                                </Lien>
                                <Lien to="/users/:id/contraintes">
                                    <ButtonTexte>Mes contraintes</ButtonTexte>
                                </Lien>
                            </DivLien>
                        )
                    case 'responsable':
                        return (
                            <DivLien estConnecte={estConnecte}>
                                <Lien to="/scenarios">
                                    <ButtonTexte>Mes scénarios</ButtonTexte>
                                </Lien>
                                <Lien to="/users/:id/contraintes">
                                    <ButtonTexte>Mes contraintes</ButtonTexte>
                                </Lien>
                                <Lien to="/departements/">
                                    <ButtonTexte>Mon département</ButtonTexte>
                                </Lien>
                            </DivLien>
                        )
                    default:
                        return (
                            <DivLien estConnecte={estConnecte}>
                                <Lien to="/scenarios">
                                    <ButtonTexte>Mes scénarios</ButtonTexte>
                                </Lien>
                                <Lien to="/users/:id/contraintes">
                                    <ButtonTexte>Mes contraintes</ButtonTexte>
                                </Lien>
                            </DivLien>
                        )
                }
            })()}
            <DivLien>
            <Lien to="/">
                <ButtonTexte onClick={() => deconnexion()}>Se deconnecter</ButtonTexte>
            </Lien>
            </DivLien>
        </>
    ) :
                (
                    <DivLien estConnecte={estConnecte}>
                    <Lien to="/login">
                        <ButtonTexte>Se connecter</ButtonTexte>
                    </Lien>
                    </DivLien>
                )}
        </HeaderStyle>
    )
}

export default Header