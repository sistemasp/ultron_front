import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// SESIONES ANTICIPADAS

export const showAllSesionesAnticipadas = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/sesionanticipada`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllSesionesAnticipadas', error);
    }
}

export const showAllSesionesAnticipadasByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/sesionanticipada/paciente/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllSesionesAnticipadasByPaciente', error);
    }
}

export const createSesionAnticipada = async (sesionAnticipada, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/sesionanticipada`,
            method: 'POST',
            data: sesionAnticipada,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createSesionAnticipada', error);
        return error;
    }
}

export const deleteSesionAnticipada = async (sesionAnticipadaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/sesionanticipada/${sesionAnticipadaId}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('deleteSesionAnticipada', error);
    }
}