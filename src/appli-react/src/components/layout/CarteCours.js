/**
 * @warning On peut appuyer plusieurs fois sur valider la modification
 * @todo Ajouter la partie pour ajouter des cours aux départements
 * @todo ameliorer le responsive (pour que les tailles ne changent pas quand on clique sur modifier)
 * @todo modifier les boutons pour pas que ce soient les memes (aux memes endroits) lorsqu on modifie ou non
 */

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

function CarteCours({ cours, idDepartement, allCours, setAllCours }) {
    const [veutModifier, setVeutModifier] = useState(false);
    const [newPonderationCours, setNewPonderationCours] = useState(cours.pivot.ponderation);
    const [newTailleGroupesCours, setNewTailleGroupesCours] = useState(cours.pivot.tailleGroupes);
    const [newNbGroupesCours, setNewNbGroupesCours] = useState(cours.pivot.nbGroupes);

    /**
     * @brief Affiche l'interface de validation pour la suppression du cours
     */
    const validationSuppression = () => {
        toast((t) => (
            <div>
                <div>Êtes-vous sûr de vouloir supprimer le cours "{cours.nom}" ?</div>
                <DivBoutonToast>
                    <Bouton onClick={() => toast.dismiss(t.id)}>Annuler</Bouton>
                    <Bouton onClick={() => { toast.dismiss(t.id); supprimerCours(); }}>Confirmer</Bouton>
                </DivBoutonToast>
            </div>
        ))
    }
    /**
     * @brief Affiche un toaster en attendant la reponse de l api
     */
    const supprimerCours = () => {
        toast.promise(
            fetchAPI('DELETE'),
            {
                loading: 'Suppression...',
                success: <b>Cours supprimé !</b>,
                error: (erreur) => <b>{erreur.message}</b>,
            }
        );
    }
    /**
     * @brief Affiche un toaster en attendant la reponse de l api
     */
    const modifierCours = () => {
        toast.promise(
            fetchAPI('PUT'),
            {
                loading: 'Sauvegarde...',
                success: <b>Changements sauvegardés !</b>,
                error: (erreur) => <b>{erreur.message}</b>,
            }
        );
    }


    //Appel des apis
    /**
     * @warning On appelle l'API
     */
    const fetchAPI = (method) => {
        return fetch(`http://localhost:8000/api/proposer`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                cours_id: cours.id,
                departement_id: idDepartement,
                nbGroupes: newNbGroupesCours,
                tailleGroupes: newTailleGroupesCours,
                ponderation: newPonderationCours
            })
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error(`Cours introuvable`);
                    }
                    else if (res.status === 422) {
                        throw new Error(`Mauvais format de données`);
                    }
                    else {
                        throw new Error(`Problème de serveur`);
                    }
                }

                //Fonctionne
                if (method === 'DELETE') {
                    // On supprime la ressource de la page parente
                    setAllCours(allCours => allCours.filter(unCours => unCours.id !== cours.id));
                }
                else if (method === 'PUT') {
                    // On modifie la ressource de la page parente
                    const updatedCours = [...allCours];                 //Copie de la liste des cours
                    const indexCours = allCours.findIndex(c => c.id === cours.id);      //index du cours a modifier dans la liste des cours
                    updatedCours[indexCours].pivot.ponderation = newPonderationCours;
                    updatedCours[indexCours].pivot.tailleGroupes = newTailleGroupesCours;
                    updatedCours[indexCours].pivot.nbGroupes = newNbGroupesCours;
                    setAllCours(updatedCours);
                    setVeutModifier(false);
                }
                return true;
            })
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setVeutModifier(false);
        }
    });

    return (
        <DivCarteReduite>
            <Toaster />
            <H1Cours>{cours.nom}</H1Cours>
            {
                veutModifier ?
                    (
                        <form onSubmit={(e) => { modifierCours(); e.preventDefault(); }}>
                            <Oskfbbz>
                                <H2Cours>Pondération</H2Cours>
                                <Input type="number" value={newPonderationCours} onChange={(e) => setNewPonderationCours(e.target.value)} autoFocus />
                                <H2Cours>Taille du groupe</H2Cours>
                                <Input type="number" value={newTailleGroupesCours} onChange={(e) => setNewTailleGroupesCours(e.target.value)} />
                                <H2Cours>Nombre de groupes</H2Cours>
                                <Input type="number" value={newNbGroupesCours} onChange={(e) => setNewNbGroupesCours(e.target.value)} />
                            </Oskfbbz>
                            <DivBouton>
                                <Bouton type="button" onClick={() => setVeutModifier(false)}>Annuler</Bouton>
                                <Bouton type="submit">Confirmer</Bouton>
                            </DivBouton>
                        </form>
                    )
                    :
                    (
                        <div>
                            <DivH2>
                                <H2Cours>Pondération : {cours.pivot.ponderation}</H2Cours>
                                <H2Cours>Taille du groupe : {cours.pivot.tailleGroupes}</H2Cours>
                                <H2Cours>Nombre de groupes : {cours.pivot.nbGroupes}</H2Cours>
                            </DivH2>
                            <DivBouton>
                                <Bouton onClick={() => setVeutModifier(true)}>Modifier</Bouton>
                                <Bouton onClick={() => validationSuppression()}>Supprimer</Bouton>
                            </DivBouton >
                        </div>
                    )
            }
        </DivCarteReduite >
    )
}

export default CarteCours

