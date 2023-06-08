/**
 * @todo Mieux gérer l affichage des modifications 
 * @todo Prevoir des parametres d url faux (pas un chiffre bon par exemple)
 */

// Librairies
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from '../../utils/context/context';
import { Toaster, toast } from "react-hot-toast";

// Composants
import Loader from '../../components/Loader.js';
import { TdScenario, TdScenarioComponent } from "../../components/TdScenario";

//Fonctions de calculs
import { calculCIP, calculCIL } from "./calculCI";

// Style
import styled from "styled-components";
import { colors, fonts } from "../../utils/styles";

/* ---------------------------------- STYLE --------------------------------- */

const DivPageDetailsScenario = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 80.5vh;
    margin: 1rem auto;
`;

const DivGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1rem 0rem;
    width: 100%;
`;

const DivDetailsScenario = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 80%;
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

const DivShow = styled.div`
    display: flex;
    align-items: center;
`;

const ButtonShow = styled.button`
transition: all 0.3s ease-in-out;
transform: ${props => props.showInfos ? "rotate(180deg)" : "rotate(0deg)"};
    background-color: transparent;
    border: none;
`;

const DivInfosScenario = styled.div`
transition: all 0.3s ease-in-out;
    display: ${props => props.showInfos ? "flex" : "none"};
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;


const H1Scenario = styled.h1`
    font-size: 2rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};
    margin-right: 1rem;
    margin: 0rem;

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
    border: 1px solid ${colors.gris};
    overflow-x: scroll;
    `;

const ThScenario = styled.th`
    font-size: 0.9rem;
    width: 2.5rem;
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};
    background-color: ${colors.jauneFonce};
    border: 1px solid ${colors.noir};
`;

const ThScenarioProfesseur = styled(ThScenario)`
    background-color: ${colors.jauneClair};
    text-orientation: mixed;
    writing-mode: vertical-rl;

