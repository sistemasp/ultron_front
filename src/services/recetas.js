import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// RECETAS

export const findRecetaByConsultaId = async (consultaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/receta/consulta/${consultaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRecetaByConsultaId', error);
    }
}

export const createReceta = async (receta) => {
    try {
        const response = await axios({
            url: `${baseUrl}/receta`,
            method: 'POST',
            data: receta
        });
        return response;
    } catch (error) {
        console.log('createReceta', error);
    }
}

export const updateReceta = async (idReceta, receta) => {
    try {
        const response = await axios({
            url: `${baseUrl}/receta/${idReceta}`,
            method: 'PUT',
            data: receta
        });
        return response;
    } catch (error) {
        console.log('updateReceta', error);
    }
}
