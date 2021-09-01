import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// TIPO ENTRADAS

export const showAllTipoEntradas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoentrada`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoEntradas', error);
    }
}

export const showActivesTipoEntradas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoentrada/actives`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showActivesTipoEntradas', error);
    }
}

export const findTipoEntradaById = async (tipoEntradaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoentrada/${tipoEntradaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTipoEntradaById', error);
    }
}