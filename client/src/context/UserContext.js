import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

function useUserContext() {
    return useContext(UserContext);
}

function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = userData => { setUser(userData) };

    const logout = () => { setUser(null) };

    const contextValue = {
        user,
        setUser,
        login,
        logout,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, useUserContext, UserProvider };
