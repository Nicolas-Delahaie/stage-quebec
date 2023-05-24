/**
 * @todo Mieux gérer l affichage des modifications 
 */
import { ArticleTitle } from "../../components/forms";

import { resolvePath, useParams } from "react-router-dom";
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
    const [scenarioRepartition, setScenarioRepartition] = useState({});             // State de la répartition du scénario
    const [loading, setLoading] = useState(false);                                  // State du chargement de la page
    const { apiAccess } = useContext(AppContext);                                   // Récupération de la fonction permetant de faire des apels apis
    const [isLoadingScenario, setIsLoadingScenario] = useState(true);               // loader pour le scenario
    const [isLoadingModifications, setIsLoadingModifications] = useState(true);     // loader pour les modifications
    const [isLoadingRepartition, setIsLoadingRepartition] = useState(true);         // loader pour la répartition

    var enseignantMatch = null;                            // Variable de comparaison pour les professeurs
    var coursMatch = null;                               // Variable de comparaison pour les cours
    var CITotal = 0;                                    // Variable pour le calcul de CI


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
    const getModifications = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/modifications`,
            method: "get",
        });
        setIsLoadingModifications(false);

        // -- Analyse du coordo --
        if (rep.success) {
            setModifications(rep.datas);
        }
        else {
            /** @todo Gerer l erreur */
            console.log(rep.erreur)
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
        getModifications();
        getRepartition();
    }, []);

    /* ---------------------------- INITIALISATIONS DES TABLEAUX ---------------------------- */


    var TbLiberations = [];                                    // Tableau des libérations
    var TbProfesseurs = [];                                 // Tableau des professeurs   
    var TbCours = [];                                         // Tableau des cours
    var TbAttribution = [];                            // Tableau des attirbution de cours

    var repartitionMatch = false;                        // Variable de comparaison pour la répartition
    var liberationMatch = false;                        // Variable de comparaison pour les libérations

    /**
     * 
     * @param {*} liberation liberation à ajouter au tableau
     * @returns un tableau avec les libérations
     */
    const addLiberation = (liberation, idProfesseur) => {
        var idLiberation = liberation.id;
        var idProfesseur = idProfesseur;
        var motifLiberation = liberation.motif;
        var annee = liberation.pivot.annee;
        var semestre = liberation.pivot.semestre;
        var tempsAloue = liberation.pivot.tempsAloue;
        var libExiste = false;

        TbLiberations.forEach(lib => {
            if (lib.id == idLiberation) {
                libExiste = true;
            }
        }
        );

        if (!libExiste) {
            TbLiberations.push({ 'id': idLiberation, 'idProfesseur': idProfesseur, 'motif': motifLiberation, 'annee': annee, 'semestre': semestre, 'tempsAloue': tempsAloue });
        }
    }

    /**
     * 
     * @param {*} professeur professeur à ajouter au tableau
     * @returns un tableau avec les professeurs
     */
    const addProfesseur = (professeur) => {
        var idProfesseur = professeur.id;
        var nomProfesseur = professeur.name;
        var professeurExiste = false;

        TbProfesseurs.forEach(prof => {
            if (prof.id == idProfesseur) {
                professeurExiste = true;
            }
        });

        if (!professeurExiste) {
            TbProfesseurs.push({ 'id': idProfesseur, 'nom': nomProfesseur });
        }

    }

    /**
     * 
     * @param {*} cours cours à ajouter au tableau
     * @returns un tableau avec les cours
     */
    const addCours = (cours) => {
        var idCours = cours.id;
        var nomCours = cours.cours.nom;
        var nbGroupes = cours.nbGroupes;
        var ponderation = cours.ponderation;
        var tailleGroupes = cours.tailleGroupes;
        var nbEtudiantsTotal = tailleGroupes * nbGroupes;

        return TbCours.push({ 'id': idCours, 'nom': nomCours, 'nbGroupes': nbGroupes, 'ponderation': ponderation, 'tailleGroupes': tailleGroupes, 'nbEtudiantsTotal': nbEtudiantsTotal });

    }

    const addAttribution = (attribution) => {
        var idCours = attribution.cours_propose_id;
        var idProfesseur = attribution.professeur_id;
        var nbGoupes = attribution.nbGroupes

        return TbAttribution.push({ 'idCours': idCours, 'idProfesseur': idProfesseur, 'nbGroupes': nbGoupes });
    }

    console.log(scenarioRepartition)

    scenarioRepartition.id ? scenarioRepartition.departement.repartition.map((cours) => {
        addCours(cours);
        cours.enseignants.map((enseignant) => {
            addProfesseur(enseignant);
            addAttribution(enseignant.pivot);
        })
    }) : console.log("pas de scenarioRepartition");

    scenarioRepartition.id ? scenarioRepartition.departement.liberations.map((cours) => {
        cours.map((enseignant) => {
            enseignant.liberations.map((liberation) => {
                addLiberation(liberation, enseignant.id_enseignant);
            })
        })
    }) : console.log("pas de scenarioRepartition");



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
                    <H2Scenario>Propriétaire : {scenario.proprietaire.nom}</H2Scenario>
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
                                            <p>Utilisateur aillant fait la modification : {modif.utilisateur_name}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                    <H1Scenario>Le scénario </H1Scenario>
                    <H2Scenario>Répartition des cours</H2Scenario>
                    <DivTableau>
                        <TableScenario>
                            {//Première ligne du tableau, on affiche les noms des professeurs
                            }
                            <thead>
                                <TrScenario>
                                    <ThScenario>Titre du cours</ThScenario>
                                    <ThScenario>Pondération</ThScenario>
                                    <ThScenario>Nombre d'élèves</ThScenario>
                                    <ThScenario>Nombre de groupes</ThScenario>
                                    {
                                        scenarioRepartition.aEteValide === undefined ? (
                                            <ThScenario></ThScenario>
                                        ) : (
                                            TbProfesseurs.map((professeur) => (
                                                <ThScenario key={professeur.nom}>{professeur.nom}</ThScenario>
                                            ))
                                        )
                                    }
                                </TrScenario>
                            </thead>
                            <tbody>{
                                scenarioRepartition.aEteValide === undefined ? (
                                    <TrScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario>Le scénario n'a pas été chargée</TdScenario>
                                    </TrScenario>
                                ) : (
                                    // On affiche toutes les informations du cours du département 
                                    TbCours.map((cours, indexCours) => (
                                        <TrScenario key={cours.id}>
                                            <TdScenario>{cours.nom}</TdScenario>
                                            <TdScenario>{cours.ponderation}</TdScenario>
                                            <TdScenario>{cours.tailleGroupes}</TdScenario>
                                            <TdScenario>{cours.nbGroupes}</TdScenario>
                                            {
                                                // Pour chaque professeur, on affiche la pondération du cours en utilisant le tableau professeurs 
                                                TbProfesseurs.map((professeur, indexProfesseur) => (
                                                    repartitionMatch = TbAttribution.find(attribution => attribution.idCours === cours.id && attribution.idProfesseur === professeur.id),
                                                    repartitionMatch ?
                                                        <TdScenario key={indexCours + ',' + indexProfesseur}>{repartitionMatch.nbGroupes}</TdScenario>
                                                        : <TdScenario key={indexCours + ',' + indexProfesseur}></TdScenario>
                                                ))
                                            }
                                        </TrScenario>
                                    ))
                                )
                            }

                                {
                                    //Partie pour les libérations
                                }
                                < TrTitreScenario >
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario>Libération / Conge</TdScenario>
                                    <TdScenario>ETC</TdScenario>
                                </TrTitreScenario>

                                {
                                    scenarioRepartition.aEteValide === undefined ? (
                                        <TrScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario>Le scénario n'a pas été chargé</TdScenario>
                                        </TrScenario>
                                    ) : (
                                        <>
                                            {
                                                TbLiberations.map((liberation, indexLiberation) => (
                                                    <TrScenario key={liberation.id}>
                                                        <TdScenario></TdScenario>
                                                        <TdScenario></TdScenario>
                                                        <TdScenario></TdScenario>
                                                        <TdScenario>{liberation.motif}</TdScenario>
                                                        {
                                                            TbProfesseurs.map((professeur, indexProfesseur) => {
                                                                const liberationMatch = TbLiberations.find(attribution => attribution.idProfesseur === professeur.id);
                                                                return (
                                                                    liberationMatch ?
                                                                        <TdScenario key={indexLiberation + ',' + indexProfesseur}>{liberationMatch.tempsAloue}</TdScenario>
                                                                        : <TdScenario key={indexLiberation + ',' + indexProfesseur}></TdScenario>
                                                                );
                                                            })
                                                        }
                                                    </TrScenario>
                                                ))
                                            }
                                        </>
                                    )

                                }

                                {//Partie pour les totaux}
                                    <TrScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario></TdScenario>
                                        <TdScenario>Calcul de CI</TdScenario>
                                        {
                                            TbProfesseurs.map((professeur) => (
                                                CITotal = 0,
                                                TbAttribution.map((attribution) => {
                                                    if (attribution.idProfesseur === professeur.id) {
                                                        const coursMatch = TbCours.find(cours => cours.id === attribution.idCours);
                                                        CITotal += parseInt(calculCI(attribution.nbGroupes, coursMatch.ponderation, coursMatch.tailleGroupes, coursMatch.tailleGroupes, 1));
                                                    }
                                                }),
                                                <TdScenario key={'Ci de ' + professeur.nom}>{CITotal}</TdScenario>
                                            ))
                                        }
                                    </TrScenario>}
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
