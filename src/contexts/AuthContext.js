import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Retrieve saved auth state from localStorage
    const getSavedAuthState = () => {
        const savedState = localStorage.getItem('authState');
        return savedState ? JSON.parse(savedState) : { isAuthenticated: false, user: null };
    };

    const [authState, setAuthState] = useState(getSavedAuthState);

    // Update localStorage whenever authState changes
    useEffect(() => {
        localStorage.setItem('authState', JSON.stringify(authState));
    }, [authState]);

    const login = (user) => {
        setAuthState({
            isAuthenticated: true,
            user,
        });
    };

    const logout = () => {
        setAuthState({
            isAuthenticated: false,
            user: null,
        });
        localStorage.removeItem('authState');
        localStorage.removeItem('cart')
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
