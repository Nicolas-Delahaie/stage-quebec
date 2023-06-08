// Librairies
import { useState, useEffect, useContext, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { AppContext } from '../utils/context/context';

// Composants
import Loader from '../components/Loader';
import TableauLiberations from "../components/TableauLiberations";


/* ----------------------------------- DOM ---------------------------------- */

function Profil() {
    const { apiAccess } = useContext(AppContext);

    const newContraintes = useRef(null);
    const [isLoading, setIsLoading] = useState(null);
    const [user, setUser] = useState(null);
    const [erreur, setErreur] = useState(null);
    const [isSavingContraintes, setIsSavingContraintes] = useState(null);

    const getInfos = async () => {
        // -- Recuperation des infos du professeur --
        setIsLoading(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/user/detaille`,
            method: "get",
        });
        setIsLoading(false);
        console.log(rep);

        // -- Traitement du resultat --
        if (rep.success) {
            setUser(rep.datas);
        }
        else {
            setErreur(rep.erreur);
        }
    }
    useEffect(() => {
        getInfos();
    }, []);

    const enregistrementContraintes = async () => {
        // -- Enregistrement des contraintes --
        setIsSavingContraintes(true);
        const rep = await apiAccess({
            url: `http://localhost:8000/api/user/contraintes`,
            method: "put",
            body: {
                contraintes: newContraintes.current.value
            }
        });
        setIsSavingContraintes(false);

        // -- Traitement du resultat --
        if (rep.success) {
            user.contraintes = newContraintes.current.value;
            toast.success("Contraintes bien modifiées !");
        }
        else {
            toast.error(rep.erreur);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            // Si on saute a la ligne sans faire SHIFT
            e.preventDefault();         // On empeche le saut a la ligne
            enregistrementContraintes();
        }
    };


    return (
        <div id="profil" className="page">
            <Toaster />
            {erreur && <h1>{erreur}</h1>}
            {isLoading &&
            <div className="loading">
            <Loader />
            </div>}
            {isLoading===false &&
                <>
                    <h1>Mon profil</h1>
                    <div className="infos">
                        <div>
                            <h2>Informations globales</h2>
                            <p>{user.prenom} {user.nom}</p>
                            <p>{user.email}</p>
                            <p>{user.type.nom}</p>
                            <h2>Contraintes</h2>
                            <form onSubmit={(e) => { enregistrementContraintes(); e.preventDefault(); }} className="formContraintes">
                                <textarea className="contraintes"
                                    defaultValue={user.contraintes}
                                    ref={newContraintes}
                                    placeholder={user.contraintes === "" ? "Saisissez vos contraintes" : undefined}
                                    onKeyDown={handleKeyPress}
                                    rows="6"
                                />
                                {isSavingContraintes ?
                                    <Loader />
                                    :
                                    <input className="bouton"
                                        type="submit"
                                        value="Modifier" />
                                }
                            </form>
                        </div>
                        <div>
                            <h2>Libérations</h2>
                            {user.liberations.length === 0 ?
                                <p>Vous n'avez aucune libération récente</p>
                                :
                                <TableauLiberations liberations={user.liberations} />
                            }
                            <button className="bouton">Voir toutes mes libérations</button>
                        </div>
                    </div>
                </>
            }
        </ div>
    );
}

export default Profil;