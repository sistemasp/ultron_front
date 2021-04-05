import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// PRODUCTOS COMERCIALES 

export const showAllProductoComercials = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/productocomercial`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllProductoComercials', error);
    }
}

export const createProductoComercial = async (productocomercial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/productocomercial`,
            method: 'POST',
            data: productocomercial
        });
        return response;
    } catch (error) {
        console.log('createProductoComercial', error);
    }
}

export const updateProductoComercial = async (productocomercialId, productocomercial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/productocomercial/${productocomercialId}`,
            method: 'PUT',
            data: productocomercial
        });
        return response;
    } catch (error) {
        console.log('updateProductoComercial', error);
    }
}
