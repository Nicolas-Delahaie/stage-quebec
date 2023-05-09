import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import styled from "styled-components";

import { Loader, colors, fonts } from "../../utils/styles";
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

const DivListe = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
`;

const H1Departements = styled.h1`
    font-size: 2.5rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};

    &:after{
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background-color: ${colors.jauneFonce};
    }
`;

const H2DetailsDepartement = styled.h3`
    margin: 3rem 0rem;
    font-size: 1.5rem;
    font-weight: bold;
    width: fit-content;
    color: ${colors.bleuFonce};
    font-family: ${fonts.titre};

    &:after{
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background-color: ${colors.jauneFonce};
    }
`;

const H3Coordonnateur = styled.h3`
    font-size: 1.5rem;
    font-family: ${fonts.sousTitre};
    color: ${colors.bleuMoyen};
`;

/* ----------------------------------- DOM ---------------------------------- */

function DetailsDepartement(){
    const {id} = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [departement, setDepartement] = useState([]);
    const [departementCours, setdepartementCours] = useState([]);
    const [departementCoordonnateur, setDepartementCoordonnateur] = useState([]);
    const [departementProfesseurs, setDepartementProfesseurs] = useState([]);

    /**
     * Récupération des données générales du département
     */
    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8000/api/departements/${id}`)   
            .then((response) => response.json())
            .then((departement) => {
                setDepartement(departement);
            })
            .catch((error) => {
                console.log(error);
            });
            setIsLoading(false);
    }, []);

    /**
     * Récupération du coordonnateur du département
     */
    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8000/api/departements/${id}/coordonnateur`)
            .then((response) => response.json())
            .then((departementCoordonnateur) => {
                setDepartementCoordonnateur(departementCoordonnateur);
            })
            .catch((error) => {
                console.log(error);
            });
            setIsLoading(false);
    }, []);

    /**
     * Récupération des cours du département
     */
    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8000/api/departements/${id}/cours`)
            .then((response) => response.json())
            .then((departementCours) => {
                setdepartementCours(departementCours);
            })
            .catch((error) => {
                console.log(error);
            });
            setIsLoading(false);
    }, []);

    /**
     * Récupération des professeurs du département
     */
    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:8000/api/departements/7/users')
            .then((response) => response.json())
            .then((departementProfesseurs) => {
                setDepartementProfesseurs(departementProfesseurs);
            })
            .catch((error) => {
                console.log(error);
            });
            setIsLoading(false);
    }, []);
    return(
        <DivPageDetailsDepartement>
            <ArticleTitle texte="Détails du département" />
            {
                isLoading || departementCours.length === 0 || departementProfesseurs.length === 0 ? (
                    <Loader />
                )
                : (
                    <DivDetailsDepartement>
                        <H1Departements>{departement.nom}</H1Departements>
                        <H3Coordonnateur>Coordonnateur du département {departementCoordonnateur.name}</H3Coordonnateur>
                        <H2DetailsDepartement>Les cours du département </H2DetailsDepartement>
                        <DivListe>
                            {
                                departementCours?.map((cours) => (
                                    <CarteCours key={cours.id} idCours={cours.id} nomCours={cours.nom} ponderationCours={cours.pivot.ponderation} tailleGroupesCours={cours.pivot.tailleGroupes} nbGroupesCours={cours.pivot.nbGroupes}/>
                                ))
                            }
                            <CarteCours idCours={1} nomCours={'Maths'} ponderationCours={4} tailleGroupeCours={20} nbGroupesCours={4}/>
                        </DivListe>
                        <H2DetailsDepartement>Les professeurs de ce département</H2DetailsDepartement>
                        <DivListe>
                            {
                                departementProfesseurs?.map((professeur) => (
                                    <CarteProfesseur key={professeur.id} idProfesseur={professeur.id} nomProfesseur={professeur.name} matieresProfesseur={professeur.nom}/>
                                ))
                            }
                        </DivListe>
                    </DivDetailsDepartement>
                )
            }
        </DivPageDetailsDepartement>
    )
}

export default DetailsDepartement;