import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// PROVEEDOR 

export const showAllProveedors = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/proveedor`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllProveedors', error);
    }
}

export const findProveedorById = async (idProveedor) => {
    try {
        const response = await axios({
            url: `${baseUrl}/proveedor/${idProveedor}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findProveedorById', error);
    }
}

export const createProveedor = async (proveedor) => {
    try {
        const response = await axios({
            url: `${baseUrl}/proveedor`,
            method: 'POST',
            data: proveedor
        });
        return response;
    } catch (error) {
        console.log('createProveedor', error);
    }
}

export const updateProveedor = async (idProveedor, proveedor) => {
    try {
        const response = await axios({
            url: `${baseUrl}/proveedor/${idProveedor}`,
            method: 'PUT',
            data: proveedor
        });
        return response;
    } catch (error) {
        console.log('updateProveedor', error);
    }
}


