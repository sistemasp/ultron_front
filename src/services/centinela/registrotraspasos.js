import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// TRASPASOS 

export const showAllRegistroTraspasos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrotraspaso`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllRegistroTraspasos', error);
    }
}

export const findRegistroTraspasoById = async (idRegistroTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrotraspaso/${idRegistroTraspaso}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRegistroTraspasoById', error);
    }
}

export const createRegistroTraspaso = async (registroTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrotraspaso`,
            method: 'POST',
            data: registroTraspaso
        });
        return response;
    } catch (error) {
        console.log('createRegistroTraspaso', error);
    }
}

export const updateRegistroTraspaso = async (idRegistroTraspaso, registroTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrotraspaso/${idRegistroTraspaso}`,
            method: 'PUT',
            data: registroTraspaso
        });
        return response;
    } catch (error) {
        console.log('updateRegistroTraspaso', error);
    }
}

export const deleteRegistroTraspaso = async (idRegistroTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrotraspaso/${idRegistroTraspaso}`,
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.log('deleteRegistroTraspaso', error);
    }
}