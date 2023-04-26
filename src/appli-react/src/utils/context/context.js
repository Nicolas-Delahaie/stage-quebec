
/* import permetant de créer un contexte pour l'application */
import { createContext } from 'react';

/* import permetant de créer un state pour l'application */
import { useState } from 'react';

/* création du contexte */
export const AppContext = createContext();

/* création du state */
export const AppProvider = ({ children }) => {
    const [isConnected, setisConnected] = useState(false);

    /*fonction permetant de changer la valeur de isConnected */
    const toggleConnexion = () => {
        setisConnected(!isConnected);
        console.log(isConnected);
    };
    /*retourne le context de l'application */
    return (
        <AppContext.Provider value={{ isConnected, toggleConnexion }}>
            {children}
        </AppContext.Provider>
    );
};