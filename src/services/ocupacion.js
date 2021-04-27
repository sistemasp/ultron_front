import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

// LABORATORIOS 

export const showAllOcupacions = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/ocupacion`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllOcupacions', error);
    }
}

export const findOcupacionById = async (idLaboratorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ocupacion/${idLaboratorio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findOcupacionById', error);
    }
}

export const createOcupacion = async (ocupacion) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ocupacion`,
            method: 'POST',
            data: ocupacion
        });
        return response;
    } catch (error) {
        console.log('createOcupacion', error);
    }
}

export const updateOcupacion = async (ocupacionId, ocupacion) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ocupacion/${ocupacionId}`,
            method: 'PUT',
            data: ocupacion
        });
        return response;
    } catch (error) {
        console.log('updateOcupacion', error);
    }
}


