import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// REGISTROS 

export const showAllRegistroFacturas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrofactura`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllRegistroFacturas', error);
    }
}

export const findRegistroFacturaById = async (idRegistroFactura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrofactura/${idRegistroFactura}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRegistroFacturaById', error);
    }
}

export const createRegistroFactura = async (registroFactura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrofactura`,
            method: 'POST',
            data: registroFactura
        });
        return response;
    } catch (error) {
        console.log('createRegistroFactura', error);
    }
}

export const updateRegistroFactura = async (idRegistroFactura, registroFactura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/registrofactura/${idRegistroFactura}`,
            method: 'PUT',
            data: registroFactura
        });
        return response;
    } catch (error) {
        console.log('updateRegistroFactura', error);
    }
}