/**
 * @todo Mieux gérer l affichage des modifications 
 * @todo Prevoir des parametres d url faux (pas un chiffre bon par exemple)
 */

// Librairies
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AppContext } from '../../utils/context/context';
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

// Composants
import Loader from '../../components/Loader.js';
import NomDepartement from "../../components/NomDepartement";
import NomUser from "../../components/NomUser";
import { TdScenario } from "./TdScenario";

//Fonctions de calculs
import { calculCIP, calculCIL } from "./calculCI";

/* -------------------------------------------------------------------------- */
/*                          DECLARATION DES VARIABLES                         */
/* -------------------------------------------------------------------------- */

function DetailsScenario() {
    const id = useParams().id;                                                      // Récupération de l'id du scénario dans l'url
    const [scenario, setScenario] = useState({});                                   // State des données générales du scénario
    const [modifications, setModifications] = useState({});                         // State des modifications du scénario
    const [scenarioRepartition, setScenarioRepartition] = useState(null);           // State de la répartition du scénario
    const [professeurs, setProfesseurs] = useState([]);                             // State des professeurs
    const { apiAccess } = useContext(AppContext);                                   // Récupération de la fonction permetant de faire des apels apis



    /* ----------------------- VARIABLES POUR LES CALCULS ----------------------- */

    var CITotal = 0;                                        // Variable pour le calcul de CI
    var heuresCoursTotal = 0;                               // Variable pour le calcul des heures
    var liberationTotal = 0;                                // Variable pour le calcul des libérations
    var ETCSession = 0;                                     // Variable pour le calcul des ETC


    /* ---------------------------- INITIALISATIONS DES TABLEAUX ---------------------------- */

    var TbLiberations = [];                                                           // Tableau des libérations
    var TbProfesseurs = [];                                                           // Tableau des professeurs   
    var TbCours = [];                                                                 // Tableau des cours
    var TbRepartitionProfesseur = [];                                                 // Tableau des répartitions de cours d'un professeur
    const [TbRepartition, setTbRepartition] = useState([])                            // Tableau des répartitions de cours
    const [TbCI, setTbCI] = useState([])                                              // Tableau des CI

    /* -------------------- STATES DE CHARGEMENT ET D'ERREURS ------------------- */
    const [isLoadingScenario, setIsLoadingScenario] = useState(null);              // State du chargement des informations générales du scénario
    const [isLoadingModifications, setIsLoadingModifications] = useState(null);    // State du chargement des modifications du scénario
    const [isLoadingRepartition, setIsLoadingRepartition] = useState(null);        // State du chargement de la répartition du scénario
    const [erreurModifications, setErreurModifications] = useState(null);          // State de l'erreur lors de la récupération des modifications du scénario
    const [erreurRepartition, setErreurRepartition] = useState(null);              // State de l'erreur lors de la récupération de la répartition du scénario
    const [erreurScenario, setErreurScenario] = useState(null);                    // State de l'erreur lors de la récupération des informations générales du scénario

    /* --------------------- VARIABLES POUR LES LIBERATIONS --------------------- */

    var liberationEstAffiche = false;                    // Variable pour savoir si la libération est affichée
    var liberationTotaleProf = 0;                        // Variable pour le calcul de la libération totale d'un professeur

    /* -------------------------------------------------------------------------- */
    /*                                  FOCNTIONS                                 */
    /* -------------------------------------------------------------------------- */

    /* ----------------------- FOCNTIONS POUR LES TABLEAUX ---------------------- */

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

    /**
     * @param int CI 
     * @returns un tableau avec les CI
     */
    const addCI = (CI) => {
        TbCI.push(CI);
    }

    /* ------------- FONCTION POUR RÉCUPÉRER LES DONNÉES DU SCÉNARIO ------------ */

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

        // -- Analyse de la réponse --
        if (rep.success) {
            setScenario(rep.datas);
            setErreurScenario(false);
        }
        else {
            setErreurScenario(rep.erreur);
            setIsLoadingScenario(false);
        }
    }

    /**
     * Fonction qui récupère les modifications du scénario
     */
    const getModifications = async () => {
        setIsLoadingModifications(true);
        // -- Recuperation des modifications --
        const rep2 = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/modifications`,
            method: "get",
        });
        setIsLoadingModifications(false);

        // -- Analyse de la réponse --
        if (rep2.success) {
            setModifications(rep2.datas);
            setErreurModifications(false);
        }
        else {
            setErreurModifications(rep2.erreur)
        }
    }

    /**
     * Fonction qui récupère les tous les professeurs du département
     */
    const getProfesseurs = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/professeurs`,
            method: "get",
        });

        // -- Analyse de la réponse --
        if (rep.success) {
            setProfesseurs(rep.datas[0].departement.professeurs);
            setErreurRepartition(false);
            setIsLoadingRepartition(false);
        }
        else {
            setErreurRepartition(rep.erreur);
            setIsLoadingRepartition(false);
        }
    }

    /**
     * Fonction qui récupère la répartition du scénario
     */
    const getRepartition = async () => {
        setIsLoadingRepartition(true);

        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios/${id}/repartition`,
            method: "get",
        });

        // -- Analyse de la réponse --
        if (rep.success) {
            setScenarioRepartition(rep.datas);
            getProfesseurs();

        }
        else {
            setErreurRepartition(rep.erreur);
            setIsLoadingRepartition(false);
        }
    }


    /* ---------------------------- USE EFFECT ---------------------------- */

    /**
     * Fonction qui s'execute au chargement de la page
     */
    useEffect(() => {
        getRepartition();
        getInfos();
        getModifications();
    }, []);

    /* ----------------------- INITIALISATION DES TABLEAUX ---------------------- */

    // Initialisation du tableau des professeurs
    professeurs && professeurs.forEach((prof) => {
        addProfesseur(prof);
    })

    // mise en place des tableaux répartition, cours et libération
    scenarioRepartition && scenarioRepartition.map((repartition) => {
        addRepartition(repartition);
        addCours(repartition.enseigner.cours_propose);
        repartition.enseigner.professeur.liberations.map((liberation) => {
            addLiberation(liberation, repartition.enseigner.professeur.id);
        })
    })

    /* ---------------------------- AUTRES FONCTIONS ---------------------------- */

    /**
     * @brief Retourne le nom de la session en fonction de son numero
     * @param {int} session Numero de la session
     */
    const nomSession = (session) => {
        switch (session) {
            case 1:
                return "Hiver";
            case 2:
                return "Printemps";
            case 3:
                return "Été";
        }
    };

    /* ------------------------ STRUCTURE HTML DE LA PAGE ----------------------- */

    return (
        <div id="detailsScenario" className={`page ${isLoadingRepartition ? "centrer" : ""}`} >
            <Toaster />
            {isLoadingRepartition && <Loader />}
            {erreurRepartition && <h2 id="erreur">Erreur : {erreurRepartition}</h2>}
            {/* -- Si le chargement est terminé -- */}
            {
                erreurRepartition === false &&
                <>
                    <h1 className="titrePrincipal">Détails du scénario</h1>
                    <div id="tableContainer">
                        <table>
                            {//Première ligne du tableau, on affiche les noms des professeurs
                            }
                            <thead>
                                <tr>
                                    <th title="Cours enseigné par le departement">Cours</th>
                                    <th title="Pondération du cours (son nombre d'heures enseignées par semaine)">Pond</th>
                                    <th title="Nombre d'élèves présents dans le cours">Nb el</th>
                                    <th title="Nombre de groupes">Nb gr</th>
                                    <th title="Nombre d'élèves par groupe">Nb El/gr</th>
                                    {
                                        erreurRepartition ? (
                                            <th></th>
                                        ) : (
                                            // On affiche les noms des professeurs
                                            TbProfesseurs.map((professeur) => (
                                                <th key={professeur.id}><NomUser user={professeur} cliquable="true" /></th>
                                            ))
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>{
                                erreurRepartition ? (
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>Le scénario n'a pas été chargée</td>
                                    </tr>
                                ) : <>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td colSpan={TbProfesseurs.length + 1} className="separateur"><b>Nombre de groupes</b></td>
                                    </tr>
                                    {
                                        TbCours.map((cours, indexCours) => (
                                            <tr key={cours.id}>
                                                <td>{cours.nom}</td>
                                                <td>{cours.ponderation}</td>
                                                <td>{cours.nbGroupes * cours.tailleGroupes}</td>
                                                <td>{cours.nbGroupes}</td>
                                                <td>{cours.tailleGroupes}</td>

                                                {
                                                    // On affiche les informations de la répartition du cours
                                                    TbProfesseurs.map((professeur, indexProfesseur) => {
                                                        // on cherche si le professeur a un répartition pour ce cours
                                                        const repartitionMatch = TbRepartition.find(
                                                            (Repartition) =>
                                                                Repartition.idCours === cours.id && Repartition.idProfesseur === professeur.id
                                                        );
                                                        // si oui on affiche les informations de la répartition grâce au composant TdScenario
                                                        return repartitionMatch ? (
                                                            <TdScenario
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
                                                            // sinon on affiche une case vide
                                                            <td key={indexProfesseur + ',' + indexCours}></td>
                                                        );
                                                    })
                                                }
                                            </tr>

                                        ))
                                    }
                                </>
                            }

                                < tr >
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Libération / Conge</td>
                                    <td></td>
                                    <td colSpan={TbProfesseurs.length} className="separateur" title="= Employer Temps Complet. Equivaut à une charge de travail d'un employer sur une session en temps complet."><b>ETC</b></td>
                                </tr>

                                {
                                    erreurRepartition ? (
                                        null
                                    ) : (
                                        <>
                                            {
                                                // affiche chaque libération
                                                TbLiberations.map((liberation) => (
                                                    //Pour chaque libération, on affiche l'ETC total en parcourant tous les professeurs 
                                                    liberationTotal = 0,
                                                    TbProfesseurs.map((professeur) => (
                                                        professeur.liberations.map((liberationProfesseur) => (
                                                            liberationProfesseur.motif === liberation.motif ?
                                                                liberationTotal += parseFloat(liberationProfesseur.pivot.tempsAloue)
                                                                : null
                                                        ))

                                                    )),
                                                    <tr key={liberation.motif}>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>{liberation.motif}</td>
                                                        <td className="limitationBlanc">{liberationTotal.toFixed(3)}</td>
                                                        {
                                                            //Pour chaque professeur, on affiche le temps alloué pour chaque libération
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
                                                                        : <td key={liberation.id}></td>
                                                                )),
                                                                liberationTotaleProf === 0 ? <td key={liberation.motif + ',' + professeur.nom}></td>
                                                                    : <td key={liberation.motif + ',' + professeur.nom}>{liberationTotaleProf.toFixed(3)}</td>
                                                            ))
                                                        }
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    )

                                }

                                {//Partie pour les totaux
                                }
                                < tr >
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td colSpan={TbProfesseurs.length + 1} className="separateur"><b>Totaux</b></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td title=" = Charge individuelle. Equivaut a 1/40 d'ETC">CI</td>
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
                                            <td key={'Ci de ' + professeur.nom}>{CITotal.toFixed(2)}</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Heures de cours</td>
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
                                            <td key={'Heures de cours de ' + professeur.nom}>{heuresCoursTotal.toFixed(2)}</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>ETC Session</td>
                                    {
                                        // Pour chaque professeur, on affiche le total d'ETC Session
                                        TbProfesseurs.map((professeur, indexProfesseur) => (
                                            // On initialise le total d'ETC Session à 0
                                            ETCSession = 0,
                                            // On divise 40 par la CI du professeur
                                            ETCSession = parseFloat(TbCI[indexProfesseur] / 40),
                                            // On affiche le total d'ETC Session
                                            <td key={'ETC Session de ' + professeur.nom}>{ETCSession.toFixed(3)}</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td title="Statut du professeur : P pour permanent, TP pour temps partiel et C pour congé">Statut</td>
                                    {
                                        // Pour chaque professeur, on affiche le total d'ETC Session
                                        TbProfesseurs.map((professeur, indexProfesseur) => (
                                            //On vérifie si si la CI du professeur n'est pas égale à 0
                                            TbCI[indexProfesseur] !== 0 ?
                                                // On affiche le statut du professeur
                                                <td key={'Statut de ' + professeur.nom}>{professeur.statut}</td>
                                                :
                                                // On affiche C
                                                <td key={'Statut de ' + professeur.nom}>C</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>ETC Réel</td>
                                    {
                                        // Pour chaque professeur, on affiche le total d'ETC Session
                                        TbProfesseurs.map((professeur, indexProfesseur) => (
                                            professeur.statut === "Professeur" ?
                                                <td key={'Statut de ' + professeur.nom}>{professeur.statut}</td>
                                                : (
                                                    // On initialise le total d'ETC Session à 0
                                                    ETCSession = 0,
                                                    // On divise 40 par la CI du professeur
                                                    ETCSession = parseFloat(TbCI[indexProfesseur] / 40),

                                                    // Si l'ETC Session est supérieur à 0.95, on affiche 1 sinon on affiche l'ETC Session
                                                    ETCSession >= 0.95 ?
                                                        <td key={'ETC Réel de ' + professeur.nom} >{1}</td>
                                                        : <td key={'ETC Réel de ' + professeur.nom}>{ETCSession.toFixed(3)}</td>
                                                )

                                        ))
                                    }
                                </tr>

                            </tbody>
                        </table>

                    </div>



                    <div id="infos">
                        <h2 data-testis="titreDep">Informations générales</h2>

                        {
                            isLoadingScenario ? (
                                <div className="centrer">
                                    <Loader />
                                </div>
                            ) : (

                                <>
                                    {
                                        console.log(scenario)
                                    }
                                    <div className="details">
                                        {
                                            erreurScenario ? (
                                                <p>Une erreur est survenue lors du chargement : {erreurScenario}</p>
                                            ) : (
                                                <>
                                                    <p>Departement : <NomDepartement dept={scenario.departement} cliquable="true" /></p>
                                                    <p>Annee : {scenario.annee}</p>
                                                    <p>Session : {nomSession(scenario.session)}</p>
                                                    <p>Date de création : {scenario.created_at}</p>
                                                </>
                                            )
                                        }

                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div id="historique">
                        <h2>Historique des modifications</h2>
                        {
                            isLoadingModifications ? (
                                <div className="centrer">
                                    <Loader />
                                </div>

                            ) : (
                                <>
                                    <div className="details">
                                        {
                                            erreurModifications ? (
                                                <p>Une erreur est survenue lors du changement : {erreurModifications}</p>
                                            ) : (
                                                modifications.length === 0 ? (
                                                    <p>Aucune modification n'a été apportée</p>
                                                ) : (
                                                    <div>
                                                        {
                                                            /*Pour chaque modification, on affiche la date de modification et l'utilisateur qui a fait la modification*/
                                                            modifications.map((modif) => (
                                                                <div key={modif.id}>
                                                                    <p><u>{modif.date_modif} :</u> <NomUser user={modif.user} cliquable="true" /></p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            )
                                        }
                                    </div>
                                </>
                            )
                        }
                    </div>
                </>
            }
        </div>
    );
}

export default DetailsScenario
