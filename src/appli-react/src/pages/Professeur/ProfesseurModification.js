import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Loader } from "../../utils/styles";

import styled from "styled-components";

/* ---------------------------------- STYLE --------------------------------- */

const DivPageProfesseurModification = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 80.5vh;
    margin: 1rem auto;
`;

/* ----------------------------------- DOM ---------------------------------- */

function ProfesseurModification(){
    const id = useParams();

    const [professeur, setProfesseur] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8000/professeurs/${id}`)
            .then((response) => response.json())
            .then((professeur) => {
                setProfesseur(professeur);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    return(
        <DivPageProfesseurModification>
            <h1>Voici les information du professeur</h1>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        <p>Ici les informations du professeur</p>
                    </div>
                )
            }
        </DivPageProfesseurModification>
    );
}

export default ProfesseurModification;