import styled from "styled-components"
import { colors,fonts } from "../../utils/styles"
import { Link } from "react-router-dom"
import whiteCursor from "../../assets/svg/whiteCursor.svg"

const LinkStyle = styled(Link)`
    background-color: ${colors.jauneFonce};
    color: ${colors.bleuFonce};
    text-decoration: none;
    font-family: ${fonts.titre};
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    transition: all 0.1s ease-in-out;
`;

function Lien({to,children}){
    return (
        <LinkStyle to={to}>
            {children}
        </LinkStyle>
    )
}

export default Lien