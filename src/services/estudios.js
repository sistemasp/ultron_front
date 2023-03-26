import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// ESTUDIOS

export const findEstudioByConsultaId = async (consultaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estudio/consulta/${consultaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEstudioByConsultaId', error);
    }
}

export const createEstudio = async (estudio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estudio`,
            method: 'POST',
            data: estudio
        });
        return response;
    } catch (error) {
        console.log('createEstudio', error);
    }
}

export const updateEstudio = async (idEstudio, estudio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estudio/${idEstudio}`,
            method: 'PUT',
            data: estudio
        });
        return response;
    } catch (error) {
        console.log('updateEstudio', error);
    }
}

export const findEstudioByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estudio/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findEstudioByRangeDateAndSucursal', error);
        return error;
    }
}