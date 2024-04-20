import React, { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = useCallback((userData) => {
        console.log("User data in login:", userData);  // Log to confirm the structure
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        // Optionally, clear the cookie or token storage here
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Example to clear a cookie
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);