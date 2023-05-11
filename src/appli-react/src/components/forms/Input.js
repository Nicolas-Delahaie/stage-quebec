/**
 * Component Input est un input stylisé
 */

/* import pour créer le style */
import styled from "styled-components"

/* import des variables de style */
import { colors, fonts } from "../../utils/styles"

const StyledInput = styled.input`
    height: 1.5rem;
    cursor: text;
    border: none;
    box-shadow: 0px 5px 10px 0px ${colors.gris};
    border-radius: 0.5rem;
    font-family: ${fonts.texte};
    padding: 0rem 0.25rem;
    margin: 0.25rem 0;
    color: ${colors.bleuMoyen};
    &:focus{
        outline: none;
    }

    ::placeholder{
        color: ${colors.gris};
    }

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    `;


/**
 * 
 * @returns un input stylisé
 */
function Input({ type, placeholder, onChange, required }) {
    if (required) {
        return (
            <StyledInput type={type} placeholder={placeholder} onChange={onChange} required />
        )
    }
    else {
        return (
            <StyledInput type={type} placeholder={placeholder} onChange={onChange} />
        )
    }
}

export default Input