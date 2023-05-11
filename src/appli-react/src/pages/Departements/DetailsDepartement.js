import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import styled from "styled-components";

import { Loader, colors, fonts } from "../../utils/styles";
import ArticleTitle from "../../components/forms/ArticleTitle";
import CarteProfesseur from "../../components/layout/CarteProfesseur";
import CarteCours from "../../components/layout/CarteCours";

/** @todo Faire en sorte que les donnees se chargent hierarchiquement (actuellement tous les fetchs se font en meme temps de maniere asynchrone) */

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

function DetailsDepartement() {
    const { id } = useParams();

    // const [loadingDepartement, setloadingDepartement] = useState(false);

    // Tous les booleens indiquant si la ressource a ete chargee ou non
    const [loadingDepartement, setLoadingDepartement] = useState(true);
    const [loadingCoordo, setLoadingCoordo] = useState(true);
    const [loadingCours, setLoadingCours] = useState(true);
    const [loadingProfesseurs, setLoadingProfesseurs] = useState(true);

    const [departement, setDepartement] = useState([]);
    const [cours, setCours] = useState([]);
    const [coordo, setCoordo] = useState([]);
    const [professeurs, setProfesseurs] = useState([]);

    // Récupération des données
    useEffect(() => {
        // Récupération des informations generales du departement
        fetch(`http://localhost:8000/api/departements/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error('could not fetch the data for that resource');
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setDepartement(data);
                setLoadingDepartement(false);
            })
            .catch((error) => {
                console.log(error);
            });

        // Récupération du coordonnateur du département
        fetch(`http://localhost:8000/api/departements/${id}/coordonnateur`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error('could not fetch the data for that resource');
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setCoordo(data);
                setLoadingCoordo(false);
            })
            .catch((error) => {
                console.log(error);
            });

        // Récupération des departements du département
        fetch(`http://localhost:8000/api/departements/${id}/cours`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error('could not fetch the data for that resource');
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setCours(data);
                setLoadingCours(false);
            })
            .catch((error) => {
                console.log(error);
            });

        // Récupération des professeurs du département
        fetch(`http://localhost:8000/api/departements/${id}/users`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error('could not fetch the data for that resource');
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setProfesseurs(data);
                setLoadingProfesseurs(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    return (
        <DivPageDetailsDepartement>
            <ArticleTitle texte="Détails du département" />
            {
                loadingDepartement ?
                    <Loader />
                    :
                    <DivDetailsDepartement>
                        <H1Departements>{departement.nom}</H1Departements>
                        {
                            loadingCoordo ?
                                <Loader />
                                :
                                <H3Coordonnateur>Coordonné par : {coordo.name}</H3Coordonnateur>
                        }
                        <H2DetailsDepartement>Les cours du département </H2DetailsDepartement>
                        <DivListe>
                            {
                                loadingCours ?
                                    <Loader />
                                    :
                                    (
                                        cours?.map((unCours) => (
                                            <CarteCours key={unCours.id} cours={unCours} idDepartement={departement.id} allCours={cours} setAllCours={setCours} />
                                        ))
                                    )
                            }
                        </DivListe>
                        <H2DetailsDepartement>Les professeurs de ce département</H2DetailsDepartement>
                        <DivListe>
                            {
                                loadingProfesseurs ?
                                    <Loader />
                                    :
                                    professeurs?.map((professeur) => (
                                        <CarteProfesseur key={professeur.id} idProfesseur={professeur.id} nomProfesseur={professeur.name} matieresProfesseur={professeur.nom} />
                                    ))
                            }
                        </DivListe>
                    </DivDetailsDepartement>
            }
        </DivPageDetailsDepartement>
    )
}

export default DetailsDepartement;