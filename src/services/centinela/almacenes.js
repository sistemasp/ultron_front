import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// ALMACEN 

export const showAllAlmacens = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/almacen`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllAlmacens', error);
    }
}

export const findAlmacenById = async (idAlmacen) => {
    try {
        const response = await axios({
            url: `${baseUrl}/almacen/${idAlmacen}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAlmacenById', error);
    }
}

export const createAlmacen = async (almacen) => {
    try {
        const response = await axios({
            url: `${baseUrl}/almacen`,
            method: 'POST',
            data: almacen
        });
        return response;
    } catch (error) {
        console.log('createAlmacen', error);
    }
}

export const updateAlmacen = async (idAlmacen, almacen) => {
    try {
        const response = await axios({
            url: `${baseUrl}/almacen/${idAlmacen}`,
            method: 'PUT',
            data: almacen
        });
        return response;
    } catch (error) {
        console.log('updateAlmacen', error);
    }
}


