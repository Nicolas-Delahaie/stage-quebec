/**
 * @warning On peut appuyer plusieurs fois sur valider la modification
 * @todo Ajouter la partie pour ajouter des cours proposés aux départements
 * @todo ameliorer le responsive (pour que les tailles ne changent pas quand on clique sur modifier)
 * @todo modifier les boutons pour pas que ce soient les memes (aux memes endroits) lorsqu on modifie ou non
 */

// Librairies
import { useState, useContext, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { AppContext } from "../utils/context/context";


function CarteCours({ coursPropose, allCours, setAllCours, professeursAssignables }) {
    const { apiAccess } = useContext(AppContext);

    const [modifierInformations, setModifierInformations] = useState(false);
    const [modifierProfesseurs, setModifierProfesseurs] = useState(false);
    const [newPonderationCours, setNewPonderationCours] = useState(coursPropose.ponderation);
    const [newTailleGroupesCours, setNewTailleGroupesCours] = useState(coursPropose.taille_groupes);
    const [newNbGroupesCours, setNewNbGroupesCours] = useState(coursPropose.nb_groupes);

    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setModifierInformations(false);
                setModifierProfesseurs(false);
            }
        });
    }, [])
    useEffect(() => {
        // Remise à jour des valeurs si on annule la modification
        setNewPonderationCours(coursPropose.ponderation);
        setNewTailleGroupesCours(coursPropose.taille_groupes);
        setNewNbGroupesCours(coursPropose.nb_groupes);
    }, [modifierInformations])


    var waitingForDeleting = false;
    const validationSuppressionCours = () => {
        if (waitingForDeleting) return;

        waitingForDeleting = true;
        toast((t) => (
            <div>
                <div>Êtes-vous sûr de vouloir supprimer le cours "{coursPropose.cours.nom}" ?</div>
                <div className="zoneBoutons">
                    <button className="bouton" onClick={() => {
                        toast.dismiss(t.id);
                        waitingForDeleting = false;
                    }}>Annuler</button>
                    <button className="bouton" onClick={() => {
                        toast.dismiss(t.id);
                        supprimerCours();
                        waitingForDeleting = false;
                    }}>Confirmer</button>
                </div>
            </div>
        ))
    }
    const supprimerCours = async () => {
        // -- Envoi --
        toast.loading("Suppression...");
        const reponse = await apiAccess({
            url: `http://localhost:8000/api/cours_proposes/${coursPropose.id}}`,
            method: "delete",
        })
        toast.dismiss();

        // -- Analyse --
        if (reponse.success) {
            toast.success(<b>Cours supprimé !</b>);
            // On supprime la ressource de la page parente
            setAllCours(allCours => allCours.filter(unCours => unCours.id !== coursPropose.id));
        }
        else {
            var erreur;
            if (reponse.statusCode === 404) {
                erreur = `Cours introuvable`;
            }
            else {
                erreur = `Problème de serveur`;
            }
            toast.error(<b>{erreur}</b>);
        }
    }

    var modifying = false;
    const modifierCours = async () => {

        if(newPonderationCours < 0 || newTailleGroupesCours < 0 || newNbGroupesCours < 0) return toast.error(<b>Les valeurs ne peuvent pas être négatives</b>);

        if (modifying) return;

        // -- Envoi --
        toast.loading("Sauvegarde...");
        modifying = true;
        const reponse = await apiAccess({
            url: `http://localhost:8000/api/cours/${coursPropose.id}`,
            method: "put",
            body: {
                nb_groupes: newNbGroupesCours,
                taille_groupes: newTailleGroupesCours,
                ponderation: newPonderationCours
            }
        })
        toast.dismiss();
        modifying = false;

        // -- Analyse --
        if (reponse.success) {
            toast.success(<b>Changements sauvegardés !</b>)
            // On modifie la ressource de la page parente
            const updatedCours = [...allCours];                 //Copie de la liste des cours
            const indexCours = allCours.findIndex(c => c.id === coursPropose.id);      //index du cours a modifier dans la liste des cours
            updatedCours[indexCours].ponderation = newPonderationCours;
            updatedCours[indexCours].taille_groupes = newTailleGroupesCours;
            updatedCours[indexCours].nb_groupes = newNbGroupesCours;
            setAllCours(updatedCours);
            setModifierInformations(false);
            return true;
        }
        else {
            var erreur;
            if (reponse.statusCode === 404) {
                erreur = `Cours introuvable`;
            }
            else if (reponse.statusCode === 422) {
                erreur = `Mauvais format de données`;
            }
            else {
                erreur`Problème de serveur`;
            }
            toast.error(<b>{erreur}</b>);
        }
    }

    return (
        <div className="carteCours">
            <Toaster />
            <div className="informationsCours">
                <h3>Informations</h3>

                {
                    modifierInformations ?
                        <form onSubmit={(e) => { modifierCours(); e.preventDefault(); }}>
                            <div className="divModification">
                                <p>Pondération</p>
                                <input type="number" required value={newPonderationCours} onChange={(e) => setNewPonderationCours(e.target.value)} autoFocus />
                                <p>Taille du groupe</p>
                                <input type="number" required value={newTailleGroupesCours} onChange={(e) => setNewTailleGroupesCours(e.target.value)} />
                                <p>Nombre de groupes</p>
                                <input type="number" required value={newNbGroupesCours} onChange={(e) => setNewNbGroupesCours(e.target.value)} />
                            </div>
                            <div className="zoneBoutons">
                                <button className="bouton" type="button" onClick={() => setModifierInformations(false)}>Annuler</button>
                                <button className="bouton" type="submit">Confirmer</button>
                            </div>
                        </form>
                        :
                        <div className="informations">
                            <div>
                                <p>Pondération : {coursPropose.ponderation}</p>
                                <p>Taille du groupe : {coursPropose.taille_groupes}</p>
                                <p>Nombre de groupes : {coursPropose.nb_groupes}</p>
                            </div>
                            <button className="bouton" onClick={() => setModifierInformations(true)}>Modifier</button>
                        </div>
                }

            </div>
            <div className="nomCours">
                <h2>{coursPropose.nom}</h2>
            </div>
            <div className="professeurs">
                <h3>Professeurs</h3>
                {coursPropose.professeurs.length === 0 && <p>Aucun professeur</p>}
                {
                    <>
                        {
                            coursPropose.professeurs.map((professeur) => (
                                <p>{professeur.nom + ' ' + professeur.prenom}</p>
                            ))
                        }
                    </>
                }
            </div >
        </div>
    )
}

export default CarteCours

