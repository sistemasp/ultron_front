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
