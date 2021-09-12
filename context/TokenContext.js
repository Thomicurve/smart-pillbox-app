import React, { useState, useEffect } from 'react';
import { createContext } from 'react'
import useAuthUser from '../hooks/useAuthUser';

const TokenContext = createContext({});

export function TokenContextProvider({ children }) {
    const { getToken, deleteToken } = useAuthUser();
    const [token, setToken] = useState('')

    useEffect(() => {
        async function handleToken() {
            const result = await getToken();
            setToken(result);
        }

        handleToken()
    }, [])

    return <TokenContext.Provider value={{token, setToken}}>
        {children}
    </TokenContext.Provider>
}

export default TokenContext;

