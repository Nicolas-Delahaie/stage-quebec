/**
 * Composant CarteAccueil Utilisé pour afficher une carte avec une image, un titre et un lien vers une page
 */

/* import du Lien stylisé */
import Lien from "./../forms/Lien"

/* import des variables de style */
import {colors,fonts} from "./../../utils/styles"

/* import pour créer le style */
import styled from "styled-components"

/* Container général de la carte */
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

/**
 * 
 * @param {string} urlImage Prend en paramètre l'url de l'image à afficher
 * @param {string} titre Prend en paramètre le titre à afficher
 * @param {string} texteBouton Prend en paramètre le texte du bouton à afficher
 * @param {string} lien Prend en paramètre le lien vers lequel le bouton doit pointer
 * @returns la carte avec une image, un titre et un lien vers une page
 */
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