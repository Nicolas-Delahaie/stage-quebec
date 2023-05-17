/**
 * @todo Mieux gérer l affichage des modifications 
 */
import { ArticleTitle } from "../../components/forms";

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from '../../utils/context/context';

import { Loader, colors, fonts } from "../../utils/styles";

import styled from "styled-components";

/* ---------------------------------- STYLE --------------------------------- */

const DivPageDetailsScenario = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 80.5vh;
    margin: 1rem auto;
`;

const DivDetailsScenario = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 80%;
    margin: 1rem auto;
    padding: 1rem;
`;

const H1Scenario = styled.h1`
    font-size: 2rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};

    &:after {
        content: "";
        display: block;
        width: 100%;
        height: 0.2rem;
        background-color: ${colors.jauneFonce};
    }
`;

const H2Scenario = styled.h2`
    font-size: 1.5rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};
`;

function DetailsScenario() {
    const id = useParams().id;
    const { apiAccess } = useContext(AppContext);

    const [scenario, setScenario] = useState({});
    const [modifications, setModifications] = useState({});
    const [isLoadingScenario, setIsLoadingScenario] = useState(true);
    const [isLoadingModifications, setIsLoadingModifications] = useState(true);

    const getScenarioDetaille = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/detaille`,
            method: "get",
        });
        setIsLoadingScenario(false);

        // -- Analyse du coordo --
        if (rep.success) {
            setScenario(rep.datas);
        }
        else {
            /** @todo Gerer l erreur */
            console.log(rep.erreur)
        }
    }
    const getModifications = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/modifications`,
            method: "get",
        });
        setIsLoadingModifications(false);
        console.log(rep);

        // -- Analyse du coordo --
        if (rep.success) {
            setModifications(rep.datas);
        }
        else {
            /** @todo Gerer l erreur */
            console.log(rep.erreur)
        }
    }


    useEffect(() => {
        // Initialisation de informations
        getScenarioDetaille();
        getModifications()
    }, []);


    return (
        <DivPageDetailsScenario>
            <ArticleTitle texte="Détails du scénario" />
            {
                isLoadingScenario ?
                    < Loader />
                    :
                    <DivDetailsScenario>
                        <H1Scenario>Informations</H1Scenario>
                        <H2Scenario>Département : {scenario.departement.nom}</H2Scenario>
                        <H2Scenario>Pour l'année {scenario.annee}</H2Scenario>
                        <p>Date de création : {scenario.created_at}</p>
                        <p>Dernière modification : {scenario.updated_at}</p>
                        <H2Scenario>Propriétaire : {scenario.proprietaire.nom}</H2Scenario>
                        <H1Scenario>Historique des modifications : </H1Scenario>
                        {
                            modifications[0] === undefined ?
                                <p>Aucune modification n'a été apportée</p>
                                :
                                <div>
                                    {
                                        isLoadingModifications ?
                                            <Loader />
                                            :
                                            modifications.map((modif) => (
                                                <div key={modif.id}>
                                                    <p>Date de dernière modification : {modif.date_modif}</p>
                                                    <p>Utilisateur aillant fait la modification : {modif.utilisateur_name}</p>
                                                </div>
                                            ))
                                    }
                                </div>

                        }
                    </DivDetailsScenario>
            }
        </DivPageDetailsScenario>
    )
}

export default DetailsScenario;