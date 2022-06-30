import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// SURTIDO TRASPASOS 

export const showAllSurtidoTraspasos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/surtidotraspaso`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllSurtidoTraspasos', error);
    }
}

export const findSurtidoTraspasoById = async (idSurtidoTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/surtidotraspaso/${idSurtidoTraspaso}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurtidoTraspasoById', error);
    }
}
export const findSurtidoTraspasoByRegistroId = async (registroId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/surtidotraspaso/registrotraspaso/${registroId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurtidoTraspasoByRegistroId', error);
    }
}

export const createSurtidoTraspaso = async (surtidoTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/surtidotraspaso`,
            method: 'POST',
            data: surtidoTraspaso
        });
        return response;
    } catch (error) {
        console.log('createSurtidoTraspaso', error);
    }
}

export const updateSurtidoTraspaso = async (idSurtidoTraspaso, surtidoTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/surtidotraspaso/${idSurtidoTraspaso}`,
            method: 'PUT',
            data: surtidoTraspaso
        });
        return response;
    } catch (error) {
        console.log('updateSurtidoTraspaso', error);
    }
}

export const deleteSurtidoTraspaso = async (idSurtidoTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/surtidotraspaso/${idSurtidoTraspaso}`,
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.log('deleteSurtidoTraspaso', error);
    }
}