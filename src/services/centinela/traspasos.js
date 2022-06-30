import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// FACTURAS 

export const showAllTraspasos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/traspaso`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTraspasos', error);
    }
}

export const findTraspasoById = async (idTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/traspaso/${idTraspaso}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTraspasoById', error);
    }
}

export const findTraspasosByAlmacenOrigen = async (almacenOrigenId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/traspaso/almacenorigen/${almacenOrigenId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTraspasosByAlmacenOrigen', error);
    }
}

export const findTraspasosByAlmacenDestino = async (almacenDestinoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/traspaso/almacendestino/${almacenDestinoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTraspasosByAlmacenDestino', error);
    }
}

export const createTraspaso = async (traspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/traspaso`,
            method: 'POST',
            data: traspaso
        });
        return response;
    } catch (error) {
        console.log('createTraspaso', error);
    }
}

export const updateTraspaso = async (idTraspaso, traspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/traspaso/${idTraspaso}`,
            method: 'PUT',
            data: traspaso
        });
        return response;
    } catch (error) {
        console.log('updateTraspaso', error);
    }
}

export const deleteTraspaso = async (idTraspaso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/traspaso/${idTraspaso}`,
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.log('deleteTraspaso', error);
    }
}