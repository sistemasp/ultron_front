import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// CONSECUTIVOS 

export const createConsecutivo = async (consecutivo, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consecutivo`,
            method: 'POST',
            data: consecutivo,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createConsecutivo', error);
    }
}

export const findConsecutivoBySucursal = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consecutivo/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsecutivoBySucursal', error);
    }
}