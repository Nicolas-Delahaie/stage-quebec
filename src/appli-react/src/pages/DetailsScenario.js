/**
 * @todo Mieux gérer l affichage des modifications 
 * @todo Prevoir des parametres d url faux (pas un chiffre bon par exemple)
 */
import { ArticleTitle } from "../components/forms";

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from '../utils/context/context';

import { Loader, colors, fonts } from "../utils/styles";

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

const DivTableau = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: auto;

    ::-webkit-scrollbar {
        height: 0.5rem;
    }

    ::-webkit-scrollbar-track {
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: ${colors.jauneFonce};
        border-radius: 1rem;
    }
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

const TableScenario = styled.table`
    margin: 1rem auto;
    border-collapse: collapse;
    border: 1px solid ${colors.bleuFonce};

    overflow-x: scroll;
`;

const ThScenario = styled.th`
    font-size: 0.9rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};
    padding: 0.5rem;
    background-color: ${colors.jauneFonce};
    border: 1px solid ${colors.bleuFonce};

    &:nth-child(n+5) {
        text-orientation: mixed;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        width: 2rem;
    }
`;

const TrScenario = styled.tr`
    font-size: 0.9rem;
    font-family: ${fonts.texte};
    border-collapse: collapse;
    border: 1px solid ${colors.bleuFonce};
    /*&:nth-child(even) {
        background-color: ${colors.gris};
    }
    &:nth-child(odd) {
        background-color: ${colors.grisClair};
    }*/
    &:hover {
        background-color: ${colors.jauneTresClair};
    }
`;

const TdScenario = styled.td`
    font-size: 0.9rem;
    padding: 0.25rem;
    font-family: ${fonts.texte};
    boder-collapse: collapse;
    border: 1px solid ${colors.bleuFonce};
    text-align: center;
    &:nth-child(-n+4) {
        font-family: ${fonts.titre};
        background-color: ${colors.grisClair};
    }
    &:hover {
        background-color: ${colors.jauneClair};
    }
`;

const TrTitreScenario = styled(TrScenario)`
    font-family: ${fonts.titre};
    font-size: 1rem;
    background-color: ${colors.gris};
`;

/* ----------------------------------- DOM ---------------------------------- */

