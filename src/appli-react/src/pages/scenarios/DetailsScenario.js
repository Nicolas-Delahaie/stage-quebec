/**
 * @todo Mieux gérer l affichage des modifications 
 */
import { ArticleTitle } from "../../components/forms";

import { resolvePath, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from '../../utils/context/context';

import { Loader, colors, fonts } from "../../utils/styles";

import styled from "styled-components";

import { calculCIP,calculCIL } from "./calculCI";

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
    max-width: 5rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};
    padding: 0.5rem;
    background-color: ${colors.jauneFonce};
    border: 1px solid ${colors.bleuFonce};
`;

const ThScenarioProfesseur = styled(ThScenario)`
    background-color: ${colors.jauneClair};
    text-orientation: mixed;
    writing-mode: vertical-rl;

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
    max-width: 5rem;
    font-family: ${fonts.texte};
    boder-collapse: collapse;
    border: 1px solid ${colors.bleuFonce};
    text-align: center;
    &:nth-child(-n+5) {
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



    /* ----------------------- FONCTIONS POUR LES CALCULS ----------------------- */

    var CITotal = 0;                                    // Variable pour le calcul de CI
    var heuresCoursTotal = 0;                                // Variable pour le calcul des heures
    var liberationTotal = 0;                                // Variable pour le calcul des libérations
    var tempsAloueLiberation = 0;                           // Variable pour le calcul du temps alloué aux libérations



    /* -------------------------------- USEEFFECT ------------------------------- */

    const [isLoadingScenario, setIsLoadingScenario] = useState(false);              // State du chargement des informations générales du scénario
    const [isLoadingModifications, setIsLoadingModifications] = useState(false);    // State du chargement des modifications du scénario
    const [isLoadingRepartition, setIsLoadingRepartition] = useState(false);        // State du chargement de la répartition du scénario
    const [erreurModifications, setErreurModifications] = useState(false);          // State de l'erreur lors de la récupération des modifications du scénario
    const [erreurRepartition, setErreurRepartition] = useState(false);              // State de l'erreur lors de la récupération de la répartition du scénario
    const [erreurScenario, setErreurScenario] = useState(false);                    // State de l'erreur lors de la récupération des informations générales du scénario

    /**
     * Fonction qui récupère les informations générales du scénario
     */
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

    /**
     * Fonction qui récupère les modifications du scénario
     */
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

    /**
     * Fonction qui récupère la répartition du scénario
     */
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


    useEffect(() => {
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
    var liberationMatch = false;                         // Variable de comparaison pour les libérations

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

        // Recherche de première occurence de la libération
        TbLiberations.forEach(lib => {
            if (lib.id == idLiberation) {
                libExiste = true;
            }
        }
        );

        // Si la libération n'existe pas, on l'ajoute au tableau
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

        // Recherche de première occurence du professeur
        TbProfesseurs.forEach(prof => {
            if (prof.id == idProfesseur) {
                professeurExiste = true;
            }
        });

        // Si le professeur n'existe pas, on l'ajoute au tableau
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

    /**
     * 
     * @param {*} attribution quel cours est enseigné par quel professeur
     * @returns TbAttribution un tableau avec les attributions
     */
    const addAttribution = (attribution) => {
        var idCours = attribution.cours_propose_id;
        var idProfesseur = attribution.professeur_id;
        var nbGoupes = attribution.nbGroupes

        return TbAttribution.push({ 'idCours': idCours, 'idProfesseur': idProfesseur, 'nbGroupes': nbGoupes });
    }

    // mise en place des tableaux professeurs et cours
    scenarioRepartition.id ? scenarioRepartition.departement.repartition.map((cours) => {
        addCours(cours);
        cours.enseignants.map((enseignant) => {
            addProfesseur(enseignant);
            addAttribution(enseignant.pivot);
        })
    }) : console.log("pas de scenarioRepartition");

    // mise en place du tableau des libérations
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
                    <H1Scenario data-testis="titreDep">Département : {scenario.departement.nom}</H1Scenario>
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
                                    <ThScenario>Nbre d'élèves</ThScenario>
                                    <ThScenario>Nbre GR</ThScenario>
                                    <ThScenario>Nbre él. par groupe</ThScenario>
                                    {
                                        scenarioRepartition.aEteValide === undefined ? (
                                            <ThScenario></ThScenario>
                                        ) : (
                                            TbProfesseurs.map((professeur) => (
                                                <ThScenarioProfesseur key={professeur.nom}>{professeur.nom}</ThScenarioProfesseur>
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
                                            <TdScenario>{cours.nbGroupes*cours.tailleGroupes}</TdScenario>
                                            
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
                                            <TdScenario></TdScenario>
                                            <TdScenario>Le scénario n'a pas été chargé</TdScenario>
                                        </TrScenario>
                                    ) : (
                                        <>
                                            {
                                                // affiche chaque libération
                                                TbLiberations.map((liberation, indexLiberation) => (
                                                    //Pour chaque libération, on affiche l'ETC total 
                                                    liberationTotal = 0,
                                                    TbProfesseurs.map((professeur) => (
                                                        liberationMatch = TbLiberations.find(attribution => attribution.idProfesseur === professeur.id),
                                                        liberationMatch ? 
                                                            liberationTotal += parseFloat(liberationMatch.tempsAloue)
                                                            : liberationTotal += 0
                                                    )),
                                                    <TrScenario key={liberation.id}>
                                                        <TdScenario></TdScenario>
                                                        <TdScenario></TdScenario>
                                                        <TdScenario></TdScenario>
                                                        <TdScenario>{liberation.motif}</TdScenario>
                                                        <TdScenario>{liberationTotal}</TdScenario>
                                                        {
                                                            // Pour chaque professeur, on affiche ses libérations
                                                            TbProfesseurs.map((professeur, indexProfesseur) => {
                                                                // On cherche si le professeur a une libération
                                                                liberationMatch = TbLiberations.find(attribution => attribution.idProfesseur === professeur.id);
                                                                return (
                                                                    // Si on a une libération, on affiche le temps alloué
                                                                    liberationMatch ? (
                                                                        tempsAloueLiberation = parseFloat(liberationMatch.tempsAloue),
                                                                        <TdScenario key={indexLiberation + ',' + indexProfesseur}>
                                                                            {tempsAloueLiberation.toFixed(3)}
                                                                        </TdScenario>
                                                                    ) : (
                                                                        // Sinon on n'affiche rien
                                                                        <TdScenario key={indexLiberation + ',' + indexProfesseur}></TdScenario>
                                                                    )
                                                                );
                                                            })
                                                        }
                                                    </TrScenario>
                                                ))
                                            }
                                        </>
                                    )

                                }

                                {//Partie pour les totaux
                                }
                                < TrTitreScenario >
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario>Totaux</TdScenario>
                                </TrTitreScenario>

                                <TrScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario>Calcul de CI</TdScenario>
                                    {
                                        // Pour chaque professeur, on affiche le total de CI
                                        TbProfesseurs.map((professeur) => (
                                            // On initialise le total de CI à 0
                                            CITotal = 0,
                                            // On récupère toutes les attributions du professeur
                                            TbAttribution.map((attribution) => {
                                                if (attribution.idProfesseur === professeur.id) {
                                                    const coursMatch = TbCours.find(cours => cours.id === attribution.idCours);
                                                    // On ajoute le CI du cours au total de CI
                                                    CITotal += parseFloat(calculCIP(attribution.nbGroupes, coursMatch.ponderation, coursMatch.tailleGroupes, 1));

                                                }
                                            }),
                                            TbLiberations.map((liberation) => {
                                                if (liberation.idProfesseur === professeur.id) {
                                                    // On ajoute le CI du cours au total de CI
                                                    CITotal += parseFloat(calculCIL(liberation.tempsAloue));
                                                }
                                            }),
                                            // On affiche le total de CI
                                            <TdScenario key={'Ci de ' + professeur.nom}>{CITotal.toFixed(2)}</TdScenario>
                                        ))
                                    }
                                </TrScenario>
                                <TrScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario></TdScenario>
                                    <TdScenario>Heures de cours</TdScenario>
                                    {
                                        // Pour chaque professeur, on affiche le total d'heures de cours
                                        TbProfesseurs.map((professeur) => (
                                            // On initialise le total d'heures de cours à 0
                                            heuresCoursTotal = 0,
                                            // On récupère toutes les attributions du professeur
                                            TbAttribution.map((attribution) => {
                                                if (attribution.idProfesseur === professeur.id) {
                                                    const coursMatch = TbCours.find(cours => cours.id === attribution.idCours);
                                                    // On ajoute le nombre d'heures de cours au total d'heures de cours
                                                    heuresCoursTotal += attribution.nbGroupes * coursMatch.ponderation;
                                                }
                                            }),
                                            // On affiche le total d'heures de cours
                                            <TdScenario key={'Heures de cours de ' + professeur.nom}>{heuresCoursTotal.toFixed(2)}</TdScenario>
                                        ))
                                    }
                                </TrScenario>
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
