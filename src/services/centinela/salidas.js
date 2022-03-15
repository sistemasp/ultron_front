import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// SALIDAS 

export const showAllSalidas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/salida`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllSalidas', error);
    }
}

export const findSalidaById = async (idSalida) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salida/${idSalida}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalidaById', error);
    }
}

export const createSalida = async (salida) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salida`,
            method: 'POST',
            data: salida
        });
        return response;
    } catch (error) {
        console.log('createSalida', error);
    }
}

export const updateSalida = async (idSalida, salida) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salida/${idSalida}`,
            method: 'PUT',
            data: salida
        });
        return response;
    } catch (error) {
        console.log('updateSalida', error);
    }
}


