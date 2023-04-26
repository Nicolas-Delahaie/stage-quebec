import styled from "styled-components"
import { colors,fonts } from "../../utils/styles"
import whiteCursor from "../../assets/svg/whiteCursor.svg"

const FooterStyle = styled.footer`
    background-color: ${colors.bleuFonce};
    color: ${colors.blanc};
    font-family: ${fonts.texte};
    font-size: 1rem;
    padding: 1rem 3rem;
    text-align: center;
    cursor: url(${whiteCursor}), auto;
    height: 5vh;
`;

const FooterTexte = styled.p`
    cursor: url(${whiteCursor}), auto;
`;

function Footer(){
    return (
        <FooterStyle>
            <FooterTexte>Ceci est un footer où il y a des choses de footer</FooterTexte>
        </FooterStyle>
    )
}

export default Footer