import axios from 'axios'

const apiLink = 'https://smart-pillbox-api.herokuapp.com';

const SubmitRecords = async (token, dataObj) => {
    try {
        const {data} = await axios({
            method: 'POST',
            url: `${apiLink}/new-record`,
            headers: {
                "x-access-token": token
            },
            data: dataObj
        });

        return data;

    } catch(err) {
        return alert(err);
    }
}

const GetRecords = async (token) => {
    try {
        const {data} = await axios({
            method: 'GET',
            url: `${apiLink}/records`,
            headers: {
                "x-access-token": token
            }
        })
        return data.records;

    } catch (err) {
        return alert(err);
    }
}

export { SubmitRecords, GetRecords };