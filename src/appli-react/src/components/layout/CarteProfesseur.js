import styled from "styled-components";
import { colors,fonts } from "../../utils/styles";
import { Bouton } from "../forms"

/* ---------------------------------- STYLE --------------------------------- */

export const DivCarteReduite = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    box-shadow: 0 0 10px ${colors.gris};
    border-radius: 1rem;
    padding: 2rem 1.5rem;
    width: auto;
`;

export const DivBouton = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
`;

const H1Cours = styled.h1`
    width: fit-content;
    margin: 0.25rem 0;
    font-family: ${fonts.sousTitre};
    font-size: 1.5rem;
    color: ${colors.bleuFonce};
    margin-bottom: 1rem;

    &:after{
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background-color: ${colors.jauneFonce};
    }
`;

const H4CarteReduite = styled.h4`
    margin: 0.25rem 0;
    font-family: ${fonts.sousTitre};
    font-size: 1.25rem;
    color: ${colors.bleuMoyen};
`;

function CarteProfesseur({idProfesseur, nomProfesseur, matieresProfesseur,nombreEtudiants}){
    return(
        <DivCarteReduite>
            <H1Cours>{nomProfesseur}</H1Cours>
            <H4CarteReduite>Matiere</H4CarteReduite>
            <p>{matieresProfesseur}</p>
            <DivBouton>
                <Bouton>Modifier</Bouton>
                <Bouton>Supprimer</Bouton>
            </DivBouton>
        </DivCarteReduite>
    )
}

export default CarteProfesseur;