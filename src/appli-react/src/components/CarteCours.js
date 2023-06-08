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
    const [newTailleGroupesCours, setNewTailleGroupesCours] = useState(coursPropose.tailleGroupes);
    const [newNbGroupesCours, setNewNbGroupesCours] = useState(coursPropose.nbGroupes);

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
        setNewTailleGroupesCours(coursPropose.tailleGroupes);
        setNewNbGroupesCours(coursPropose.nbGroupes);
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
        if (modifying) return;

        // -- Envoi --
        toast.loading("Sauvegarde...");
        modifying = true;
        const reponse = await apiAccess({
            url: `http://localhost:8000/api/cours_proposes/${coursPropose.id}`,
            method: "put",
            body: {
                nbGroupes: newNbGroupesCours,
                tailleGroupes: newTailleGroupesCours,
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
            updatedCours[indexCours].tailleGroupes = newTailleGroupesCours;
            updatedCours[indexCours].nbGroupes = newNbGroupesCours;
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
    const validationSuppressionProf = (prof) => {
        toast((t) => (
            <div>
                <div>Retirer {prof.prenom} {prof.nom} de {coursPropose.cours.nom}?</div>
                <div className="zoneBoutons">
                    <button className="bouton" onClick={() => toast.dismiss(t.id)}>Annuler</button>
                    <button className="bouton" onClick={() => { toast.dismiss(t.id); retirerProf(prof.id); }}>Confirmer</button>
                </div>
            </div>
        ))
    }
    const retirerProf = async (idProf) => {
        // -- Envoi --
        toast.loading("Retrait du professeur...");
        const reponse = await apiAccess({
            url: `http://localhost:8000/api/enseigner`,
            method: "delete",
            body: {
                professeur_id: idProf,
                cours_propose_id: coursPropose.id
            }
        })
        toast.dismiss();

        // -- Analyse --
        if (reponse.success) {
            toast.success(<b>Professeur retiré !</b>);
            // On modifie la ressource de la page parente
            const updatedCours = [...allCours];                 //Copie de la liste des cours
            const indexCours = allCours.findIndex(c => c.id === coursPropose.id);      //index du cours a modifier dans la liste des cours
            updatedCours[indexCours].enseignants = updatedCours[indexCours].enseignants.filter((enseignant) => enseignant.id !== idProf);
            setAllCours(updatedCours);
        }
        else {
            if (reponse.statusCode === 404) {
                toast.error(<b>Professeur ou cours introuvable</b>)
            }
            else {
                toast.error(<b>{reponse.erreur}</b>)
            }
            ;
        }
    }
    var attributing = false;
    const attribuerProfesseurs = async (e) => {
        e.preventDefault();

        if (attributing) return;

        // -- Envoi --
        attributing = true;
        toast.loading("Attribution du professeur...")
        const idProf = e.target.selectProf.value;
        const rep = await apiAccess({
            url: `http://localhost:8000/api/enseigner`,
            method: "post",
            body: {
                professeur_id: idProf,
                cours_propose_id: coursPropose.id
            },
        })
        attributing = false;
        toast.dismiss();

        // -- Analyse --
        if (rep.success) {
            toast.success(<b>Professeur attribué !</b>)
            // On modifie la ressource de la page parente
            const updatedCours = [...allCours];                 //Copie de la liste des cours
            const indexCours = allCours.findIndex(c => c.id === coursPropose.id);      //index du cours a modifier dans la liste des cours
            const prof = professeursAssignables.find((prof) => prof.id == idProf)
            updatedCours[indexCours].enseignants.push({ id: idProf, nom: prof.nom, prenom: prof.prenom });
            setAllCours(updatedCours);
        }
        else {
            var erreur;
            if (rep.statusCode === 404) {
                erreur = `Professeur ou cours introuvable`;
            }
            if (rep.statusCode === 409) {
                erreur = `Professeur déjà assigné à ce cours`;
            }
            else {
                erreur = `Problème de serveur`;
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
                                <p>Taille du groupe : {coursPropose.tailleGroupes}</p>
                                <p>Nombre de groupes : {coursPropose.nbGroupes}</p>
                            </div>
                            <button className="bouton" onClick={() => setModifierInformations(true)}>Modifier</button>
                        </div>
                }

            </div>
            <div className="nomCours">
                <h2>{coursPropose.cours.nom}</h2>
            </div>
            <div className="professeurs">
                <h3>Professeurs</h3>
                {coursPropose.enseignants.length === 0 && <p>Aucun professeur</p>}
                {
                    modifierProfesseurs ?
                        <>
                            {
                                coursPropose.enseignants.map((professeur) =>
                                    <>
                                        <p onClick={() => validationSuppressionProf(professeur.id, professeur.name)}>{professeur.name}</p>
                                        {/* <button type="button" >Retirer</button> */}
                                    </>)
                            }
                            {professeursAssignables &&

                                <form onSubmit={attribuerProfesseurs}>
                                    <select name="selectProf">
                                        {professeursAssignables && professeursAssignables.map((prof) => (
                                            <option key={prof.id} value={prof.id}>{prof.name}</option>
                                        ))}
                                    </select>
                                    <div className="zoneBoutons">
                                        <button className="bouton" type="submit">Ajouter</button>
                                        <button className="bouton" type="button" onClick={() => setModifierProfesseurs(false)}>Annuler</button>
                                    </div>
                                </form>
                            }
                        </>
                        :
                        <>
                            {
                                coursPropose.enseignants.map((professeur) => (
                                    <p>{professeur.name}</p>
                                ))
                            }
                            <div className="zoneBoutons">
                                <button className="bouton" onClick={() => setModifierProfesseurs(true)}>Ajouter un professeur</button>
                                <button className="bouton" onClick={() => validationSuppressionCours()}>Supprimer</button>
                            </div>
                        </>
                }
            </div >
        </div>
    )
}

export default CarteCours

