import styled from 'styled-components'

import CarteHorizontale from '../../components/layout/CarteHorizontale';
import ArticleTitle from '../../components/forms/ArticleTitle';

import { useState, useEffect } from 'react'

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

    const [isLoading, setLoading] = useState(false);
    const [scenariosData, setScenariosData] = useState({});
    let urlImage = Calendrier
    let icon = iconValide

    useEffect(() => {
        setLoading(true)
        fetch('http://localhost:8000/api/users/2/scenariosDetailles')
            .then(res => {
                return res.json()
            })
            .then(res => {
                setScenariosData(res)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            }
            )
    }, [])

    console.log(icon)

    return (
        <Container>
            <ArticleTitle texte = " Vos Scénarios" />
            {
                isLoading || scenariosData.scenarios === undefined ?
                    (
                        <Loader />
                    ) : (
                        scenariosData.scenarios.map(scenario => (
                            <CarteHorizontale
                                key={scenario.id}
                                {...scenario.aEteValide ? urlImage = Valider : urlImage = Calendrier}
                                urlImage={urlImage}
                                titre={scenario.departement.nom}
                                texteBouton="Voir le scénario"
                                lien={`/scenarios/${scenario.id}`}
                            >
                                <PScenarios>Propriétaire : {scenario.proprietaire.nom}</PScenarios>
                                <PScenarios>Année :{scenario.annee}</PScenarios>
                                <PScenarios>Dernière modification : {scenario.updated_at}</PScenarios>
                                <PScenarios>Date de création : {scenario.created_at}</PScenarios>
                                <DivValidation>
                                    <H3Scenarios>Validé par le responsable : </H3Scenarios>
                                    <ImgIcon src={scenario.aEteValide ? icon = iconValide : icon = iconNonValide}/>
                                </DivValidation>

                            </CarteHorizontale>

                        )
                    )
                )
            }
        </Container>
    )
}

export default Scenarios