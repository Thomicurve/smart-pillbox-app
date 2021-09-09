import AsyncStorage from "@react-native-async-storage/async-storage"
import {useState} from 'react'

const useAuthUser = () => {
    const [token, setToken] = useState('')

    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('@user_token');
            if (!value) return '';

            else return value;

        } catch (error) {
            return error
        }
    }
    
    
    const saveToken = async (token) => {
        try {
            await AsyncStorage.setItem('@user_token', token)
            setToken(token);
        } catch (error) {
            return error;
        }
    }



    const deleteToken = async () => {
        try {
            await AsyncStorage.removeItem('@user_token');
            setToken('');
        } catch (error) {
            return error
        }
    }

    return {
        saveToken,
        getToken,
        deleteToken,
        setToken,
        token
    }
}

export default useAuthUser;