function DetailsScenario() {
    const id = useParams().id;                                                      // Récupération de l'id du scénario dans l'url
    const [scenario, setScenario] = useState({});                                   // State des données générales du scénario
    const [modifications, setModifications] = useState({});                           // State des modifications du scénario
    const [scenarioRepartition, setScenarioRepartition] = useState(null);             // State de la répartition du scénario
    const [loading, setLoading] = useState(false);                                  // State du chargement de la page
    const { apiAccess } = useContext(AppContext);                                   // Récupération de la fonction permetant de faire des apels apis
    const [isLoadingScenario, setIsLoadingScenario] = useState(true);               // loader pour le scenario
    const [isLoadingModifications, setIsLoadingModifications] = useState(true);     // loader pour les modifications
    const [isLoadingRepartition, setIsLoadingRepartition] = useState(true);         // loader pour la répartition

    var liberations = [];                                    // Tableau des libérations
    var professeurs = [];                                 // Tableau des professeurs   
    var TbCours = [];                                         // Tableau des cours
    var coursParEnseignant = [];                            // Tableau des cours par enseignant

    var enseignantMatch = null;                            // Variable de comparaison pour les professeurs
    var coursMatch = null;                               // Variable de comparaison pour les cours
    var CITotal = 0;                                    // Variable pour le calcul de CI

    /* ---------------------------- FONCTION D'AJOUT ---------------------------- */

    /**
     * 
     * @param {*} liberation liberation à ajouter au tableau
     * @returns un tableau avec les libérations
     */
    const addLiberation = (liberation) => {
        if (!liberations.includes(liberation)) {
            liberations.push(liberation);
        }
    }

    /**
     * 
     * @param {*} professeur professeur à ajouter au tableau
     * @returns un tableau avec les professeurs
     */
    const addProfesseur = (professeur) => {
        if (!professeurs.includes(professeur)) {
            professeurs.push(professeur);
        }
    }

    /**
     * 
     * @param {*} cours cours à ajouter au tableau
     * @returns un tableau avec les cours
     */
    const addCours = (cours, professeur) => {
        const existingProfesseur = coursParEnseignant.find(item => item.professeur === professeur);
        if (existingProfesseur) {
            existingProfesseur.cours.push(cours);
        } else {
            coursParEnseignant.push({ professeur, cours: [cours] });
        }
    }

    /* ----------------------- FONCTIONS POUR LES CALCULS ----------------------- */

    /**
     * 
     * @param {*} nbGroupes nombre de groupe du cours
     * @param {*} ponderation ponderation du professeur
     * @param {*} nbEtudiantsTotal nombre d'étudiants total
     * @param {*} nbEtudiantsDifferents nombre d'étudiants différents
     * @param {*} nbPreparation nombre de préparation du cours
     * @returns 
     */
    const calculCI = (nbGroupes, ponderation, nbEtudiantsTotal, nbEtudiantsDifferents, nbPreparation) => {
        var CIP = 0;
        var facteurPreparation = 0;

        //Calcul du facteur de préparation
        switch (nbPreparation) {
            case 1 || 2:
                facteurPreparation = 0.9;
                break;
            case 3:
                facteurPreparation = 1.1;
                break;
            default:
                facteurPreparation = 1.75;
        }

        CIP = facteurPreparation * ponderation

        CIP += (1.2 * ponderation * nbGroupes)

        if (ponderation * nbEtudiantsTotal > 415) {
            CIP += 0.04 * 415
        }
        else {
            CIP += 0.04 * (ponderation * nbEtudiantsTotal)
        }

        if (ponderation * nbEtudiantsTotal > 415) {
            CIP += 0.07 * (ponderation * nbEtudiantsTotal - 415)

        }
        if (nbEtudiantsDifferents > 74 && ponderation > 2) {
            CIP += 0.01 * nbEtudiantsDifferents

        }

        if (nbEtudiantsDifferents > 160 && ponderation > 2) {
            CIP += 0.1 * ((nbEtudiantsDifferents - 160) ** 2)
        }

        return CIP.toFixed(2);
    }

    /* -------------------------------- USEEFFECT ------------------------------- */

    const [erreurScenario, setErreurScenario] = useState(null);
    const [erreurModifications, setErreurModifications] = useState(null);

    const getInfos = async () => {
        setIsLoadingScenario(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/detaille`,
            method: "get",
        });
        setIsLoadingScenario(false);

        // -- Analyse du coordo --
        if (rep.success) {
            setScenario(rep.datas);

            // -- Recuperation des modifications --
            setIsLoadingModifications(true);
            const rep2 = await apiAccess({
                url: `http://localhost:8000/api/scenarios/${id}/modifications`,
                method: "get",
            });
            setIsLoadingModifications(false);

            // -- Analyse du coordo --
            if (rep2.success) {
                setModifications(rep2.datas);
            }
            else {
                setErreurModifications(rep2.erreur)
            }
        }
        else {
            setErreurScenario(rep.erreur);
        }
    }

    const getRepartition = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/repartition`,
            method: "get",
        });

        setIsLoadingRepartition(false);

        if (rep.success) {
            setScenarioRepartition(rep.datas);
        }
        else {
            /** @todo Gerer l erreur */
            console.log(rep.erreur)
        }
    }


    /**
     * Récupération des modifications du scénario
     */
    useEffect(() => {
        // Initialisation de informations
        getInfos();
        getRepartition();
    }, []);

    /* ----------------------------------- DOM ---------------------------------- */

    return (
        <DivPageDetailsScenario>
            <ArticleTitle texte="Détails du scénario" />

            {loading || scenario.id === undefined ? (
                <Loader />
            ) : (
                <DivDetailsScenario>
                    <H1Scenario>Département : {scenario.departement.nom}</H1Scenario>
                    <H2Scenario>Annee : {scenario.annee}</H2Scenario>
                    <p>Date de création : {scenario.created_at}</p>
                    <p>Dernière modification : {scenario.updated_at}</p>
                    <H2Scenario>Propriétaire : {scenario.proprietaire.name}</H2Scenario>
                    <H1Scenario>Historique des modifications</H1Scenario>
                    {
                        modifications[0] === undefined ? (
                            <p>Aucune modification n'a été apportée</p>
                        ) : (
                            <div>
                                {
                                    /*Pour chaque modification, on affiche la date de modification et l'utilisateur qui a fait la modification*/
                                    modifications.map((modif) => (
                                        <div key={modif.id}>
                                            <p>Date de dernière modification : {modif.date_modif}</p>
                                            <p>Utilisateur aillant fait la modification : {modif.user.name}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                    <H1Scenario>Répartition des cours</H1Scenario>
                    <DivTableau>
                        <TableScenario>
                            {/*Première ligne du tableau, on affiche les noms des professeurs*/}
                            <thead>
                                <TrScenario>
                                    <ThScenario>Titre du cours</ThScenario>
                                    <ThScenario>Pondération</ThScenario>
                                    <ThScenario>Nombre d'élèves</ThScenario>
                                    <ThScenario>Nombre de groupes</ThScenario>
                                    {
                                        scenarioRepartition ? (
                                            scenarioRepartition.map((cours) => (
                                                /*on stocke les cours dans un tableau afin de stocker le nombre de colonne*/
                                                addCours(cours),
                                                cours.enseignants.map((enseignant) => (
                                                    /*on stocke les professeurs dans un tableau afin de stocker le nombre de colonne*/
                                                    addProfesseur(enseignant),
                                                    <ThScenario key={enseignant.id}>{enseignant.name}</ThScenario>
                                                ))
                                            ))
                                        ) : (
                                            <ThScenario></ThScenario>
                                        )
                                    }
                                </TrScenario>
                            </thead>
                            <tbody>
                                {
                                    !scenarioRepartition ? (
                                        <TrScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario>Le scénario n'a pas été chargé</TdScenario>
                                        </TrScenario>
                                    ) : (
                                        /* On affiche toutes les informations du cours du département */
                                        scenarioRepartition.map((cours_propose) => (
                                            <TrScenario key={cours_propose.id}>
                                                <TdScenario>{cours_propose.cours.nom}</TdScenario>
                                                <TdScenario>{cours_propose.ponderation}</TdScenario>
                                                <TdScenario>{cours_propose.tailleGroupes}</TdScenario>
                                                <TdScenario>{cours_propose.nbGroupes}</TdScenario>
                                                {
                                                    /* Pour chaque professeur, on affiche la pondération du cours proposé en utilisant le tableau professeurs */
                                                    professeurs.map((professeur) => (
                                                        /*si le cours proposé n'a pas de professeur, on affiche une case vide*/
                                                        cours_propose.enseignants.length === 0 ? (
                                                            <TdScenario key={professeur.id}></TdScenario>
                                                        ) : (
                                                            /*sinon */
                                                            /*on vérifie si le professeur enseigne le cours propose*/
                                                            enseignantMatch = cours_propose.enseignants.find(enseignant => enseignant.id === professeur.id),

                                                            enseignantMatch ? (
                                                                addCours(cours_propose, professeur),
                                                                <TdScenario key={professeur.id}>{professeur.pivot.nbGroupes}</TdScenario>
                                                            ) : (
                                                                <TdScenario key={professeur.id}></TdScenario>
                                                            )
                                                        )

                                                    ))
                                                }
                                            </TrScenario>
                                        ))
                                    )
                                }

                                {/*Partie pour les libérations*/}
                                < TrTitreScenario >
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario>Libération / Conge</TdScenario>
                                    <TdScenario>ETC</TdScenario>
                                </TrTitreScenario>

                                {/*Partie pour les totaux*/}
                                {
                                    <TrScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario>Calcul de CI</TdScenario>
                                        {(() => {
                                            coursParEnseignant.shift();
                                            return coursParEnseignant.map((prof) => {
                                                CITotal = 0;
                                                prof.cours.map((cours) => {
                                                    CITotal += parseInt(calculCI(1, cours.ponderation, (cours.tailleGroupes * cours.nbGroupes), (cours.tailleGroupes * cours.nbGroupes), 1));
                                                });
                                                return <TdScenario>{CITotal}</TdScenario>;
                                            });
                                        })()}
                                    </TrScenario>
                                }
                            </tbody>
                        </TableScenario>
                    </DivTableau>

                </DivDetailsScenario>
            )
            }
        </DivPageDetailsScenario >
    )
}

export default DetailsScenario
