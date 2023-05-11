/**
 * Composant Lien Utilisé pour afficher un lien avec un style personnalisé
 */

/* import pour créer le style */
import styled from "styled-components"

/* import des variables de style */
import { colors, fonts } from "../../utils/styles"

/* import du composant Link de react-router-dom servant à faire les liens sous React */
import { Link } from "react-router-dom"

/* LinkStyle hérite de Link de React */
const LinkStyle = styled(Link)`
    background-color: ${colors.jauneFonce};
    color: ${colors.bleuFonce};
    text-decoration: none;
    font-family: ${fonts.titre};
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    margin: 1rem;
    transition: all 0.1s ease-in-out;
`;

/**
 * 
 * @param {string} to Prend en paramètre le lien vers lequel le lien doit pointer
 * @param {string} children Prend en paramètre le texte à afficher 
 * @returns Le lien avec un style personnalisé
 */
function Lien({ to, children }) {
    return (
        <LinkStyle to={to}>
            {children}
        </LinkStyle>
    )
}

export default Lien