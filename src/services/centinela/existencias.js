import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// EXISTENCIAS 

export const showAllExistencias = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/existencia`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllExistencias', error);
    }
}

export const findExistenciaById = async (idExistencia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/existencia/${idExistencia}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findExistenciaById', error);
    }
}

export const findByAlmacen = async (almacenId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/existencia/almacen/${almacenId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findByAlmacen', error);
    }
}

export const findByProducto = async (productoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/existencia/producto/${productoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findByProducto', error);
    }
}

export const findByAlmacenProducto = async (almacenId, productoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/existencia/almacen/${almacenId}/producto/${productoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findByAlmacenProducto', error);
    }
}

export const createExistencia = async (existencia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/existencia`,
            method: 'POST',
            data: existencia
        });
        return response;
    } catch (error) {
        console.log('createExistencia', error);
    }
}

export const updateExistencia = async (idExistencia, existencia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/existencia/${idExistencia}`,
            method: 'PUT',
            data: existencia
        });
        return response;
    } catch (error) {
        console.log('updateExistencia', error);
    }
}


