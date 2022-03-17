import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// REGISTROS 

export const showAllRegistros = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/registro`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllRegistros', error);
    }
}

export const findRegistroById = async (idRegistro) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registro/${idRegistro}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRegistroById', error);
    }
}

export const createRegistro = async (registro) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registro`,
            method: 'POST',
            data: registro
        });
        return response;
    } catch (error) {
        console.log('createRegistro', error);
    }
}

export const updateRegistro = async (idRegistro, registro) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registro/${idRegistro}`,
            method: 'PUT',
            data: registro
        });
        return response;
    } catch (error) {
        console.log('updateRegistro', error);
    }
}


