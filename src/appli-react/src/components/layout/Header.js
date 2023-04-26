import styled from "styled-components"
import { colors } from "../../utils/styles"
import home from "../../assets/svg/home.svg"
import { Link } from "react-router-dom"
import  Lien  from "../forms/Lien"
import { useContext } from "react"
import { AppContext } from "../../utils/context/context"
import whiteCursor from "../../assets/svg/whiteCursor.svg"

/* --------------------------------- STYLES --------------------------------- */

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
    cursor: url(${whiteCursor}), auto;
`;

/* ----------------------------------- DOM ---------------------------------- */


function Header(){
    const { toggleConnexion, isConnected } = useContext(AppContext);
    return (
        <HeaderStyle>
            <Link to="/">
                <ImgLogo src={home} alt="logo"/>
            </Link>
            {isConnected ? (
                <Lien to="/login">
                    <ButtonTexte onClick={() => toggleConnexion(true) }>Se connecter</ButtonTexte>
                </Lien>
                
            ) : (
                <Lien to="/logout">
                    <ButtonTexte onClick={() => toggleConnexion(false) }>Se deconnecter</ButtonTexte>
                </Lien>
            )}
        </HeaderStyle>
    )
}

export default Header