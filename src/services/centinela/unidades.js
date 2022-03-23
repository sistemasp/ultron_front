import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// UNIDAD 

export const showAllUnidades = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/unidad`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllUnidades', error);
    }
}

export const findUnidadById = async (idUnidad) => {
    try {
        const response = await axios({
            url: `${baseUrl}/unidad/${idUnidad}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findUnidadById', error);
    }
}

export const createUnidad = async (unidad) => {
    try {
        const response = await axios({
            url: `${baseUrl}/unidad`,
            method: 'POST',
            data: unidad
        });
        return response;
    } catch (error) {
        console.log('createUnidad', error);
    }
}

export const updateUnidad = async (idUnidad, unidad) => {
    try {
        const response = await axios({
            url: `${baseUrl}/unidad/${idUnidad}`,
            method: 'PUT',
            data: unidad
        });
        return response;
    } catch (error) {
        console.log('updateUnidad', error);
    }
}


