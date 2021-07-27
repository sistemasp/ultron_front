import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// PAGOS ANTICIPADOS

export const showAllPagoAnticipados = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoanticipado`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllPagoAnticipados', error);
    }
}

export const showAllPagoAnticipadosByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoanticipado/paciente/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllPagoAnticipadosByPaciente', error);
    }
}


export const createPagoAnticipado = async (pagoAnticipado, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoanticipado`,
            method: 'POST',
            data: pagoAnticipado,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createPagoAnticipado', error);
        return error;
    }
}

export const updatePagoAnticipado = async (pagoAnticipadoId, pagoAnticipado, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoanticipado/${pagoAnticipadoId}`,
            method: 'PUT',
            data: pagoAnticipado,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updatePagoAnticipado', error);
        return error;
    }
}

export const deletePagoAnticipado = async (pagoAnticipadoId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoanticipado/${pagoAnticipadoId}`,
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