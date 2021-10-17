import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const createCuracion = async (curacion, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion`,
            method: 'POST',
            data: curacion,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createCuracion', error);
        return error;
    }
}

export const updateCuracion = async (idCuracion, curacion, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/${idCuracion}`,
            method: 'PUT',
            data: curacion,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updateCuracion', error);
        return error;
    }
}

export const findCuracionById = async (curacionId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/${curacionId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCuracionById', error);
        return error;
    }
}

export const findCuracionByConsultaId = async (consultaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/consulta/${consultaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCuracionByConsultaId', error);
        return error;
    }
}

export const findCuracionByDateAndSucursal = async (dia, mes, anio, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCuracionByDateAndSucursal', error);
        return error;
    }
}

export const findCuracionesByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCuracionesByRangeDateAndSucursal', error);
        return error;
    }
}

export const waitingListCuracion = async (sucursalId, statusAsistioId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/waitingList/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('waitingListCuracion', error);
        return error;
    }
}

export const findCuracionesHistoricByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/historic/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCuracionesHistoricByPaciente', error);
        return error;
    }
}

export const findCuracionesByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCuracionesByPayOfDoctorHoraAplicacion', error);
        return error;
    }
}

export const findCuracionesByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('finCuracionesByPayOfDoctorHoraAplicacionPA', error);
        return error;
    }
}

export const findCuracionesByPayOfPatologoHoraAplicacion = async (sucursalId, patologoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/sucursal/${sucursalId}/patologo/${patologoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCuracionesByPayOfPatologoHoraAplicacion', error);
        return error;
    }
}