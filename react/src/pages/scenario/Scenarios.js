/**
 * @todo Gérer la redirection en cas de deconnexion (pour ne pas avoir "erreur de serveur" lorsque on nest plus connecte)
 */
// Librairies
import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../utils/context/context';

// Composants
import CarteHorizontale from '../../components/CarteHorizontale';
import Loader from '../../components/Loader.js';
import NomUser from '../../components/NomUser.js';

// Images
import Valider from '../../assets/images/Scenarios/Valider.svg'
import Calendrier from '../../assets/images/Scenarios/Calendrier.svg'

import { iconValide } from '../../assets/svg/iconValide.js'
import { iconNonValide } from '../../assets/svg/iconNonValide.js'



function Scenarios() {
    const { apiAccess, getType } = useContext(AppContext);

    const [departements, setDepartements] = useState(null);
    const [scenarios, setScenarios] = useState(null);
    const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);
    const [erreurScenarios, setErreurScenarios] = useState(null);

    // Filtres
    const [filtreDepartement, setFiltreDepartement] = useState(null);   //Valeur par defaut : ""
    const [filtreEnAttente, setFiltreEnAttente] = useState(false);      //Valeur par defaut : false
    const [filtreAnnee, setFiltreAnnee] = useState("");                 //Valeur par defaut : ""
    const [filtreSession, setFiltreSession] = useState("");             //Valeur par defaut : ""

    const [type, setType] = useState(null);

    let urlImage = Calendrier;
    let icon = iconValide;

    // ---- CHARGEMENT DES DONNEES ----
    /**
     * @brief Récupère tous les departements pour les afficher dans les filtres
     */
    const getDepartements = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/departements`,
        });
        if (rep.success) {
            setDepartements(rep.datas);
        }
        else {
            console.log(rep.erreur);
        }
    }
    /**
     * @brief Récupère tous les scenarios
     */
    const getAllScenarios = async () => {
        setIsLoadingScenarios(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios_detailles`,
        });
        setIsLoadingScenarios(false);

        if (rep.success) {
            setScenarios(rep.datas);
        }
        else {
            setErreurScenarios(rep.erreur);
        }
    }
    /**
     * @brief Récupère les scenarios du departement de l'utilisateur
     */
    const getMesScenarios = async () => {
        setIsLoadingScenarios(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/user/departement/scenarios_detailles`,
        });
        setIsLoadingScenarios(false);

        if (rep.success) {
            setScenarios(rep.datas);
        }
        else {
            if (rep.statusCode === 404) {
                setErreurScenarios("Vous n'avez pas de departement");
            }
            else {
                setErreurScenarios(rep.erreur);
            }
        }
    }


    useEffect(() => {
        const type = getType();
        setType(type);

        // Chargement des données en fonction de son type
        if (type === "administrateur" || type === "responsable") {
            getAllScenarios();
            getDepartements();
        }
        else {
            getMesScenarios();
        }
    }, []);

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


    // ---- COMPOSANTS JSX ---- 
    /**
     * @brief Renvoie le JSX des scenarios 
     * @param {Array} scenarios
     */
    const renderScenarios = (scenarios) => {
        var scenariosAAfficher = scenarios;

        // Filtrage des scenarios en fonction des criteres
        if (filtreDepartement) {
            // On veut afficher uniquement le departement selectionne
            scenariosAAfficher = scenariosAAfficher.filter(scenario => scenario.departement.id == filtreDepartement);
        }
        if (filtreAnnee) {
            // On veut afficher uniquement les scenarios de l'annee selectionnee
            scenariosAAfficher = scenariosAAfficher.filter(scenario => scenario.annee == filtreAnnee);
        }
        if (filtreSession) {
            // On veut afficher uniquement les scenarios de la session selectionnee
            scenariosAAfficher = scenariosAAfficher.filter(scenario => scenario.session == filtreSession);
        }
        if (filtreEnAttente) {
            // On ne veut afficher que les departements qui n ont pas ete validés
            scenariosAAfficher = scenariosAAfficher.filter(scenario => !scenario.aEteValide);
        }

        // Affichage des scenarios
        return <div className="container">
            {scenariosAAfficher.length === 0 && <h3>Aucun scénario n'a été trouvé</h3>}
            {scenariosAAfficher.map(scenario =>
                <CarteHorizontale
                    key={scenario.id}
                    urlImage={scenario.aEteValide ? Valider : Calendrier}
                    titre={"Département " + scenario.departement.nom}
                    lien={`/scenarios/${scenario.id}`}>
                    <span>
                        Session : {nomSession(scenario.session)} {scenario.annee}<br />
                        Dernière modification : {scenario.updated_at}<br />
                        Date de création : {scenario.created_at}<br />
                        {scenario.departement.coordonnateur && <>
                            Coordonnateur : <NomUser user={scenario.departement.coordonnateur} /><br />
                        </>}
                    </span>
                    <div className="zoneValidation">
                        <h3>Validé par le responsable : </h3>
                        <img src={scenario.aEteValide ? iconValide : iconNonValide} className="icone" />
                    </div>
                </CarteHorizontale>
            )}
        </div>
    }
    /**
     * @brief Renvoie le JSX des filtres
     */
    const renderFiltres = () => {
        return <div className="filtres">
            <span>Departement</span>
            <select name="departements" onChange={e => setFiltreDepartement(e.target.value)}>
                <option value={""}>Tous</option>
                {departements &&
                    departements.map(departement =>
                        <option key={departement.id} value={departement.id}>{departement.nom}</option>
                    )
                }
            </select>

            <span>Année</span>
            <input type="number" name="annee" value={filtreAnnee} onChange={e => setFiltreAnnee(e.target.value)} placeholder="Toutes" />

            <span>Session</span>
            <select name="departements" onChange={e => setFiltreSession(e.target.value)}>
                <option value={""}>Toutes</option>
                <option value={1}>{nomSession(1)}</option>
                <option value={2}>{nomSession(2)}</option>
                <option value={3}>{nomSession(3)}</option>
            </select>

            <span>En attente</span>
            <input type="checkbox" onChange={e => setFiltreEnAttente(e.target.checked)} />
        </div>
    }

    return <div id="scenarios" className={`page ${isLoadingScenarios ? "centrer" : ""}`}>
        {isLoadingScenarios && <Loader />}
        {erreurScenarios && <h2>Erreur : {erreurScenarios}</h2>}
        {scenarios &&
            <>
                {(type === "administrateur" || type === "responsable") &&
                    <>
                        <h1>Tous les scénarios</h1>
                        <h2>Filtres</h2>
                        {renderFiltres()}
                    </>
                }
                {type === "professeur" &&
                    <h1>Scenarios de mon departement</h1>
                }
                {renderScenarios(scenarios)}
            </>
        }
    </div>
}

export default Scenarios