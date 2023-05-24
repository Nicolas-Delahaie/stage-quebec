import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AppContext } from '../../utils/context/context';

import styled from "styled-components";

import { Loader, colors, fonts } from "../../utils/styles";
import ArticleTitle from "../../components/forms/ArticleTitle";
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
    const [loadingDepartement, setLoadingDepartement] = useState(null);
    const [loadingCoordo, setLoadingCoordo] = useState(null);
    const [loadingCoursProposes, setLoadingCoursProposes] = useState(null);

    const [erreurDepartement, setErreurDepartement] = useState(null);
    const [erreurCoordo, setErreurCoordo] = useState(null);
    const [erreurCoursProposes, setErreurCoursProposes] = useState(null);

    const [departement, setDepartement] = useState(null);
    const [coursProposes, setCoursProposes] = useState(null);
    const [coordo, setCoordo] = useState(null);


    const getInfos = async () => {
        // ---- RECUPERATION DES INFORMATIONS DU DEPARTEMENT ---- //
        setLoadingDepartement(true);
        const resultatDepartement = await apiAccess({
            url: `http://localhost:8000/api/departements/${id}`,
            method: "get",
        });
        setLoadingDepartement(false);


        // -- Analyse --
        if (resultatDepartement.success) {
            setDepartement(resultatDepartement.datas);


            // ---- RECUPERATION DU COORDONNATEUR ---- //
            setLoadingCoordo(true);
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
                setErreurCoordo(resultatCoordo.erreur)
            }


            // ---- RECUPERATION DES COURS PROPOSES---- //
            setLoadingCoursProposes(true);
            const resultatCoursProposes = await apiAccess({
                url: `http://localhost:8000/api/departements/${id}/cours_proposes_detailles`,
                method: "get",
            });
            setLoadingCoursProposes(false);

            // -- Analyse --
            if (resultatCoursProposes.success) {
                setCoursProposes(resultatCoursProposes.datas);
            }
            else {
                setErreurCoursProposes(resultatCoursProposes.erreur);
            }

        }
        else {
            setErreurDepartement(resultatDepartement.erreur);
        }

    }

    // Récupération des données
    useEffect(() => {
        getInfos();
    }, []);


    return (
        <DivPageDetailsDepartement>
            {loadingDepartement && <Loader />}
            {erreurDepartement && <H2DetailsDepartement>Erreur : {erreurDepartement}</H2DetailsDepartement>}
            {departement &&
                <>
                    <ArticleTitle texte={departement.nom} />
                    <DivDetailsDepartement>
                        {loadingCoordo && <Loader />}
                        {erreurCoordo && <h1>Erreur : {erreurCoordo}</h1>}
                        {coordo && <H3Coordonnateur>Coordonné par : {coordo.name}</H3Coordonnateur>}

                        <H2DetailsDepartement>Cours proposés par le département </H2DetailsDepartement>
                        {loadingCoursProposes && <Loader />}
                        {erreurCoursProposes && <h1>Erreur : {erreurCoursProposes}</h1>}
                        {coursProposes &&
                            <>
                                <DivListe>
                                    {
                                        coursProposes?.map((coursPropose) => (
                                            <CarteCours key={coursPropose.id} coursPropose={coursPropose} idDepartement={departement.id} allCours={coursProposes} setAllCours={setCoursProposes} />
                                        ))
                                    }
                                </DivListe>
                            </>
                        }

                    </DivDetailsDepartement>
                </>
            }
        </DivPageDetailsDepartement>
    )
}

export default DetailsDepartement;