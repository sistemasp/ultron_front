import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

// SERVICIOS

export const getAllServices = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/servicio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllServices', error);
    }
}

export const findServiceById = async (idServicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/servicio/${idServicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findServiceById', error);
    }
}

export const createService = async (servicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/servicio`,
            method: 'POST',
            data: servicio
        });
        return response;
    } catch (error) {
        console.log('createService', error);
    }
}

export const updateService = async (idServicio, servicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/servicio/${idServicio}`,
            method: 'PUT',
            data: servicio
        });
        return response;
    } catch (error) {
        console.log('updateService', error);
    }
}
