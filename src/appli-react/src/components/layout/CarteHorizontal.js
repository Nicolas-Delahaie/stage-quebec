import styled from "styled-components"

import { colors,fonts } from "../../utils/styles"

import Lien from "../forms/Lien"

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

const ContenuCarte = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
`;

function CarteHorizontal({urlImage, titre, texteBouton, lien, children:enfants}){
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

export default CarteHorizontal