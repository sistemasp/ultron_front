import axios from 'axios';

export const tokenSepomex = process.env.REACT_APP_TOKEN_SEPOMEX;

const urlSepomexGetEstados = 'https://api-sepomex.hckdrk.mx/query/get_estados/';
const urlSepomexGetMunicipos = 'https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/';
const urlSepomexGetColonia = 'https://api-sepomex.hckdrk.mx/query/get_colonia_por_municipio/';
const urlSepomexGetAllInfoByCP = 'https://api-sepomex.hckdrk.mx/query/info_cp/';

// SEPOMEX

export const sepomexGetEstados = async () => {
    try {
        const response = await axios({
            url: `${urlSepomexGetEstados}?token=${tokenSepomex}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetEstados', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetMunicipos = async (estado) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetMunicipos}${estado}?token=${tokenSepomex}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetMunicipos', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetColonia = async (municipio) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetColonia}${municipio}?token=${tokenSepomex}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetColonia', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetAllInfoByCP = async (cp) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetAllInfoByCP}${cp}?type=simplified&token=${tokenSepomex}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetAllInfoByCP', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}