// Librairies
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

// Composants
import { AppContext } from '../utils/context/context';
import Loader from '../components/Loader.js';
import CarteCours from "../components/CarteCours";


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
    const [professeursAssignables, setProfesseursAssignables] = useState(null);


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


            // ---- RECUPERATION DES COURS PROPOSES ET DE LEURS PROFESSEURS ATTRIBUABLES ---- //
            setLoadingCoursProposes(true);
            const resultatCoursProposes = await apiAccess({
                url: `http://localhost:8000/api/departements/${id}/cours_proposes_detailles`,
                method: "get",
            });
            const resultatProfs = await apiAccess({
                url: `http://localhost:8000/api/users`
            })
            setLoadingCoursProposes(false);

            // -- Analyses --
            if (resultatCoursProposes.success) {
                setCoursProposes(resultatCoursProposes.datas);
            }
            else {
                setErreurCoursProposes(resultatCoursProposes.erreur);
            }
            if (resultatProfs.success) {
                // On ne garde que les professeurs
                setProfesseursAssignables(resultatProfs.datas.filter((prof) => prof.type_utilisateur_id === 3));
            }
            else {
                console.log("Impossible de recuperer les professeurs assignables aux cours")
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
        <div className="page departement">
            {loadingDepartement &&
                <div className="loading">
                    <Loader />
                </div>}
            {erreurDepartement && <h1>Erreur : {erreurDepartement}</h1>}
            {departement &&
                <>
                    <h1>{departement.nom}</h1>
                    <div className="container">
                        {loadingCoordo &&
                            <div>
                                <Loader />
                            </div>}
                        {erreurCoordo && <h1>Erreur : {erreurCoordo}</h1>}
                        {coordo && <p>Coordonné par : {coordo.prenom} {coordo.nom}</p>}

                        <h2>Cours proposés par le département </h2>
                        {loadingCoursProposes && <Loader />}
                        {erreurCoursProposes && <h1>Erreur : {erreurCoursProposes}</h1>}
                        {coursProposes && professeursAssignables &&
                            <>
                                <div id="coursProposes">
                                    {
                                        coursProposes?.map((coursPropose) => (
                                            <CarteCours key={coursPropose.id}
                                                coursPropose={coursPropose}
                                                idDepartement={departement.id}
                                                allCours={coursProposes}
                                                setAllCours={setCoursProposes}
                                                professeursAssignables={professeursAssignables}
                                            />
                                        ))
                                    }
                                </div>
                            </>
                        }

                    </div>
                </>
            }
        </div>
    )
}

export default DetailsDepartement;