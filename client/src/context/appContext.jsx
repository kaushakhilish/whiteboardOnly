import React, { createContext, useState } from 'react';
export const AppContext = createContext({});

export const URL = 'http://localhost:4000/';

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);

    return (
        <AppContext.Provider value={{
            user,
            setUser
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;
