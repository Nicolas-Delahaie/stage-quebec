import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { Loader } from "../../utils/styles";
import { AppContext } from '../../utils/context/context';
import styled from "styled-components";
import toast, { Toaster } from 'react-hot-toast';

/* ---------------------------------- STYLE --------------------------------- */

const DivPageProfesseurModification = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 80.5vh;
    margin: 1rem auto;
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
    padding: 10px;
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
            url: `http://localhost:8000/api/user/details`,
            method: "get",
        });
        setIsLoading(false);

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
        console.log(newContraintes.current.value);

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
        <>
            <Toaster />
            {erreur && <h1>{erreur}</h1>}
            {isLoading && <Loader />}
            {user &&
                <>
                    <h1>Profil</h1>
                    <h2>Informations globales</h2>
                    <div>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>{user.type.nom}</p>
                    </div>
                    <h2>Contraintes</h2>
                    <form onSubmit={(e) => { enregistrementContraintes(); e.preventDefault(); }}>
                        <textarea defaultValue={user.contraintes} ref={newContraintes} placeholder={user.contraintes === "" ? "Saisissez vos contraintes" : undefined} onKeyDown={handleKeyPress} />
                        {isSavingContraintes ?
                            <Loader />
                            :
                            <input type="submit" value="Modifier"></input>
                        }
                    </form>
                    <h2>Libérations</h2>
                    {user.liberations.length === 0 ?
                        <p>Vous n'avez aucune libération</p>
                        :
                        <DivLiberations>
                            <h2>Semestre</h2>
                            <h2>1</h2>
                            <h2>2</h2>
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
                    <button>Voir toutes mes libérations</button>
                </>
            }
        </ >
    );
}

export default Profil;