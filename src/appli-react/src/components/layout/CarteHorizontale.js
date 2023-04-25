/**
 * Composant CarteHorizontal Utilisé pour afficher une carte avec une image à gauche et du texte à droite sur la longueur
 */

/* import pour créer le style */
import styled from "styled-components"

/* import des variables de style */
import { colors } from "../../utils/styles"

/* import du composant Lien */
import Lien from "../forms/Lien"

/* container de la carte */
const Carte = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90vw;
    height: 40vh;
    border-radius: 1rem;
    box-shadow: 0px 10px 10px 0px ${colors.gris};
    padding : 1rem;
    margin: 1rem;
    `;

const ImageCarte = styled.img`
    height: 80%;
    `;

/* container de chlidren */
const ContenuCarte = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
`;

/**
 * 
 * @param {string} urlImage Prend en paramètre l'url de l'image à afficher
 * @param {string} titre Prend en paramètre le titre à afficher
 * @param {string} texteBouton Prend en paramètre le texte du bouton à afficher
 * @param {string} lien Prend en paramètre le lien vers lequel le bouton doit pointer
 * @param enfants Prend en paramètre les enfants à afficher
 * @returns Carte avec une image à gauche et du texte à droite sur la longueur
 */
function CarteHorizontale({urlImage, titre, texteBouton, lien, children:enfants}){
    return(
        <Carte>
            <ContenuCarte>
                <h2>{titre}</h2>
                {enfants}
                <Lien to={lien}>
                    {texteBouton}
                </Lien>
            </ContenuCarte>
            <ImageCarte src={urlImage} alt={titre}/>
        </Carte>
    )
}

export default CarteHorizontale