
import { createContext } from 'react';  //Pour generer le contexte
import Cookies from 'js-cookie';        //Pour récupérer les cookies
import { useState } from 'react';        //Pour utiliser les variables d'état

/* création du contexte */
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    /**
     * @brief UseState a utiliser sur des elements graphiques dynamiques en fonction de si l utilisateur est connecte (header par exemple)
     * @details Mise à jour a chaque recuperation du token
     */
    const [estConnecte, setEstConnecte] = useState(Cookies.get('token') !== undefined);

    /**
     * @brief Retourne le token de l'utilisateur, undefined s il n est pas connecté
     * @details Met egalement a jour la variable estConnecte 
     * @returns string, undefined
     */
    const getToken = () => {
        let token = Cookies.get('token');
        if (token) {
            setEstConnecte(true);
            return token;
        }
        else {
            setEstConnecte(false);
            return undefined;
        }
    }

    const getType = () => {
        let type = Cookies.get('type');
        if (type) {
            return type;
        }
        else {
            return undefined;
        }
    }

    const getID = () => {
        let id = Cookies.get('idUser');
        if (id) {
            return id;
        }
        else {
            return undefined;
        }
    }

    /**
     * @brief Connecte l utilsisateur
     * @details Cree le cookie de tokken et met a jour la variable estConnecte 
     */
    const connexion = (token, dureeTokenEnMin,type,idUser) => {
        const dureeTokenEnH = dureeTokenEnMin / 60;
        const dureeTokenEnJ = dureeTokenEnH / 24;
        Cookies.set("token", JSON.stringify(token), { expires: dureeTokenEnJ });
        Cookies.set("type", JSON.stringify(type), { expires: dureeTokenEnJ });
        Cookies.set("idUser", JSON.stringify(idUser), { expires: dureeTokenEnJ });
        console.log(Cookies.get('idUser'));
        setEstConnecte(true);
    }

    /**
     * @brief Deconnecte l utilsisateur
     * @details Supprime le cookie de tokken et met a jour la variable estConnecte 
     */
    const deconnexion = () => {
        Cookies.remove('token');
        setEstConnecte(false);
    }


    return (
        <AppContext.Provider value={{ getToken, getType, getID, deconnexion, connexion, estConnecte }}>
            {children}
        </AppContext.Provider>
    );
};