// Composants
import TableauLiberations from "../components/layout/TableauLiberations";
import { Loader } from "../utils/styles";

// Librairies
import { useEffect, useContext, useState } from "react";
import { AppContext } from '../utils/context/context';

function Liberations() {
    const { apiAccess } = useContext(AppContext);

    const [departements, setDepartements] = useState(null);
    const [enseignants, setEnseignants] = useState([{ name: "Selectionnez un departement" }]);
    const [responsables, setResponsables] = useState(null);
    const [liberations, setLiberations] = useState(null);
    const [nomSelectionnee, setNomSelectionnee] = useState(null);
    const [anneesAvant, setAnneesAvant] = useState(1);
    const [anneesApres, setAnneesApres] = useState(1);

    const [loadingLiberations, setLoadingLiberations] = useState(null);

    const [erreurDept, setErreurDept] = useState(null);
    const [erreurResponsables, setErreurResponsables] = useState(null);

    /**
     * @brief Initialise les departements et leurs enseignants (dans departements)
     */
    const initDepts = async () => {
        // Recuperation des departements
        const rep = await apiAccess({
            url: "http://localhost:8000/api/departements/enseignants",
        });

        if (rep.success) {
            setDepartements(rep.datas);
            setEnseignants(rep.datas[0].enseignants);
        }
        else {
            setErreurDept("Impossible de charger les professeurs : " + rep.erreur);
        }
    }
    /**
     * @brief Initialise les responsables (dans responsables)
     */
    const initResponsables = async () => {
        // Recuperation des responsables
        const rep = await apiAccess({
            url: "http://localhost:8000/api/users/responsables",
        });

        if (rep.success) {
            setResponsables(rep.datas);
        }
        else {
            setErreurResponsables("Impossible de charger les responsables : " + rep.erreur);
        }
    }

    useEffect(() => {
        initDepts();
        initResponsables();
    }, []);

    /**
     * @brief Met a jour les enseignants en fonction du departement selectionne 
     */
    const updateEnseignants = (e) => {
        const idDept = e.target.value;
        // Mise a jour des enseignants lies au departement
        setEnseignants(departements[idDept].enseignants);
    }
    /**
     * @brief Charge les liberations de l employer selectionne
     * @param {string} type "responsable" ou "enseignant" (pour savoir si on doit aller chercher l employer dans reponsables ou enseignants)
     */
    const getLiberations = async (e, type) => {
        const idEmployer = e.target.value;
        var employer;
        if (type === "responsable") {
            employer = responsables[idEmployer];
        }
        if (type === "enseignant") {
            employer = enseignants[idEmployer];
        }

        // Chargement des liberations de l enseignant
        setLiberations(null);
        setLoadingLiberations(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/users/${employer.id}/liberations`,
        })
        setLoadingLiberations(false);

        if (rep.success) {
            setNomSelectionnee(employer.name);
            setLiberations(rep.datas);
        }
        else {
            console.log(rep.erreur);
        }
    }
    /**
     * Ajoute la la valeur a l annee d avant ou apres si elle est dans l intervalle
     * @param {string} avantOuApres 
     * @param {number} valeur 
     */
    const modifAnnee = (avantOuApres, valeur) => {
        // Analyse du nombre saisi
        if (avantOuApres === "avant") {
            const newAnneeAvant = anneesAvant + valeur;
            if (newAnneeAvant >= 0 && newAnneeAvant <= 5) {
                setAnneesAvant(newAnneeAvant);
            }
        }
        else if (avantOuApres === "apres") {
            const newAnneeApres = anneesApres + valeur;
            if (newAnneeApres >= 0 && newAnneeApres <= 3) {
                setAnneesApres(newAnneeApres);
            }
        }
    }
    return (
        <div className="Liberations">
            <h1>Liberations</h1>
            <div className="gridSelection">
                <div>
                    <h2>Professeur</h2>
                    {erreurDept && <p>{erreurDept}</p>}
                    {departements && enseignants &&
                        <div>
                            <span>Departement</span>
                            <select onChange={updateEnseignants}>
                                {
                                    departements.map((departement, idDept) => {
                                        return <option key={departement.id} value={idDept}>{departement.nom}</option>
                                    })
                                }
                            </select>

                            <span>Nom</span>
                            <select onChange={(e) => getLiberations(e, "enseignant")}>
                                {
                                    enseignants.map((enseignant, idEnseignant) => {
                                        return <option key={enseignant.id} value={idEnseignant}>{enseignant.name}</option>
                                    })
                                }
                            </select>

                        </div>
                    }
                </div>
                <div>
                    <h2>Responsable</h2>
                    {erreurResponsables && <p>{erreurResponsables}</p>}
                    {responsables &&
                        <div>
                            <span>Nom</span>
                            {responsables &&
                                <select onChange={(e) => getLiberations(e, "responsable")}>
                                    {
                                        responsables.map((responsable, idResponsable) => {
                                            return <option key={responsable.id} value={idResponsable}>{responsable.name}</option>
                                        })
                                    }
                                </select>
                            }
                        </div>
                    }
                </div>
            </div>
            {nomSelectionnee && <h2>Libérations de {nomSelectionnee}</h2>}
            {loadingLiberations && <Loader />}
            {liberations &&
                <>
                    <span>Annees avant </span>
                    <button onClick={() => modifAnnee("avant", -1)} className="bouton">-</button>
                    <span> {anneesAvant} </span>
                    <button onClick={() => modifAnnee("avant", 1)} className="bouton">+</button>
                    {/* <input type="number" value={anneesAvant} onChange={(e) => modifAnnee("avant", e.target.value)} /> */}

                    <br />
                    <span>Annees apres </span>
                    <button onClick={() => modifAnnee("apres", -1)} className="bouton">-</button>
                    <span> {anneesApres} </span>
                    <button onClick={() => modifAnnee("apres", 1)} className="bouton">+</button>
                    {/* <input type="number" value={anneesApres} onChange={(e) => modifAnnee("apres", e.target.value)} /> */}


                    <br />
                    <div className="tableauLiberations">
                        <TableauLiberations liberations={liberations} anneesAvant={anneesAvant} anneesApres={anneesApres} />
                    </div>
                </>
            }
        </div>
    );
}
export default Liberations;