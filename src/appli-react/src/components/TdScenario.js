import { useState, useRef, useEffect } from 'react';
import { AppContext } from '../utils/context/context';
import { useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export function TdScenario({ indexCours, indexProfesseur, nbGroupes, TbCours, TbProfesseurs, TbRepartition, fonctionUpdateRepartition }) {
    const [estClicker, setEstClicker] = useState(false);        //Permet de savoir si l'utilisateur a cliqué sur la cellule
    const [resultatUpdate, setResultatUpdate] = useState(0);    //Variable qui contient le résultat de la modification de la répartition
    const inputRef = useRef(null);                              //Référence à l'input
    const { apiAccess } = useContext(AppContext);               //Permet d'accéder à l'API

    /**
     * Fonction qui permet de savoir si l'utilisateur a cliqué sur la cellule
     */
    const clickTest = () => {
        setEstClicker(!estClicker);
    };

    /**
     * Permet de mettre le focus sur l'input
    */
    useEffect(() => {
        if (estClicker && inputRef.current) {
            inputRef.current.focus();
        }
    }, [estClicker]);

    /**
     * 
     * @param {*} indexCours Index du cours dans le tableau des cours
     * @param {*} indexProfesseur Index du professeur dans le tableau des professeurs
     * @param {*} TbCours Tableau des cours
     * @param {*} TbProfesseurs Tableau des professeurs
     * @param {*} TbRepartition Tableau des répartitions
     * @returns 
     */
    const findRepartition = (indexCours, indexProfesseur, TbCours, TbProfesseurs, TbRepartition) => {
        var repartitionFind = TbRepartition.find(
            (rep) =>
                //On cherche la répartition qui correspond au cours et au professeur
                rep.idCours === TbCours[indexCours].id && rep.idProfesseur === TbProfesseurs[indexProfesseur].id,
        )
        if (repartitionFind === undefined) {
            toast.error("Erreur : Impossible de modifié un cours non attribué");
        }
        else {
            return repartitionFind;
        }
    }


    /**
     * Fonction qui permet de mettre à jour le tableau des répartitions
     * @param {*} resultatUpdate Nouveau résultat de la modification de la répartition
     * @param {*} TbRepartition Tableau des répartitions
     * @returns 
     */
    const updateRepartitionInArray = (resultatUpdate, TbRepartition) => {
        const updatedArray = TbRepartition.map((repartition) => {
            if (repartition.id === resultatUpdate.id) {
                return resultatUpdate;
            }
            return repartition;
        });

        return updatedArray;
    };

    const deleteRepartitionInArray = (resultatUpdate, TbRepartition) => {
        const updatedArray = TbRepartition.map((repartition) => {
            if (repartition.id === resultatUpdate.id) {
                return null;
            }
            return repartition;
        });
    };


    /**
     * Fonction permettant de mettre à jour la répartition dans la base de données et dans le tableau des répartitions
     * @param {*} nouveauNbGroupes 
     * @returns [] Tableau des répartitions
     */
    const updateRepartition = async (nouveauNbGroupes) => {
        try {
            // On affiche un toast de chargement
            toast.loading('Enregistrement...');
            // On récupère la répartition
            const repartitionMatch = findRepartition(indexCours, indexProfesseur, TbCours, TbProfesseurs, TbRepartition);
            // On envoie la requête à l'API
            const rep = await apiAccess({
                url: `http://localhost:8000/api/repartition/${repartitionMatch.id}?nbGroupes=${nouveauNbGroupes}`,
                method: 'POST',
            });
            // On ferme le toast de chargement
            toast.dismiss();

            if (rep.success) {
                // On met le résultat de la modification dans le state
                setResultatUpdate(rep.datas);
                const resultatUpdate = {
                    ...repartitionMatch,
                    nbGroupes: nouveauNbGroupes,
                };
                // On met à jour le tableau des répartitions
                const updatedArray = updateRepartitionInArray(resultatUpdate, TbRepartition);
                // On passe dans la focntion demandée en props le tableau des répartitions mis à jour
                fonctionUpdateRepartition(updatedArray);
                // On affiche un toast de succès
                toast.success('Modification enregistrée');
            } else {
                toast.error("Erreur : " + rep.erreur);
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Une erreur est survenue : " + error.message);
        }
    };

    const deleteRepartition = async () => {
        try {
            // On affiche un toast de chargement
            toast.loading('Enregistrement...');
            // On récupère la répartition
            const repartitionMatch = findRepartition(indexCours, indexProfesseur, TbCours, TbProfesseurs, TbRepartition);
            // On envoie la requête à l'API
            console.log(repartitionMatch.id);
            const rep = await apiAccess({
                url: `http://localhost:8000/api/repartition/${repartitionMatch.id}`,
                method: 'DELETE',
            });
            // On ferme le toast de chargement
            toast.dismiss();

            if (rep.success) {
                // On modifie la répartition dans le tableau des répartitions
                const updatedArray = deleteRepartitionInArray(repartitionMatch, TbRepartition);
                // On passe dans la focntion demandée en props le tableau des répartitions mis à jour
                fonctionUpdateRepartition(updatedArray);
                toast.success('Répartition supprimée');
            } else {
                toast.error("Erreur : " + rep.erreur);
                console.log(rep.erreur);
            }
        }
        catch (error) {
            toast.dismiss();
            toast.error("Une erreur est survenue : " + error.message);
            console.log(error);
        }
    }

    /**
     * Fonction qui permet de mettre à jour la répartition lorsque l'utilisateur appuie sur la touche entrée
     * @param {*} e Evènement
     * @param {*} nbGroupes Nombre de groupes
     */
    const entreTest = (e, nbGroupes) => {
        if (e.key === 'Enter') {
            // On récupère la valeur de l'input
            const value = Number(e.target.value);
            // On change l'état de la cellule
            setEstClicker(!estClicker);
            // Si la valeur est supérieur à 0 et différente ou égale du nombre de groupes alors on modifie la répartition
            if (value >= 1 && value !== nbGroupes) {
                updateRepartition(value);
            }
            // Sinon si la valeur est égale à 0 alors on supprime la répartition
            else if (value === 0) {
                deleteRepartition();
            }
        }
    };

    return (
        estClicker ? (
            <td className='tdScenario' onClick={clickTest}>
                <Toaster />
                <input ref={inputRef} type="number" placeholder={nbGroupes} onKeyDown={(e) => entreTest(e, nbGroupes)} />
            </td>
        ) : (
            <td onClick={clickTest}>
                {nbGroupes}
            </td>
        )
    );
}
