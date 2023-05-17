import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AppContext } from '../../utils/context/context';

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

function DetailsDepartement() {
    const { id } = useParams();
    const { apiAccess } = useContext(AppContext);

    // Tous les booleens indiquant si la ressource a ete chargee ou non
    const [loadingDepartement, setLoadingDepartement] = useState(true);
    const [loadingCoordo, setLoadingCoordo] = useState(true);
    const [loadingCours, setLoadingCours] = useState(true);
    const [loadingProfesseurs, setLoadingProfesseurs] = useState(true);

    const [departement, setDepartement] = useState([]);
    const [cours, setCours] = useState([]);
    const [coordo, setCoordo] = useState([]);
    const [professeurs, setProfesseurs] = useState([]);


    const getInfos = async () => {
        // ---- RECUPERATION DES INFORMATIONS DU DEPARTEMENT ---- //
        const resultatDepartement = await apiAccess({
            url: `http://localhost:8000/api/departements/${id}`,
            method: "get",
        });
        setLoadingDepartement(false);


        // -- Analyse --
        if (resultatDepartement.success) {
            setDepartement(resultatDepartement.datas);


            // ---- RECUPERATION DU COORDONNATEUR ---- //
            const resultatCoordo = await apiAccess({
                url: `http://localhost:8000/api/departements/${id}/coordonnateur`,
                method: "get",
            });
            setLoadingCoordo(false);

            // -- Analyse du coordo --
            if (resultatCoordo.success) {
                setCoordo(resultatCoordo.datas);
            }
            else {
                /** @todo Gerer l erreur */
                console.error(resultatCoordo.erreur);
            }


            // ---- RECUPERATION DES COURS ---- //
            const resultatCours = await apiAccess({
                url: `http://localhost:8000/api/departements/${id}/cours`,
                method: "get",
            });
            setLoadingCours(false);

            // -- Analyse --
            if (resultatCours.success) {
                setCours(resultatCours.datas);
            }
            else {
                /** @todo Gerer l erreur */
                console.error(resultatCours.erreur);
            }

            // ---- RECUPERATION DES PROFESSEURS ---- //
            const resultatProfesseurs = await apiAccess({
                url: `http://localhost:8000/api/departements/${id}/users`,
                method: "get",
            });
            setLoadingProfesseurs(false);

            // -- Analyse --
            if (resultatProfesseurs.success) {
                setProfesseurs(resultatProfesseurs.datas);
            }
            else {
                /** @todo Gerer l erreur */
                console.error(resultatProfesseurs.erreur);
            }
        }
        else {
            /** @todo Gerer l erreur */
            console.error(resultatDepartement.erreur);
        }

    }

    // Récupération des données
    useEffect(() => {
        getInfos();
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