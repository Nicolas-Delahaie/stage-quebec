import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../utils/context/context';

import styled from 'styled-components'

import CarteHorizontale from '../../components/layout/CarteHorizontale';
import ArticleTitle from '../../components/forms/ArticleTitle';


import Valider from '../../assets/images/Scenarios/Valider.svg'
import Calendrier from '../../assets/images/Scenarios/Calendrier.svg'

import { iconValide } from '../../assets/svg/iconValide.js'
import { iconNonValide } from '../../assets/svg/iconNonValide.js'

import { colors, fonts, Loader } from '../../utils/styles';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding : 2rem 2rem;
`;

const PScenarios = styled.p`
    font-size: 1rem;
    margin: 0rem 0rem 0rem 1rem;
`;

const H3Scenarios = styled.h3`
    font-size: 1.25rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};
    margin: 0rem 0rem 0rem 1rem;
`;

const DivValidation = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const ImgIcon = styled.img`
    margin: 0.75rem;
`;

function Scenarios() {
    const { apiAccess, getUserId } = useContext(AppContext);
    const [isLoadingContext, setIsLoadingContext] = useState(null);
    const [isLoadingScenarios, setIsLoadingScenarios] = useState(null);
    const [scenariosDetailles, setScenariosDetailles] = useState([]);
    const userId = getUserId();
    let urlImage = Calendrier;
    let icon = iconValide;

    const getScenarios = async (id) => {
        // -- Recuperation des scenarios --
        setIsLoadingContext(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/users/${userId}/scenarios`,
            method: "get",
        });
        setIsLoadingContext(false);

        // -- Analyse --
        if (rep.success) {
            // -- Trie des scenarios (plus recents en premier) --
            rep.datas.sort((a, b) => {
                return b.annee - a.annee;
            });
            // -- Trie des scenarios (valides en premiers) --
            rep.datas.sort((a, b) => {
                return a.aEteValide - b.aEteValide;
            });
            console.log(rep);

            // -- Recuperation des scenarios detailles un a un--
            setIsLoadingScenarios(true);
            for (let i = 0; i < rep.datas.length; i++) {
                // -- Recuperation des scenarios detailles un a un--
                const idScenario = rep.datas[i].id;

                const rep2 = await apiAccess({
                    url: `http://localhost:8000/api/scenarios/${idScenario}/detaille`,
                    method: "get",
                });

                // -- Analyse --
                if (rep2.success) {
                    // On ajoute le scenario aux autres scenarios
                    setScenariosDetailles(scenariosDetailles => [...scenariosDetailles, rep2.datas]);
                }
                else {
                    /** @todo Gerer l erreur */
                    console.error("Erreur du chargement d'un des scenarios");
                }
            }
            setIsLoadingScenarios(false);
        }
        else {
            /** @todo Gerer l erreur */
            console.error("Erreur du chargement des scenarios");
        }
    };

    useEffect(() => {
        getScenarios();
    }, [])


    return (
        <Container>
            <ArticleTitle texte=" Vos Scénarios" />
            {
                isLoadingContext ?
                    <Loader />
                    :
                    scenariosDetailles.map(scenario => (
                        <CarteHorizontale
                            key={scenario.id}
                            urlImage={scenario.aEteValide ? Valider : Calendrier}
                            titre={"Département " + scenario.departement.nom}
                            texteBouton="Voir le scénario"
                            lien={`/scenarios/${scenario.id}`}>
                            <PScenarios>Propriétaire : {scenario.proprietaire.nom}</PScenarios>
                            <PScenarios>Année :{scenario.annee}</PScenarios>
                            <PScenarios>Dernière modification : {scenario.updated_at}</PScenarios>
                            <PScenarios>Date de création : {scenario.created_at}</PScenarios>
                            <DivValidation>
                                <H3Scenarios>Validé par le responsable : </H3Scenarios>
                                <ImgIcon src={scenario.aEteValide ? icon = iconValide : icon = iconNonValide} />
                            </DivValidation>
                        </CarteHorizontale>
                    ))
            }
            {
                isLoadingScenarios ?
                    <Loader />
                    :
                    <div></div>
            }
        </Container>
    )
}

export default Scenarios