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
    const { apiAccess } = useContext(AppContext);

    const [erreurContexte, setErreurContexte] = useState(null);
    const [isLoadingContexte, setIsLoadingContexte] = useState(false);
    const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);
    const [scenariosDetailles, setScenariosDetailles] = useState(null);

    const getScenarios = async () => {
        // -- Recuperation des scenarios --
        setIsLoadingContexte(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/user/scenarios_crees`,
            method: "get",
        });
        setIsLoadingContexte(false);

        // -- Analyse --
        if (rep.success) {
            setScenariosDetailles([]);
            console.log(rep);

            var scenariosNonDetailles = rep.datas;

            // -- Trie des scenarios (plus recents en premier et valides en premiers) --
            scenariosNonDetailles.sort((a, b) => {
                return b.annee - a.annee;
            });
            scenariosNonDetailles.sort((a, b) => {
                return a.aEteValide - b.aEteValide;
            });

            // -- Recuperation des scenarios detailles un a un--
            setIsLoadingScenarios(true);
            for (let i = 0; i < rep.datas.length; i++) {
                // -- Recuperation des scenarios detailles un a un--
                const idScenario = scenariosNonDetailles[i].id;

                const rep2 = await apiAccess({
                    url: `http://localhost:8000/api/scenarios/${idScenario}/detaille`,
                    method: "get",
                });

                // -- Analyse --
                if (rep2.success) {
                    // On ajoute le scenario aux autres scenarios
                    setScenariosDetailles(scenariosDetailles => [...scenariosDetailles, rep2.datas]);
                }
                else {
                    console.error("Erreur du chargement d'un des scenarios");
                }
            }
            setIsLoadingScenarios(false);
        }
        else {
            setErreurContexte(rep.erreur);
        }
    };

    useEffect(() => {
        getScenarios();
    }, [])


    return <div id="scenarios">
        <h1>Vos Scénarios</h1>
        {erreurContexte && <h2>{erreurContexte}</h2>}
        {isLoadingContexte ?
            <Loader />
            :
            <div className="container">
                {scenariosDetailles && scenariosDetailles.map(scenario => (
                    <CarteHorizontale
                        key={scenario.id}
                        urlImage={scenario.aEteValide ? Valider : Calendrier}
                        titre={"Département " + scenario.departement.nom}
                        texteBouton="Voir le scénario"
                        lien={`/scenarios/${scenario.id}`}>
                        <p>Propriétaire : {scenario.proprietaire.nom}<br />
                            Année :{scenario.annee}<br />
                            Dernière modification : {scenario.updated_at}<br />
                            Date de création : {scenario.created_at}<br />
                        </p>
                        <div className="zoneValidation">
                            <h3>Validé par le responsable : </h3>
                            <img src={scenario.aEteValide ? iconValide : iconNonValide} className="icone" />
                        </div>
                    </CarteHorizontale>
                ))}
                {isLoadingScenarios && <Loader />}
                {scenariosDetailles && !isLoadingScenarios && scenariosDetailles.length === 0 && <h2>Vous n'avez aucun scénario</h2>}
            </div>
        }
    </div>
}

export default Scenarios