import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../utils/context/context';

function TestApis() {
    const { apiAccess, estConnecte } = useContext(AppContext);

    var url;
    var methode;

    // -- TEST --
    const ESSAI = async () => {
        // const resultat = await apiAccess({
        //     url: `http://localhost:8000/api/login`,
        //     method: "post",
        //     body: { email: "root@root.root", password: "root", duration: 100 }
        // });
        // console.log(resultat);
    }
    ESSAI();


    const envoi = async (e) => {
        e.preventDefault();         //Pour empecher le comportement normal du formulaire

        const rep = await apiAccess({
            url: `http://localhost:8000/api/${url}`,
            method: methode,
        });
        console.log(rep);
    }


    return (
        <div>
            <h1>Test des APIs</h1>
            <p>{estConnecte ? "Connecté" : "Déconnecté"}</p>
            <form>
                <input placeholder='methode' value={methode} onChange={(e) => methode = e.target.value} />
                <input placeholder='url' value={url} onChange={(e) => url = e.target.value} />
                <button onClick={envoi}>ENVOIE REQUETE</button>
            </form>
        </div>
    )
}
export default TestApis