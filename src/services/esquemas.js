import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// ESQUEMA

export const showAllEsquemas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/esquema`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllEsquemas', error);
    }
}

export const createEsquema = async (esquema) => {
    try {
        const response = await axios({
            url: `${baseUrl}/esquema`,
            method: 'POST',
            data: esquema
        });
        return response;
    } catch (error) {
        console.log('createEsquema', error);
    }
}

export const updateEsquema = async (updateEsquemaId, esquema, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/esquema/${updateEsquemaId}`,
            method: 'PUT',
            data: esquema,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updateEsquema', error);
        return error;
    }
}

export const findEsquemaById = async (id) => {
    try {
        const response = await axios({
            url: `${baseUrl}/esquema/${id}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsquemaById', error);
    }
}