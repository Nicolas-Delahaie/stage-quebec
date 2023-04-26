import styled from "styled-components"
import { colors,fonts } from "../../utils/styles"

const ArticleTitleStyle = styled.h1`
    font-family: ${fonts.titre};
    font-size: 2rem;
    color: ${colors.bleuFonce};
    text-align: center;
    margin: 1rem 0;
    padding: 0.5rem 0;
    &::after{
        content: "";
        display: block;
        width: auto;
        height: 3px;
        background-color: ${colors.jauneFonce};
        margin: 0.5rem auto;
`;

function ArticleTitle({texte}){
    return(
        <ArticleTitleStyle>
            {texte}
        </ArticleTitleStyle>
    )
}

export default ArticleTitle
