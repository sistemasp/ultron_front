import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// LABORATORIOS 

export const showAllLaboratorios = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/laboratorio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllLaboratorios', error);
    }
}

export const findLaboratorioById = async (idLaboratorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laboratorio/${idLaboratorio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLaboratorioById', error);
    }
}

export const createLaboratorio = async (laboratorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laboratorio`,
            method: 'POST',
            data: laboratorio
        });
        return response;
    } catch (error) {
        console.log('createLaboratorio', error);
    }
}

export const updateLaboratorio = async (laboratorioId, laboratorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laboratorio/${laboratorioId}`,
            method: 'PUT',
            data: laboratorio
        });
        return response;
    } catch (error) {
        console.log('updateLaboratorio', error);
    }
}


