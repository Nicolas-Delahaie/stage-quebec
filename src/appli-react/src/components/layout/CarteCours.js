import styled from "styled-components"
import { DivBouton, DivCarteReduite } from "./CarteProfesseur"
import { colors, fonts } from "../../utils/styles"
import Bouton from "../forms/Bouton"
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { Input } from "../forms";

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

function CarteCours({ idCours, nomCours, ponderationCours, tailleGroupesCours, nbGroupesCours }) {

    const [veutModifier, setVeutModifier] = useState(false)
    const [NewNomCours, setNomCours] = useState(nomCours)
    const [NewPonderationCours, setPonderationCours] = useState(ponderationCours)
    const [NewTailleGroupesCours, setTailleGroupesCours] = useState(tailleGroupesCours)
    const [NewNbGroupesCours, setNbGroupesCours] = useState(nbGroupesCours)

    const supprimerCours = () => {
        toast((t) => (
            <div>
                <div>Êtes-vous sûr de vouloir supprimer le cours {nomCours} ?</div>
                <DivBoutonToast>
                    <Bouton OnClick={() => toast.dismiss(t.id)}>Annuler</Bouton>
                    <Bouton OnClick={() => [toast.dismiss(t.id), callApiSupprimerCours()]}>Confirmer</Bouton>
                </DivBoutonToast>
            </div>
        ))
    }

    
    const callApiSupprimerCours = () => {
        fetch(`http://localhost:8000/cours/${idCours}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ id: idCours })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.error) {
                    toast.error(`Erreur lors de la suppression du cours ${nomCours}`)
                } else {
                    toast.success('Cours supprimé')
                }
            })
            .catch(e => {
                console.error(e)
                toast.error(`Erreur lors de la suppression du cours ${nomCours}`)
            })
        }
        
        const modifierCours = () => {
            setVeutModifier(!veutModifier)
        }


        const callApiModifierCours = () => {
            fetch(`http://localhost:8000/cours/${idCours}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ id: idCours, ponderation: NewPonderationCours, tailleGroupes: NewTailleGroupesCours, nbGroupes: NewNbGroupesCours })
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if (res.error) {
                        toast.error(`Erreur lors de la modification du cours ${nomCours}`)
                    } else {
                        console.log(res)
                        toast.success('Cours modifié')
                    }
                })
                .catch(e => {
                    console.error(e)
                    toast.error(`Erreur lors de la modification du cours ${nomCours}`)
                })
        }

    return (
        <DivCarteReduite>
            <Toaster />
            <H1Cours>{NewNomCours}</H1Cours>
            <div>
                {
                    veutModifier ? (

                        <DivH2>
                            <span>Pondération : </span>
                            <Input type="number" value={nomCours} placeholder={ponderationCours} onChange={(e) => setPonderationCours(e.target.value)} />
                            <span>Taille du groupe : </span>
                            <Input type="number" value={nomCours} placeholder={tailleGroupesCours} onChange={(e) => setTailleGroupesCours(e.target.value)} />
                            <span>Nombre de groupes : </span>
                            <Input type="number" value={nomCours} placeholder={nbGroupesCours} onChange={(e) => setNbGroupesCours(e.target.value)} />
                        </DivH2>

                    )
                        : (
                            <DivH2>
                                <H2Cours>Pondération : {NewPonderationCours}</H2Cours>
                                <H2Cours>Taille du groupe : {NewTailleGroupesCours}</H2Cours>
                                <H2Cours>Nombre de groupes : {NewNbGroupesCours}</H2Cours>
                            </DivH2>
                        )
                }
            </div>
            {
                veutModifier ? (
                    <DivBouton>
                        <Bouton OnClick={modifierCours}>Annuler</Bouton>
                        <Bouton OnClick={() => [modifierCours(), callApiModifierCours()]}>Confirmer</Bouton>
                    </DivBouton>
                )
                    : (
                        <DivBouton>
                            <Bouton OnClick={modifierCours}>Modifier</Bouton>
                            <Bouton OnClick={supprimerCours}>Supprimer</Bouton>
                        </DivBouton>
                    )
            }

        </DivCarteReduite>
    )
}

export default CarteCours

