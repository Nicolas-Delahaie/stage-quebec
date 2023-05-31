import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { Loader, colors, fonts } from "../utils/styles";
import { AppContext } from '../utils/context/context';
import styled from "styled-components";
import toast, { Toaster } from 'react-hot-toast';

import { ArticleTitle, Bouton } from "../components/forms";


/* ---------------------------------- STYLE --------------------------------- */

const DivPageProfil = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.isLoading ? "center" : "flex-start"};
    justify-content: ${props => props.isLoading ? "center" : "flex-start"};
    min-height: 80.5vh;
    padding: 1rem auto;
`;

const DivInfos = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 1rem 2rem;
`;

const DivContraintes = styled.div`
    padding: 1rem;
`;

const FromProfil = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 50%;
    height: 50%;
`;

const H2Profil = styled.h2`
    font-family: ${fonts.titre};
    color: ${colors.bleuFonce};
    font-size: 1.5rem;
    margin: 1rem 0;
`;

const TextareaProfil = styled.textarea`
    height: 100%;
    width: calc(50vw - 3rem);

    cursor: text;
    border: none;
    box-shadow: 0px 5px 10px 0px ${colors.gris};
    border-radius: 0.5rem;
    font-family: ${fonts.texte};
    padding: 0.5rem;
    margin: 0.25rem 0;
    color: ${colors.bleuMoyen};
    &:focus{
        outline: none;
    }
`;

const SubmitProfil = styled.input`
    background-color: ${colors.jauneFonce};
    color: ${colors.bleuFonce};
    text-decoration: none;
    font-family: ${fonts.titre};
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    margin: 1rem;
`;

const DivContainerLiberations = styled.div`
    padding: 1rem;
`;

const DivLiberations = styled.div`
    display:grid; 
    grid-template-columns:1fr 1fr 1fr;
    border: 1px solid black;
    justify-items: center;
`;
const DivLiberation = styled.div`
    width:100%;
    border-top: 1px solid black;
    border-left: 1px solid black;
    text-align: center;
    box-sizing: border-box;
    padding: 0.5rem;
`;

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
            const datas = rep.datas;

            if (datas.liberations.length !== 0) {
                // Si l utilisateur a des liberations
                // On ne garde que les libérations de l'année d'avant et celles de l'année à venir a afficher (6 semestres)
                const annneeActuelle = new Date().getFullYear();
                const anneesProches = [annneeActuelle - 1, annneeActuelle, annneeActuelle + 1];
                datas.liberationsTriees = [];
                anneesProches.forEach((annee) => {
                    for (let semestre = 1; semestre <= 2; semestre++) {
                        datas.liberationsTriees.push({ annee: annee, semestre: semestre, liberations: [] });
                    }
                });

                // Agencement des liberations dans leur semestre
                datas.liberationsTriees.forEach((liberationTriee) => {
                    // On regarde chaque liberation pour trouver celles qui correspondent a l annee et au semestre
                    datas.liberations.forEach((liberation) => {
                        if ((liberation.pivot.annee === liberationTriee.annee || liberation.pivot.annee === null) &&
                            (liberation.pivot.semestre === liberationTriee.semestre || liberation.pivot.semestre === null)) {
                            // La liberation concerne cette annee et ce semestre
                            liberationTriee.liberations.push(liberation);
                        }
                    })
                });
            }



            setUser(datas);
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
        <DivPageProfil isLoading={isLoading}>
            <Toaster />
            {erreur && <h1>{erreur}</h1>}
            {isLoading && <Loader />}
            {user &&
                <>
                    <ArticleTitle texte="Mon profil" />
                    <DivInfos>
                        <DivContraintes>
                            <H2Profil>Informations globales</H2Profil>
                            <p>{user.name}</p>
                            <p>{user.email}</p>
                            <p>{user.type.nom}</p>
                            <H2Profil>Contraintes</H2Profil>
                            <FromProfil onSubmit={(e) => { enregistrementContraintes(); e.preventDefault(); }}>
                                <TextareaProfil defaultValue={user.contraintes} ref={newContraintes} placeholder={user.contraintes === "" ? "Saisissez vos contraintes" : undefined} onKeyDown={handleKeyPress} />
                                {isSavingContraintes ?
                                    <Loader />
                                    :
                                    <SubmitProfil type="submit" value="Modifier"></SubmitProfil>
                                }
                            </FromProfil>
                        </DivContraintes>
                        <DivContainerLiberations>
                            <H2Profil>Libérations</H2Profil>
                            {user.liberations.length === 0 ?
                                <p>Vous n'avez aucune libération récente</p>
                                :
                                <DivLiberations>
                                    <H2Profil>Semestre</H2Profil>
                                    <H2Profil>1</H2Profil>
                                    <H2Profil>2</H2Profil>
                                    {
                                        user.liberationsTriees.map((liberationTriee) => {
                                            return <>
                                                {liberationTriee.semestre === 1 && <h3> {liberationTriee.annee}-{liberationTriee.annee + 1}</h3 >}
                                                <DivLiberation>
                                                    {
                                                        liberationTriee.liberations.map((liberation) => {
                                                            return <p>{liberation.motif} ({(liberation.pivot.tempsAloue * 100).toFixed(1)}%)</p>
                                                        })
                                                    }
                                                </DivLiberation>
                                            </>
                                        })
                                    }
                                </DivLiberations>
                            }
                            <Bouton>Voir toutes mes libérations</Bouton>
                        </DivContainerLiberations>
                    </DivInfos>
                </>
            }
        </ DivPageProfil>
    );
}

export default Profil;