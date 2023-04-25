/**
 * Component Input est un input stylisé
 */

/* import pour créer le style */
import styled from "styled-components"

/* import des variables de style */
import { colors,fonts } from "../../utils/styles"

const StyledInput = styled.input`
    height: 1.5rem;
    cursor: text;
    border: none;
    box-shadow: 0px 5px 10px 0px ${colors.gris};
    margin: 1rem;
    border-radius: 0.5rem;
    font-family: ${fonts.texte};
    padding: 0rem 0.25rem;
    &:focus{
        outline: none;
    }
    `;


/**
 * 
 * @returns un input stylisé
 */
function Input(){
    return(
        <StyledInput type="text" />
    )
}

export default Input