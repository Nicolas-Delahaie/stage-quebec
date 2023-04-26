import Lien from "./../forms/Lien"

import {colors,fonts} from "./../../utils/styles"

import styled from "styled-components"

const ContainerCarte = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 60vh;
    width: 30vw;
    background-color: ${colors.blanc};
    box-shadow: 0px 0px 10px 0px ${colors.gris};
    border-radius: 2rem;
    transition: 0.3s;
    padding: 1rem 0rem;

    &:hover{
        box-shadow: 0px 10px 10px 0px ${colors.gris};
        transform: scale(1.025);
    }
`;

const ImageCarte = styled.img`
    height: 75%;
    width: 75%;
`;

const TitreCarte = styled.h2`
    font-family: ${fonts.sousTitre};
    font-size: 1.5rem;
    border-top: 3px solid ${colors.jauneFonce};
    width: 100%;
    text-align: center;
    padding-top: 1rem;
`;

function CarteAccueil({urlImage,titre,texteBouton,lien}){
    return(
        <ContainerCarte>
            <ImageCarte src={urlImage} alt={titre}/>
            <TitreCarte>{titre}</TitreCarte>
            <Lien to={lien}>
                {texteBouton}
            </Lien>
        </ContainerCarte>
    )
}

export default CarteAccueil