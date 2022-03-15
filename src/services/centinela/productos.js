import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// PRODUCTOS 

export const showAllProductos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/producto`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllProductos', error);
    }
}

export const findProductoById = async (idProducto) => {
    try {
        const response = await axios({
            url: `${baseUrl}/producto/${idProducto}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findProductoById', error);
    }
}

export const createProducto = async (producto) => {
    try {
        const response = await axios({
            url: `${baseUrl}/producto`,
            method: 'POST',
            data: producto
        });
        return response;
    } catch (error) {
        console.log('createProducto', error);
    }
}

export const updateProducto = async (idProducto, producto) => {
    try {
        const response = await axios({
            url: `${baseUrl}/producto/${idProducto}`,
            method: 'PUT',
            data: producto
        });
        return response;
    } catch (error) {
        console.log('updateProducto', error);
    }
}


