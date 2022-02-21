import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_MY_SQL;

// ENTRADAS 

export const showAllEntradas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllEntradas', error);
    }
}

export const findEntradaById = async (idEntrada) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/${idEntrada}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEntradaById', error);
    }
}

export const createEntrada = async (entrada) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada`,
            method: 'POST',
            data: entrada
        });
        return response;
    } catch (error) {
        console.log('createEntrada', error);
    }
}

export const updateEntrada = async (idEntrada, entrada) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/${idEntrada}`,
            method: 'PUT',
            data: entrada
        });
        return response;
    } catch (error) {
        console.log('updateEntrada', error);
    }
}


