import { createContext } from 'react';
import { useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isConnected, setisConnected] = useState(false);
    const toggleConnexion = () => {
        setisConnected(!isConnected);
        console.log(isConnected);
    };
    return (
        <AppContext.Provider value={{ isConnected, toggleConnexion }}>
            {children}
        </AppContext.Provider>
    );
};