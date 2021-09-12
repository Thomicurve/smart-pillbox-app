import AsyncStorage from "@react-native-async-storage/async-storage"

const useAuthUser = () => {

    const getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('user_token');
            if(!value) return ''
            else return value;

        } catch (error) {
            return error
        }
    }
    
    
    const saveToken = async (token) => {
        try {
            await AsyncStorage.setItem('user_token', token)
        } catch (error) {
            return error;
        }
    }



    const deleteToken = async () => {
        try {
            await AsyncStorage.removeItem('user_token');
        } catch (error) {
            return error
        }
    }

    return {
        saveToken,
        getToken,
        deleteToken,
    }
}

export default useAuthUser;