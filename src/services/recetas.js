import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

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

export const findRecetaByPacienteId = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/receta/paciente/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRecetaByPacienteId', error);
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

export const findRecetaByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/receta/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findRecetaByRangeDateAndSucursal', error);
        return error;
    }
}