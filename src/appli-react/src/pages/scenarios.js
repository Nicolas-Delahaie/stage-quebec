/**
 * @todo Gérer la redirection en cas de deconnexion (pour ne pas avoir "erreur de serveur" lorsque on nest plus connecte)
 */
// Librairies
import { useState, useEffect, useContext } from 'react'
import { AppContext } from '../utils/context/context';

// Composants
import CarteHorizontale from '../components/CarteHorizontale';
import Loader from '../components/Loader.js';

// Images
import Valider from '../assets/images/Scenarios/Valider.svg'
import Calendrier from '../assets/images/Scenarios/Calendrier.svg'

import { iconValide } from '../assets/svg/iconValide.js'
import { iconNonValide } from '../assets/svg/iconNonValide.js'



function Scenarios() {
    const { apiAccess, getType, getEstCoordo } = useContext(AppContext);

    // const [erreurContexte, setErreurContexte] = useState(null);
    // const [isLoadingContexte, setIsLoadingContexte] = useState(false);
    // const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);
    // const [scenariosDetailles, setScenariosDetailles] = useState(null);

    const [estCoordo, setEstCoordo] = useState(false);
    const [type, setType] = useState(false);

    const [allScenarios, setAllScenarios] = useState(null);
    const [scenariosEnAttente, setScenariosEnAttente] = useState(null);
    const [scenariosModifies, setScenariosModifies] = useState(null);
    const [mesScenarios, setMesScenarios] = useState(null);

    const [currentPage, setCurrentPage] = useState(null);

    let urlImage = Calendrier;
    let icon = iconValide;


    // const getScenarios = async () => {
    //     // -- Recuperation des scenarios --
    //     setIsLoadingContexte(true);
    //     const rep = await apiAccess({
    //         url: `http://localhost:8000/api/user/scenarios_crees`,
    //         method: "get",
    //     });
    //     setIsLoadingContexte(false);

    //     // -- Analyse --
    //     if (rep.success) {
    //         setScenariosDetailles([]);
    //         console.log(rep);

    //         var scenariosNonDetailles = rep.datas;

    //         // -- Trie des scenarios (plus recents en premier et valides en premiers) --
    //         scenariosNonDetailles.sort((a, b) => {
    //             return b.annee - a.annee;
    //         });
    //         scenariosNonDetailles.sort((a, b) => {
    //             return a.aEteValide - b.aEteValide;
    //         });

    //         // -- Recuperation des scenarios detailles un a un--
    //         setIsLoadingScenarios(true);
    //         for (let i = 0; i < rep.datas.length; i++) {
    //             // -- Recuperation des scenarios detailles un a un--
    //             const idScenario = scenariosNonDetailles[i].id;

    //             const rep2 = await apiAccess({
    //                 url: `http://localhost:8000/api/scenarios/${idScenario}/detaille`,
    //                 method: "get",
    //             });

    //             // -- Analyse --
    //             if (rep2.success) {
    //                 // On ajoute le scenario aux autres scenarios
    //                 setScenariosDetailles(scenariosDetailles => [...scenariosDetailles, rep2.datas]);
    //             }
    //             else {
    //                 console.error("Erreur du chargement d'un des scenarios");
    //             }
    //         }
    //         setIsLoadingScenarios(false);
    //     }
    //     else {
    //         setErreurContexte(rep.erreur);
    //     }
    // };


    const getAllScenarios = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios_detailles`,
        });

        if (rep.success) {
            setAllScenarios(rep.datas);
        }
    }
    const getScenariosEnAttente = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/scenarios_en_attente`,
        });

        if (rep.success) {
            setScenariosEnAttente(rep.datas);
        }
    }
    const getScenariosModifies = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/user/scenarios_modifies`,
        });

        if (rep.success) {
            setScenariosModifies(rep.datas);
        }
    }
    const getMesScenarios = async () => {
        const rep = await apiAccess({
            url: `http://localhost:8000/api/user/scenarios`,
        });

        if (rep.success) {
            setMesScenarios(rep.datas);
        }
    }

    useEffect(() => {
        switch (getType()) {
            case "administrateur":
                /* ---- ADMINISTRATEUR ---- */
                // Definition du type et de la page a afficher
                setType("administrateur");
                setCurrentPage("allScenarios");

                // Chargement des donnees
                getAllScenarios();
                break;

            case "responsable":
                /* ---- RESPONSABLE ---- */
                // Definition du type et de la page a afficher
                setType("responsable");
                setCurrentPage("allScenarios");

                // Chargement des donnees
                getAllScenarios();
                getScenariosEnAttente();
                getScenariosModifies();
                break;

            case "professeur":
                if (getEstCoordo()) {
                    /* ---- PROFESSEUR (COORDO) ---- */
                    // Definition du type et de la page a afficher
                    setType("professeur");
                    setEstCoordo(true);
                    setCurrentPage("scenariosModifies");

                    // Chargement des donnees
                    getMesScenarios();
                }
                else {
                    /* ---- PROFESSEUR (NON COORDO) ---- */
                    // Definition du type et de la page a afficher
                    setType("professeur");
                    setCurrentPage("mesScenarios");

                    // Chargement des donnees
                    getMesScenarios();
                }
                break;

            default:
                break;
        }
    }, [])

    const renderScenario = (scenario) => {
        return <CarteHorizontale
            key={scenario.id}
            urlImage={scenario.aEteValide ? Valider : Calendrier}
            titre={"Département " + scenario.departement.nom}
            lien={`/scenarios/${scenario.id}`}>
            <p>Coordonnateur : {scenario.proprietaire.prenom} {scenario.proprietaire.nom}<br />
                Année :{scenario.annee}<br />
                Dernière modification : {scenario.updated_at}<br />
                Date de création : {scenario.created_at}<br />
            </p>
            <div className="zoneValidation">
                <h3>Validé par le responsable : </h3>
                <img src={scenario.aEteValide ? iconValide : iconNonValide} className="icone" />
            </div>
        </CarteHorizontale>
    }

    /**
     * @brief Renvoie le jsx de la page en fonction de la page a afficher 
     * @param {number} page a afficher : 1 = tous les scenarios, 2 = scenarios en attente, 3 = scenarios modifies, 4 = mes scenarios 
     * @returns jsx de la page
     */
    const renderPage = (page) => {
        switch (page) {
            case "allScenarios":
                return <>
                    <h1>Tous les scenarios</h1>
                    <div className="container">
                        {allScenarios && allScenarios.length === 0 && <h2>Vous n'avez aucun scénario</h2>}
                        {/* {isLoadingScenarios && <Loader />} */}
                        {allScenarios && allScenarios.map(scenario => (renderScenario(scenario)))}
                    </div>
                </>

            case "scenariosEnAttente":
                return <>
                    <h1>Scenarios en attente</h1>
                    <div className="container">
                        {scenariosEnAttente && scenariosEnAttente.length === 0 && <h2>Vous n'avez aucun scénario en attente</h2>}
                        {/* {isLoadingScenarios && <Loader />} */}
                        {scenariosEnAttente && scenariosEnAttente.map(scenario => (renderScenario(scenario)))}
                    </div>
                </>

            case "scenariosModifies":
                return <>
                    <h1>Scenarios modifiés</h1>
                    <div className="container">
                        {scenariosModifies && scenariosModifies.length === 0 && <h2>Vous n'avez modifié aucun scénario</h2>}
                        {/* {isLoadingScenarios && <Loader />} */}
                        {scenariosModifies && scenariosModifies.map(scenario => (renderScenario(scenario)))}
                    </div>
                </>

            case "mesScenarios":
                return <>
                    <h1>Mes Scenarios</h1>
                    <div className="container">
                        {mesScenarios && mesScenarios.length === 0 && <h2>Aucun scénario ne vous affecte</h2>}
                        {/* {isLoadingScenarios && <Loader />} */}
                        {mesScenarios && mesScenarios.map(scenario => (renderScenario(scenario)))}
                    </div>
                </>

            default:
                // Rien a afficher
                break;
        }
    }


    return <div id="scenarios">
        {type === "administrateur" &&
            <nav>
                <button onClick={() => setCurrentPage("allScenarios")}>Tous les scenarios</button>
            </nav>
        }
        {type === "responsable" &&
            <nav>
                <button onClick={() => setCurrentPage("scenariosEnAttente")}>Scenarios en attente</button>
                <button onClick={() => setCurrentPage("scenariosModifies")}>Scenarios modifiés</button>
                <button onClick={() => setCurrentPage("allScenarios")}>Tous les scenarios</button>
            </nav>
        }
        {type === "professeur" && estCoordo &&
            <nav>
                <button onClick={() => setCurrentPage("scenariosModifies")}>Scenarios modifiés</button>
                <button onClick={() => setCurrentPage("mesScenarios")}>Mes scénarios</button>
            </nav>
        }
        {type === "professeur" && !estCoordo &&
            <nav>
                <button onClick={() => setCurrentPage("mesScenarios")}>Mes scénarios</button>
            </nav>
        }

        {renderPage(currentPage)}

    </div>
}

export default Scenarios