import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import styled from "styled-components";

import { Loader } from "../../utils/styles";
import ArticleTitle from "../../components/forms/ArticleTitle";
import CarteProfesseur from "../../components/layout/CarteProfesseur";
import CarteCours from "../../components/layout/CarteCours";

/* ---------------------------------- STYLE --------------------------------- */

const DivPageDetailsDepartement = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 80.5vh;
    margin: 1rem auto;
`;

const DivDetailsDepartement = styled(DivPageDetailsDepartement)`
    align-items: flex-start;
    width: 80%;
    min-height: auto;
`;

const DivListeProfesseurs = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
`;

/* ----------------------------------- DOM ---------------------------------- */

function DetailsDepartement(){
    const {id} = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [departementCours, setdepartementCours] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8000/api/departements/${id}/cours`)
            .then((response) => response.json())
            .then((departementCours) => {
                setdepartementCours(departementCours);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);
    console.log(departementCours);
    return(
        <DivPageDetailsDepartement>
            <ArticleTitle texte="Détails du département" />
            {
                isLoading ? (
                    <Loader />
                )
                : (
                    <DivDetailsDepartement>
                        <h1>Nom du département</h1>
                        <h3>Les professeurs du département </h3>
                        <DivListeProfesseurs>
                            <CarteCours idCours={1} nomCours={'Maths'} ponderationCours={4} tailleGroupeCours={20} nbGroupesCours={4}/>
                        </DivListeProfesseurs>
                        <h3>Les cours de ce département</h3>
                    </DivDetailsDepartement>
                )
            }
        </DivPageDetailsDepartement>
    )
}

export default DetailsDepartement;