import styled from "styled-components";
import { colors } from "../../utils/styles";
import { Lien } from "../forms"

/* ---------------------------------- STYLE --------------------------------- */

const DivCarteReduite = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    box-shadow: 0 0 10px ${colors.gris};
    border-radius: 1rem;
    padding: 0.25rem 2rem;
    width: auto;
    height: 300px;
`;

const UlMatieres = styled.ul`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0; 
    margin: 0;
`;

const LiMatieres = styled.li`
    list-style-type: none;
    margin:0rem 0rem 1rem 0.5rem;
`;

const DivLien = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
`;

const H4CarteReduite = styled.h4`
    margin: 0.25rem 0;
`;

function CarteProfesseur({idProfesseur, nomProfesseur, matieresProfesseur,nombreEtudiants}){
    return(
        <DivCarteReduite>
            <h2>{nomProfesseur}</h2>
            <H4CarteReduite>Matieres</H4CarteReduite>
            <UlMatieres>
                {
                    matieresProfesseur.map((matiere) => {
                        return <LiMatieres>{matiere}</LiMatieres>
                    })
                }
            </UlMatieres>
            <H4CarteReduite>Nombre d'étudiants </H4CarteReduite>
            <H4CarteReduite>{nombreEtudiants}</H4CarteReduite>
            <DivLien>
                <Lien to={"/professeur/modifier/"+idProfesseur}>Modifier</Lien>
                <Lien to={"/professeur/supprimer/"+idProfesseur}>Supprimer</Lien>
            </DivLien>
        </DivCarteReduite>
    )
}

export default CarteProfesseur;