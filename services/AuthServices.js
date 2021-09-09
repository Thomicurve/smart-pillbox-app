import axios from 'axios'

const apiLink = 'https://smart-pillbox-api.herokuapp.com'

const register = async (dni, name) => {
    try {
        const {data} = await axios.post(`${apiLink}/register`, {dni, name});
        return data;
    } catch(err) {
        return err
    }
}

const login = async (dni, token) => {
    try {
        const {data} = await axios.post(`${apiLink}/login`, {dni}, {
            headers: {
                "x-access-token": token
            }
        });
        return data;
    } catch(err) {
        return err
    }
}

export {register, login};