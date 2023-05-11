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
import { useContext } from "react"
import { AppContext } from "../../utils/context/context"

/* import du curseur personnalisé */
import whiteCursor from "../../assets/svg/whiteCursor.svg"
import cursor from "../../assets/svg/cursor.svg"

/* --------------------------------- STYLES --------------------------------- */

/*Container général du header */
const HeaderStyle = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background-color: ${colors.bleuMoyen};
    height: 10vh;
    cursor: url(${whiteCursor}), auto;
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
    const { estConnecte, deconnexion } = useContext(AppContext);

    return (
        <HeaderStyle>
            <Link to="/">
                <ImgLogo src={home} alt="logo" />
            </Link>
            {/* Si l'utilisateur est connecté, on affiche le bouton de déconnexion, sinon on affiche le bouton de connexion */}
            {estConnecte ?
                (
                    <Lien to="/">
                        <ButtonTexte onClick={() => deconnexion()}>Se deconnecter</ButtonTexte>
                    </Lien>
                ) :
                (
                    <Lien to="/login">
                        <ButtonTexte>Se connecter</ButtonTexte>
                    </Lien>
                )}
        </HeaderStyle>
    )
}

export default Header