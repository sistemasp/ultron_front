import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// TIPO MEDICAMENTOS

export const showAllTipoMedicamentos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipomedicamento`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoMedicamentos', error);
    }
}

export const showActivesTipoMedicamentos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipomedicamento/actives`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showActivesTipoMedicamentos', error);
    }
}

export const findTipoEntradaById = async (tipoEntradaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipomedicamento/${tipoEntradaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTipoEntradaById', error);
    }
}