`;

const TrScenario = styled.tr`
    font-size: 0.9rem;
    width: 100%;
    font-family: ${fonts.texte};
    border-collapse: collapse;
    border: 1px solid ${colors.gris};
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
    const [professeurs, setProfesseurs] = useState([]);                            // State des professeurs
    const { apiAccess } = useContext(AppContext);                                   // Récupération de la fonction permetant de faire des apels apis



    /* ----------------------- VARIABLES POUR LES CALCULS ----------------------- */

    var CITotal = 0;                                    // Variable pour le calcul de CI
    var heuresCoursTotal = 0;                                // Variable pour le calcul des heures
    var liberationTotal = 0;                                // Variable pour le calcul des libérations
    var ETCSession = 0;                                    // Variable pour le calcul des ETC


    /* ---------------------------- INITIALISATIONS DES TABLEAUX ---------------------------- */

    var TbLiberations = [];                                                           // Tableau des libérations
    var TbProfesseurs = [];                                                           // Tableau des professeurs   
    var TbCours = [];                                                                 // Tableau des cours
    var TbRepartitionProfesseur = [];                                                           // Tableau des attirbution de cours d'un professeur
    const [TbRepartition, setTbRepartition] = useState([])                            // Tableau des attirbution de cours
    const [TbCI, setTbCI] = useState([])                                             // Tableau des CI

    /**
     * 
     * @param {*} liberation liberation à ajouter au tableau
     * @returns un tableau avec les libérations
     */
    const addLiberation = (liberation) => {
        var motifLiberation = liberation.motif;
        var libExiste = false;

        // Recherche de première occurence de la libération
        TbLiberations.forEach(lib => {
            if (lib.motif == motifLiberation) {
                libExiste = true;
            }
        }
        );

        // Si la libération n'existe pas, on l'ajoute au tableau
        if (!libExiste) {
            TbLiberations.push({ 'motif': motifLiberation });
        }
    }

    /**
     * Permet de trier les libérations par ordre alphabétique des statuts et les nom de professeur commencant par "Prof" en dernier
     * @returns un tableau trié par ordre alphabétique des statuts
     */
    const trierProfesseurs = () => {
        TbProfesseurs.sort(function (a, b) {
            if (a.nom.startsWith("Prof") && !b.nom.startsWith("Prof")) {
                return 1; // a avant b car a commence par "Prof" et b non
            }
            if (!a.nom.startsWith("Prof") && b.nom.startsWith("Prof")) {
                return -1; // b avant a car b commence par "Prof" et a non
            }
            if (a.nom.startsWith("Prof") && b.nom.startsWith("Prof")) {
                return a.nom.localeCompare(b.nom); // tri alphabétique pour les noms commençant par "Prof"
            }
            // Tri par statut si aucun nom ne commence par "Prof"
            if (a.statut === "P" && b.statut === "TP") {
                return -1; // "P" avant "TP"
            }
            if (a.statut === "TP" && b.statut === "P") {
                return 1; // "TP" après "P"
            }
            return 0; // Aucun changement
        });
    }

    /**
     * 
     * @param {*} professeur professeur à ajouter au tableau
     * @returns un tableau avec les professeurs
     */
    const addProfesseur = (professeur) => {
        var idProfesseur = professeur.id;
        var liberationsProfesseur = professeur.liberations;
        var statut = professeur.statut;
        var professeurExiste = false;

        // Recherche de première occurence du professeur
        TbProfesseurs.forEach(prof => {
            if (prof.id == idProfesseur) {
                professeurExiste = true;
            }
        });

        // Si le professeur n'existe pas, on l'ajoute au tableau
        if (!professeurExiste) {
            TbProfesseurs.push({ 'id': idProfesseur, 'prenom': professeur.prenom, 'nom': professeur.nom, 'liberations': liberationsProfesseur, 'statut': statut });
        }
        trierProfesseurs();
    }


    /**
     * 
     * @param {*} cours cours à ajouter au tableau
     * @returns un tableau avec les cours
     */
    const addCours = (cours) => {
        var idCours = cours.id;
        var tailleGroupes = cours.tailleGroupes;
        var nbGroupes = cours.nbGroupes;
        var ponderation = cours.ponderation;
        var nomCours = cours.cours.nom;
        var nbEtudiantsTotal = tailleGroupes * nbGroupes;
        var coursExiste = false;

        // Recherche de première occurence du cours
        TbCours.forEach(cour => {
            if (cour.id == idCours) {
                coursExiste = true;
            }
        });

        // Si le cours n'existe pas, on l'ajoute au tableau
        if (!coursExiste) {
            TbCours.push({ 'id': idCours, 'nom': nomCours, 'nbGroupes': nbGroupes, 'ponderation': ponderation, 'tailleGroupes': tailleGroupes, 'nbEtudiantsTotal': nbEtudiantsTotal });
        }
    }

    /**
     * 
     * @param {*} Repartition quel cours est enseigné par quel professeur
     * @returns TbRepartition un tableau avec les Repartitions
     */
    const addRepartition = (repartition) => {
        var idRepartition = repartition.id;
        var idCours = repartition.enseigner.cours_propose_id;
        var idProfesseur = repartition.enseigner.professeur.id;
        var nbGoupes = repartition.nbGroupes
        var preparation = repartition.preparation;
        var repartitionExiste = false;

        // Recherche de première occurence de la repartition
        TbRepartition.forEach(rep => {
            if (rep.idCours == idCours && rep.idProfesseur == idProfesseur) {
                repartitionExiste = true;
            }
        });

        // Si la repartition n'existe pas, on l'ajoute au tableau
        if (!repartitionExiste) {
            TbRepartition.push({ 'id': idRepartition, 'idCours': idCours, 'idProfesseur': idProfesseur, 'nbGroupes': nbGoupes, 'preparation': preparation });
        }
    }

    const addCI = (CI) => {
        TbCI.push(CI);
    }

    
    /* -------------------------------- USEEFFECT ------------------------------- */

    const [isLoadingScenario, setIsLoadingScenario] = useState(true);              // State du chargement des informations générales du scénario
    const [isLoadingModifications, setIsLoadingModifications] = useState(true);    // State du chargement des modifications du scénario
    const [isLoadingRepartition, setIsLoadingRepartition] = useState(true);        // State du chargement de la répartition du scénario
    const [erreurModifications, setErreurModifications] = useState(true);          // State de l'erreur lors de la récupération des modifications du scénario
    const [erreurRepartition, setErreurRepartition] = useState(true);              // State de l'erreur lors de la récupération de la répartition du scénario
    const [erreurScenario, setErreurScenario] = useState(true);                    // State de l'erreur lors de la récupération des informations générales du scénario

    var liberationEstAffiche = false;                    // Variable pour savoir si la libération est affichée
    var liberationTotaleProf = 0;                        // Variable pour le calcul de la libération totale d'un professeur


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
            setErreurScenario(false);

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
                setErreurModifications(false);
            }
            else {
                toast.error("Erreur lors du chargement des modifications : " + rep2.erreur);
                setErreurModifications(true)
                setIsLoadingModifications(false);
            }
        }
        else {
            toast.error("Erreur lors du chargement des informations générales du scénario : " + rep.erreur);
            setErreurScenario(true);
            setIsLoadingScenario(false);
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

        setIsLoadingRepartition(true);

        if (rep.success) {
            setScenarioRepartition(rep.datas);
            setIsLoadingRepartition(false);
            setErreurRepartition(false);
        }
        else {
            toast.error("Erreur lors du chargement de la répartition" + rep.erreur);
            setIsLoadingRepartition(false);
            setErreurRepartition(true);
        }
    }

    const getProfesseurs = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/professeurs`,
            method: "get",
        });

        if (rep.success) {
            setProfesseurs(rep.datas[0].departement.professeurs);
        }
        else {
            toast.error("Erreur lors du chargement des professeurs" + rep.erreur);
        }
        
            console.log(TbProfesseurs);
    }

    useEffect(() => {
        getProfesseurs();
        getRepartition();
        getInfos();
    }, []);

    professeurs && professeurs.forEach((prof) => {
        addProfesseur(prof);
    })
console.log(TbProfesseurs);

    // mise en place des tableaux professeurs et cours
    scenarioRepartition && scenarioRepartition.map((repartition) => {
        addRepartition(repartition);
        addCours(repartition.enseigner.cours_propose);
        repartition.enseigner.professeur.liberations.map((liberation) => {
            addLiberation(liberation, repartition.enseigner.professeur.id);
        })
    })

    /* ---------------------------- AUTRES FONCTIONS ---------------------------- */

    const [showInfos, setShowInfos] = useState(false);
    const [showHistorique, setShowHistorique] = useState(false);

    const toggleShowInfos = () => {
        setShowInfos(!showInfos);
    }

    const toggleShowHistorique = () => {
        setShowHistorique(!showHistorique);
    }

    const afficherDate = (date) => {
        const dateTime = new Date(date);
        const options = { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedDateTime = dateTime.toLocaleDateString('fr-FR', options);
        return formattedDateTime;
    }


    /* ----------------------------------- DOM ---------------------------------- */

    return (
        <DivPageDetailsScenario>
            <Toaster />
            <h1 className="titrePrincipal">Détails du scénario</h1>
            <DivDetailsScenario>
                {
                    isLoadingRepartition ? (
                        <Loader />
                    ) : (
                        <>
                            <DivTableau>
                                <TableScenario>
                                    {//Première ligne du tableau, on affiche les noms des professeurs
                                    }
                                    <thead>
                                        <TrScenario>
                                            <ThScenario>Cours</ThScenario>
                                            <ThScenario>Pond</ThScenario>
                                            <ThScenario>Nbre d'élèves</ThScenario>
                                            <ThScenario>Nbre GR</ThScenario>
                                            <ThScenario>Él./groupe</ThScenario>
                                            {
                                                erreurRepartition ? (
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
                                        erreurRepartition ? (
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
                                                    <TdScenario>{cours.nbGroupes * cours.tailleGroupes}</TdScenario>
                                                    <TdScenario>{cours.nbGroupes}</TdScenario>
                                                    <TdScenario>{cours.tailleGroupes}</TdScenario>

                                                    {
                                                        TbProfesseurs.map((professeur, indexProfesseur) => {
                                                            const repartitionMatch = TbRepartition.find(
                                                                (Repartition) =>
                                                                    Repartition.idCours === cours.id && Repartition.idProfesseur === professeur.id
                                                            );
                                                            return repartitionMatch ? (
                                                                <TdScenarioComponent
                                                                    key={indexProfesseur + ',' + indexCours}
                                                                    indexCours={indexCours}
                                                                    indexProfesseur={indexProfesseur}
                                                                    nbGroupes={repartitionMatch.nbGroupes}
                                                                    TbCours={TbCours}
                                                                    TbProfesseurs={TbProfesseurs}
                                                                    TbRepartition={TbRepartition}
                                                                    fonctionUpdateRepartition={setTbRepartition}
                                                                />
                                                            ) : (
                                                                <TdScenario key={indexProfesseur + ',' + indexCours}></TdScenario>
                                                            );
                                                        })
                                                    }
                                                </TrScenario>
                                            ))
                                        )
                                    }

                                        < TrTitreScenario >
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario>Libération / Conge</TdScenario>
                                            <TdScenario>ETC</TdScenario>
                                        </TrTitreScenario>

                                        {
                                            erreurRepartition ? (
                                                null
                                            ) : (
                                                <>
                                                    {
                                                        // affiche chaque libération
                                                        TbLiberations.map((liberation) => (
                                                            //Pour chaque libération, on affiche l'ETC total 
                                                            liberationTotal = 0,
                                                            TbProfesseurs.map((professeur) => (
                                                                professeur.liberations.map((liberationProfesseur) => (
                                                                    liberationProfesseur.motif === liberation.motif ?
                                                                        liberationTotal += parseFloat(liberationProfesseur.pivot.tempsAloue)
                                                                        : null
                                                                ))

                                                            )),
                                                            <TrScenario key={liberation.motif}>
                                                                <TdScenario></TdScenario>
                                                                <TdScenario></TdScenario>
                                                                <TdScenario></TdScenario>
                                                                <TdScenario>{liberation.motif}</TdScenario>
                                                                <TdScenario>{liberationTotal.toFixed(3)}</TdScenario>
                                                                {
                                                                    TbProfesseurs.map((professeur) => (
                                                                        liberationTotaleProf = 0,
                                                                        professeur.liberations.map((liberationProfesseur) => (
                                                                            liberationProfesseur.motif === liberation.motif ?
                                                                                liberationEstAffiche ? (
                                                                                    liberationTotaleProf += parseFloat(liberationProfesseur.pivot.tempsAloue))
                                                                                    : (
                                                                                        liberationTotaleProf = parseFloat(liberationProfesseur.pivot.tempsAloue),
                                                                                        liberationEstAffiche = true
                                                                                    )
                                                                                : <TdScenario key={liberation.id}></TdScenario>
                                                                        )),
                                                                        liberationTotaleProf === 0 ? <TdScenario key={liberation.motif + ',' + professeur.nom}></TdScenario>
                                                                            : <TdScenario key={liberation.motif + ',' + professeur.nom}>{liberationTotaleProf.toFixed(3)}</TdScenario>
                                                                    ))
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
                                                    // On initialise le tableau de Repartition du professeur à vide
                                                    TbRepartitionProfesseur = [],
                                                    // On récupère toutes les Repartitions du professeur
                                                    TbRepartition.map((repartition) => {
                                                        if (repartition.idProfesseur === professeur.id) {
                                                            //on cherche le cours correspondant à la repartition
                                                            const coursMatch = TbCours.find(
                                                                (cours) =>
                                                                    cours.id === repartition.idCours
                                                            );
                                                            //on crée un objet repartition pour l'ajouter au tableau de repartition du professeur
                                                            var repartitionTemp = {
                                                                nbGroupes: repartition.nbGroupes,
                                                                ponderation: coursMatch.ponderation,
                                                                tailleGroupes: coursMatch.tailleGroupes,
                                                            }
                                                            // On ajoute le CI du cours au total de CI
                                                            TbRepartitionProfesseur.push(repartitionTemp);
                                                        }
                                                    }),
                                                    CITotal += parseFloat(calculCIP(TbRepartitionProfesseur)),
                                                    professeur.liberations.map((liberation) => (
                                                        // On ajoute le CI de la libération au total de CI
                                                        CITotal += parseFloat(calculCIL(Number(liberation.pivot.tempsAloue)))
                                                    )),
                                                    addCI(CITotal),
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
                                                    // On récupère toutes les Repartitions du professeur
                                                    TbRepartition.map((Repartition) => {
                                                        if (Repartition.idProfesseur === professeur.id) {
                                                            const coursMatch = TbCours.find(cours => cours.id === Repartition.idCours);
                                                            // On ajoute le nombre d'heures de cours au total d'heures de cours
                                                            heuresCoursTotal += Repartition.nbGroupes * coursMatch.ponderation;
                                                        }
                                                    }),
                                                    // On affiche le total d'heures de cours
                                                    <TdScenario key={'Heures de cours de ' + professeur.nom}>{heuresCoursTotal.toFixed(2)}</TdScenario>
                                                ))
                                            }
                                        </TrScenario>
                                        <TrScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario>ETC Session</TdScenario>
                                            {
                                                // Pour chaque professeur, on affiche le total d'ETC Session
                                                TbProfesseurs.map((professeur, indexProfesseur) => (
                                                    // On initialise le total d'ETC Session à 0
                                                    ETCSession = 0,
                                                    // On divise 40 par la CI du professeur
                                                    ETCSession = parseFloat(TbCI[indexProfesseur] / 40),
                                                    // On affiche le total d'ETC Session
                                                    <TdScenario key={'ETC Session de ' + professeur.nom}>{ETCSession.toFixed(3)}</TdScenario>
                                                ))
                                            }
                                        </TrScenario>
                                        <TrScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario>Statut</TdScenario>
                                            {
                                                // Pour chaque professeur, on affiche le total d'ETC Session
                                                TbProfesseurs.map((professeur,indexProfesseur) => (
                                                    //On vérifie si si la CI du professeur n'est pas égale à 0
                                                    TbCI[indexProfesseur] !== 0 ?
                                                    // On affiche le statut du professeur
                                                    <TdScenario key={'Statut de ' + professeur.nom}>{professeur.statut}</TdScenario>
                                                    :
                                                    // On affiche C
                                                    <TdScenario key={'Statut de ' + professeur.nom}>C</TdScenario>
                                                ))
                                            }
                                        </TrScenario>
                                        <TrScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario></TdScenario>
                                            <TdScenario>ETC Réel</TdScenario>
                                            {
                                                // Pour chaque professeur, on affiche le total d'ETC Session
                                                TbProfesseurs.map((professeur, indexProfesseur) => (
                                                    professeur.statut === "Professeur" ?
                                                        <TdScenario key={'Statut de ' + professeur.nom}>{professeur.statut}</TdScenario>
                                                        : (
                                                            // On initialise le total d'ETC Session à 0
                                                            ETCSession = 0,
                                                            // On divise 40 par la CI du professeur
                                                            ETCSession = parseFloat(TbCI[indexProfesseur] / 40),

                                                            // Si l'ETC Session est supérieur à 0.95, on affiche 1 sinon on affiche l'ETC Session
                                                            ETCSession >= 0.95 ?
                                                                <TdScenario key={'ETC Réel de ' + professeur.nom} >{1}</TdScenario>
                                                                : <TdScenario key={'ETC Réel de ' + professeur.nom}>{ETCSession.toFixed(3)}</TdScenario>
                                                        )

                                                ))
                                            }
                                        </TrScenario>

                                    </tbody>
                                </TableScenario>

                            </DivTableau>
                        </>
                    )
                }
                <DivGrid>
                    <div>
                        <DivShow>
                            <H1Scenario data-testis="titreDep">Informations générales</H1Scenario>
                            <ButtonShow onClick={toggleShowInfos} showInfos={showInfos}>
                                <img width="35" height="35" src="https://img.icons8.com/ios/50/circled-chevron-down.png" alt="circled-chevron-down" />
                            </ButtonShow>
                        </DivShow>
                        {
                            isLoadingScenario ? (
                                <DivInfosScenario showInfos={showInfos}>
                                    <Loader />
                                </DivInfosScenario>
                            ) : (

                                <>
                                    <DivInfosScenario showInfos={showInfos}>
                                        {
                                            erreurScenario ? (
                                                <p>Une erreur est survenue lors du chargement des informations du scénario</p>
                                            ) : (
                                                <>
                                                    <H2Scenario>Nom : {scenario.departement.nom}</H2Scenario>
                                                    <H2Scenario>Annee : {scenario.annee}</H2Scenario>
                                                    <p>Date de création : {afficherDate(scenario.created_at)}</p>
                                                    <H2Scenario>Propriétaire : {scenario.proprietaire.prenom} {scenario.proprietaire.nom}</H2Scenario>
                                                </>
                                            )
                                        }

                                    </DivInfosScenario>
                                </>
                            )
                        }
                    </div>
                    <div>
                        <DivShow>
                            <H1Scenario>Historique des modifications</H1Scenario>
                            <ButtonShow onClick={toggleShowHistorique} showInfos={showHistorique}>
                                <img width="35" height="35" src="https://img.icons8.com/ios/50/circled-chevron-down.png" alt="circled-chevron-down" />
                            </ButtonShow>
                        </DivShow>
                        {
                            isLoadingModifications ? (
                                <DivInfosScenario showInfos={showHistorique}>
                                    <Loader />
                                </DivInfosScenario>
                            ) : (
                                <>
                                    <DivInfosScenario showInfos={showHistorique}>
                                        {
                                            erreurModifications || modifications.length === 0 ? (
                                                <p>Aucune modification n'a été apportée</p>
                                            ) : (
                                                <div>
                                                    {
                                                        /*Pour chaque modification, on affiche la date de modification et l'utilisateur qui a fait la modification*/
                                                        modifications.map((modif) => (
                                                            <div key={modif.id}>
                                                                <p>Date de dernière modification : {modif.date_modif}</p>
                                                                <p>Utilisateur aillant fait la modification : {modif.user.prenom} {modif.user.nom}</p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                    </DivInfosScenario>
                                </>
                            )
                        }
                    </div>
                </DivGrid>
            </DivDetailsScenario>
        </DivPageDetailsScenario >
    )

}

export default DetailsScenario
