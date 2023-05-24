/**
 * @warning On peut appuyer plusieurs fois sur valider la modification
 * @todo Ajouter la partie pour ajouter des cours proposés aux départements
 * @todo ameliorer le responsive (pour que les tailles ne changent pas quand on clique sur modifier)
 * @todo modifier les boutons pour pas que ce soient les memes (aux memes endroits) lorsqu on modifie ou non
 */

import { useContext, useEffect } from "react";
import { AppContext } from "../../utils/context/context";


import styled from "styled-components"
import { DivBouton, DivCarteReduite } from "./CarteProfesseur"
import { colors, fonts } from "../../utils/styles"
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";

const H1Cours = styled.h1`
    width: fit-content;
    margin: 0.25rem 0;
    font-family: ${fonts.sousTitre};
    font-size: 1.5rem;
    color: ${colors.bleuFonce};
    margin-bottom: 1rem;

    &:after{
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background-color: ${colors.jauneFonce};
    }
`;

const DivH2 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

`;

const Oskfbbz = styled.div`
    display: grid;
    grid-template-columns: 1fr 40px;
`;

const H2Cours = styled.h2`
    margin: 0.25rem 0;
    font-family: ${fonts.texte};
    font-size: 1.25rem;
    color: ${colors.bleuMoyen};
    font-weight: normal;
`;

const DivBoutonToast = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Input = styled.input`
    height: 1.5rem;
    cursor: text;
    border: none;
    box-shadow: 0px 5px 10px 0px ${colors.gris};
    border-radius: 0.5rem;
    font-family: ${fonts.texte};
    padding: 0rem 0.25rem;
    margin: 0.25rem 0;
    color: ${colors.bleuMoyen};
    &:focus{
        outline: none;
    }

    ::placeholder{
        color: ${colors.gris};
    }

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const Bouton = styled.button`
    background-color: ${colors.jauneFonce};
    color: ${colors.bleuFonce};
    text-decoration: none;
    font-family: ${fonts.titre};
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    margin: 1rem;
`

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


    const validationSuppressionCours = () => {
        toast((t) => (
            <div>
                <div>Êtes-vous sûr de vouloir supprimer le cours "{coursPropose.cours.nom}" ?</div>
                <DivBoutonToast>
                    <Bouton onClick={() => toast.dismiss(t.id)}>Annuler</Bouton>
                    <Bouton onClick={() => { toast.dismiss(t.id); supprimerCours(); }}>Confirmer</Bouton>
                </DivBoutonToast>
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
    const modifierCours = async () => {
        // -- Envoi --
        toast.loading("Sauvegarde...");
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
    const validationSuppressionProf = (idProf, nomProf) => {
        toast((t) => (
            <div>
                <div>Retirer {nomProf} de {coursPropose.cours.nom}?</div>
                <DivBoutonToast>
                    <Bouton onClick={() => toast.dismiss(t.id)}>Annuler</Bouton>
                    <Bouton onClick={() => { toast.dismiss(t.id); retirerProf(idProf); }}>Confirmer</Bouton>
                </DivBoutonToast>
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

        console.log(reponse);

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
            var erreur;
            if (reponse.statusCode === 404) {
                erreur = `Professeur ou cours introuvable`;
            }
            else {
                erreur = `Problème de serveur`;
            }
            toast.error(<b>{erreur}</b>);
        }
    }
    const attribuerProfesseurs = async (e) => {
        e.preventDefault();
        const idProf = e.target.selectProf.value;

        // -- Envoi --
        toast.loading("Attribution du professeur...")
        const rep = await apiAccess({
            url: `http://localhost:8000/api/enseigner`,
            method: "post",
            body: {
                professeur_id: idProf,
                cours_propose_id: coursPropose.id
            },
        })
        toast.dismiss();

        // -- Analyse --
        if (rep.success) {
            toast.success(<b>Professeur attribué !</b>)
            // On modifie la ressource de la page parente
            const updatedCours = [...allCours];                 //Copie de la liste des cours
            const indexCours = allCours.findIndex(c => c.id === coursPropose.id);      //index du cours a modifier dans la liste des cours
            const nomProf = professeursAssignables.find((prof) => prof.id == idProf).name;
            updatedCours[indexCours].enseignants.push({ id: idProf, name: nomProf });
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
        <DivCarteReduite>
            <Toaster />
            <H1Cours>{coursPropose.cours.nom}</H1Cours>
            <h2>Informations</h2>
            {
                modifierInformations ?
                    <form onSubmit={(e) => { modifierCours(); e.preventDefault(); }}>
                        <Oskfbbz>
                            <H2Cours>Pondération</H2Cours>
                            <Input type="number" required value={newPonderationCours} onChange={(e) => setNewPonderationCours(e.target.value)} autoFocus />
                            <H2Cours>Taille du groupe</H2Cours>
                            <Input type="number" required value={newTailleGroupesCours} onChange={(e) => setNewTailleGroupesCours(e.target.value)} />
                            <H2Cours>Nombre de groupes</H2Cours>
                            <Input type="number" required value={newNbGroupesCours} onChange={(e) => setNewNbGroupesCours(e.target.value)} />
                        </Oskfbbz>
                        <DivBouton>
                            <Bouton type="button" onClick={() => setModifierInformations(false)}>Annuler</Bouton>
                            <Bouton type="submit">Confirmer</Bouton>
                        </DivBouton>
                    </form>
                    :
                    <DivH2>
                        <H2Cours>Pondération : {coursPropose.ponderation}</H2Cours>
                        <H2Cours>Taille du groupe : {coursPropose.tailleGroupes}</H2Cours>
                        <H2Cours>Nombre de groupes : {coursPropose.nbGroupes}</H2Cours>
                        <Bouton onClick={() => setModifierInformations(true)}>Modifier</Bouton>
                    </DivH2>
            }
            <h2>Professeurs</h2>
            <DivH2>
                {coursPropose.enseignants.length === 0 && <H2Cours>Aucun professeur</H2Cours>}
                {
                    modifierProfesseurs ?
                        <>
                            {
                                coursPropose.enseignants.map((professeur) =>
                                    <>
                                        <H2Cours onClick={() => validationSuppressionProf(professeur.id, professeur.name)}>{professeur.name}</H2Cours>
                                        {/* <Bouton type="button" >Retirer</Bouton> */}
                                    </>)
                            }
                            <h3>Ajouter un professeur</h3>
                            {professeursAssignables &&
                                <form onSubmit={attribuerProfesseurs}>
                                    <select name="selectProf">
                                        {professeursAssignables && professeursAssignables.map((prof) => (
                                            <option key={prof.id} value={prof.id}>{prof.name}</option>
                                        ))}
                                    </select>
                                    <Bouton type="submit">Ajouter</Bouton>
                                </form>
                            }
                            <Bouton type="button" onClick={() => setModifierProfesseurs(false)}>Annuler</Bouton>
                        </>
                        :
                        <>
                            {
                                coursPropose.enseignants.map((professeur) => (
                                    <H2Cours>{professeur.name}</H2Cours>
                                ))
                            }
                            <Bouton onClick={() => setModifierProfesseurs(true)}>Modifier</Bouton>
                        </>
                }
            </DivH2>
            <Bouton onClick={() => validationSuppressionCours()}>Supprimer</Bouton>
        </DivCarteReduite >
    )
}

export default CarteCours

