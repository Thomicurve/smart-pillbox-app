import axios from 'axios'

const apiLink = 'https://smart-pillbox-api.herokuapp.com';

const GetPills = async ( token) => {
    try {
        const {data} = await axios.get(`${apiLink}/pills`, {
            headers: {
                "x-access-token": token
            }
        });
        return data.pills;
    } catch(err) {
        return err
    }
}

export {GetPills};