import styled from "styled-components"
import { DivCarteReduite, DivLien } from "./CarteProfesseur"
import { colors, fonts } from "../../utils/styles"
import Lien from "../forms/Lien"

const H1Cours = styled.h1`
    width: fit-content;
    margin: 0.25rem 0;
    font-family: ${fonts.titre};
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

const DivH2 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

`;

const H2Cours = styled.h2`
    margin: 0.25rem 0;
    font-family: ${fonts.titre};
    font-size: 1.25rem;
    color: ${colors.bleuFonce};
`;

function CarteCours({idCours,nomCours, ponderationCours,tailleGroupesCours, nbGroupesCours}){
    return(
        <DivCarteReduite>
            <H1Cours>{nomCours}</H1Cours>
            <DivH2>
                <H2Cours>Pondération : {ponderationCours}</H2Cours>
                <H2Cours>Taille du groupe : {tailleGroupesCours}</H2Cours>
                <H2Cours>Nombre de groupes : {nbGroupesCours}</H2Cours>
            </DivH2>
            <DivLien>
                <Lien to={"/cours/modifier/"+idCours}>Modifier</Lien>
                <Lien to={"/cours/supprimer/"+idCours}>Supprimer</Lien>
            </DivLien>
        </DivCarteReduite>
    )
}

export default CarteCours