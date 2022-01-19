import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// ESPECIALIDADES 

export const showAllEspecialidades = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/especialidad`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllEspecialidades', error);
    }
}

export const findEspecialidadById = async (idEspecialidad) => {
    try {
        const response = await axios({
            url: `${baseUrl}/especialidad/${idEspecialidad}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLaboratorioById', error);
    }
}

export const createEspecialidad = async (especialidad) => {
    try {
        const response = await axios({
            url: `${baseUrl}/especialidad`,
            method: 'POST',
            data: especialidad
        });
        return response;
    } catch (error) {
        console.log('createLaboratorio', error);
    }
}

export const updateEspecialidad = async (idEspecialidad, especialidad) => {
    try {
        const response = await axios({
            url: `${baseUrl}/especialidad/${idEspecialidad}`,
            method: 'PUT',
            data: especialidad
        });
        return response;
    } catch (error) {
        console.log('updateLaboratorio', error);
    }
}


