/**
 * Composant ArticleTitle Utilisé pour afficher le titre d'un article avec une ligne au dessous
 */

/* import pour créer le style */
import styled from "styled-components"
/* import des variables de style */
import { colors,fonts } from "../../utils/styles"

const ArticleTitleStyle = styled.h1`
    font-family: ${fonts.titre};
    font-size: 2rem;
    color: ${colors.bleuFonce};
    text-align: center;
    margin: 1rem 0;
    padding: 0.5rem 0;
    width: 100%;
    &::after{
        content: "";
        display: block;
        width: auto;
        height: 3px;
        background-color: ${colors.jauneFonce};
        margin: 0.5rem auto;
    }
`;

/**
 * 
 * @param {string} texte Prend en paramètre le texte à afficher
 * @returns le titre d'un article avec une ligne au dessous
 */
function ArticleTitle({texte}){
    return(
        <ArticleTitleStyle>
            {texte}
        </ArticleTitleStyle>
    )
}

export default ArticleTitle
