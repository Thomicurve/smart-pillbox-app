import axios from 'axios'

const apiLink = 'https://smart-pillbox-api.herokuapp.com';

const GetPills = async ( token ) => {
    try {
        const {data} = await axios.get(`${apiLink}/pills`, {headers: {"x-access-token": token}});
        return data.pills;
    } catch(err) {
        return alert(err)
    }
}

const UploadPills = async (token, dataObj) => {
    try {
        const {data} = await axios({
            method: 'POST',
            url: `${apiLink}/new-pill`,
            headers: {
                "x-access-token": token
            },
            data: dataObj
        });

        return data;

    } catch(err) {{
        return alert(err)
    }}
}

const EditPills = async (token, pillID, dataObj) => {
    try{
        const { data } = await axios({
            method: 'PUT',
            url: `${apiLink}/edit-pill/${pillID}`,
            headers: {
                "x-access-token": token
            },
            data: dataObj
        })

        return data;
    } catch (err) {
        return console.error(`Error eliminando pastillas: ${error}`);
    }
}

const DeletePills = async (token, pillID) => {
    try{
        const { data } = await axios({
            method: 'DELETE',
            url: `${apiLink}/delete-pill/${pillID}`,
            headers: {
                "x-access-token": token
            }
        })

        return data;
    } catch (err) {
        return console.error(`Error eliminando pastillas: ${error}`);
    }
}

export {GetPills, UploadPills, DeletePills, EditPills};