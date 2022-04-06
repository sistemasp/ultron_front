import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// FACTURAS 

export const showAllFacturas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllFacturas', error);
    }
}

export const findFacturaById = async (idFactura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/${idFactura}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacturaById', error);
    }
}

export const createFactura = async (factura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura`,
            method: 'POST',
            data: factura
        });
        return response;
    } catch (error) {
        console.log('createFactura', error);
    }
}

export const updateFactura = async (idFactura, factura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/${idFactura}`,
            method: 'PUT',
            data: factura
        });
        return response;
    } catch (error) {
        console.log('updateFactura', error);
    }
}

export const deleteFactura = async (idFactura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/${idFactura}`,
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.log('deleteFactura', error);
    }
}