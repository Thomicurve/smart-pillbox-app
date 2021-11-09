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

    } catch(err) {{
        return alert(err);
    }}
}

export {SubmitRecords};