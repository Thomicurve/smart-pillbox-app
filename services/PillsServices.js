import axios from 'axios'

const apiLink = 'https://smart-pillbox-api.herokuapp.com';
const headerOptions = (token) => {
    return {
        headers: {
            "x-access-token": token
        }
    }
} 

const GetPills = async ( token ) => {
    try {
        const {data} = await axios.get(`${apiLink}/pills`, headerOptions(token));
        return data.pills;
    } catch(err) {
        return alert(err)
    }
}

const GetRecords = async ( token ) => {
    try {
        const {data} = await axios.get(`${apiLink}/records`, headerOptions(token));
        return data.records;
    } catch(err) {
        return alert(err)
    }
}

export {GetPills, GetRecords};