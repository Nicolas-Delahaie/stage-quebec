/**
 * @todo Ajouter le script de deconnexion laravel au front
 */
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

    /**
     * @brief Connecte l utilsisateur
     * @details Cree le cookie de tokken et met a jour la variable estConnecte 
     */
    const connexion = (token, dureeTokenEnMin) => {
        const dureeTokenEnH = dureeTokenEnMin / 60;
        const dureeTokenEnJ = dureeTokenEnH / 24;
        Cookies.set("token", JSON.stringify(token), { expires: dureeTokenEnJ });
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

    /**
     * @brief Permet d'envoyer une requête à une API avec vérification de l'authentification.
     * @details Cette fonction envoie une requête à une API en utilisant l'URL spécifiée et effectue des vérifications d'authentification.
     * 
     * @param url L'URL de l'API (obligatoire).
     * @param method La méthode HTTP de la requête. Une chaîne de caractères représentant la méthode HTTP, par exemple "GET", "POST", "PUT" (par défaut : "GET").
     * @param body Le corps de la requête. Un objet dictionnaire représentant les données à envoyer dans le corps de la requête (par défaut : undefined).
     * 
     * @returns Un objet contenant les résultats de la requête avec les propriétés suivantes :
     *          - success : Un booléen indiquant si la requête a réussi.
     *          - statusCode : Le code de statut de la réponse HTTP.
     *          - data : Les données renvoyées par la requête.
     *          - error : Une chaîne de caractères représentant un message d'erreur en cas d'échec de la requête.
     */
    const apiAccess = async ({
        url,
        method = "get",
        body = undefined,
    }) => {
        // -- VERIFICATIONS --
        // Validite des parametres
        if (body !== undefined && (method === "get" || method === "delete")) {
            throw Error("Impossible d'envoyer une requete get ou delete avec un body");
        }
        // Authentification
        const token = getToken();
        if (token === undefined) {
            // Aucun utilisateur connecte
            return {
                success: false,
                statusCode: 401,
                datas: undefined,
                erreur: "Authentification necessaire"
            };
        }

        console.log("url : " + url + "\nmethod : " + method + "\nbody : " + body + "\ntoken : " + token.slice(1, -1));



        // -- CONVERSIONS --
        if (body) {
            // On convertit le body en string s il y en a un
            body = JSON.stringify(body);
        }


        // -- VARIABLES DE RETOUR --
        var isSuccess = false;
        var status = undefined;
        var datas = undefined;
        var erreur = undefined;


        // -- FETCH --
        await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": `Bearer ${token.slice(1, -1)}`,
            },
            body: body
        })
            .then(res => {
                // -- Gestion des erreurs --
                status = res.status;
                if (!res.ok) {
                    // -- Requete non ok --
                    // Fabrication du message d erreur
                    switch (res.status) {
                        case 400:
                            throw Error("Requete mal formée");
                        case 401:
                            throw Error("Mot de passe ou mail incorrect");
                        case 403:
                            deconnexion();
                            throw Error("Accès refusé");
                        case 404:
                            throw Error("La ressource n'existe pas");
                        case 422:
                            throw Error("Mauvais format de reponse");
                        case 503:
                            throw Error("Service indisponible (surcharge ou maintenance)");
                        default:
                            throw Error("Erreur de serveur");
                    }
                }

                return res.json()
            })
            .then(data => {
                isSuccess = true;
                datas = data;
            })
            .catch(err => erreur = err.message)


        // -- RETOUR --
        return {
            success: isSuccess,
            statusCode: status,
            datas: datas,
            erreur: erreur
        };
    }



    return (
        <AppContext.Provider value={{ deconnexion, connexion, estConnecte, apiAccess }}>
            {children}
        </AppContext.Provider>
    );
};