import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Loader } from "../../utils/styles";
import { AppContext } from '../../utils/context/context';
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

function ProfesseurModification() {
    const id = useParams();

    const [professeur, setProfesseur] = useState([]);
    const [isLoading, setIsLoading] = useState(null);
    const { apiAccess } = useContext(AppContext);

    const getInfos = async () => {
        // -- Recuperation des infos du professeur --
        setIsLoading(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/departements/${id}/coordonnateur`,
            method: "get",
        });
        setIsLoading(false);

        // -- Traitement du resultat --
        if (rep.success) {
            setProfesseur(rep.datas);
        }
        else {
            /** @todo Gerer l erreur */
            console.error(rep.erreur);
        }
    }
    useEffect(() => {
        getInfos();
    }, [id]);

    return (
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