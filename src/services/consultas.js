import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const getAllConsults = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('getAllConsults', error);
        return error;
    }
}

export const getAllConsultsBySucursal = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('getAllConsultsBySucursal', error);
        return error;
    }
}

export const showAllConsultsBySucursalAsistio = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/asistio`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllConsultsBySucursalAsistio', error);
        return error;
    }
}

export const showAllConsultsBySucursalPendiente = async (sucursalId, pendienteId, confirmadoStatusId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/pendiente/${pendienteId}/${confirmadoStatusId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllConsultsBySucursalPendiente', error);
        return error;
    }
}

export const findConsultsByDate = async (dia, mes, anio, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByDate', error);
        return error;
    }
}

export const findConsultsByDateAndSucursal = async (dia, mes, anio, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByDateAndSucursal', error);
        return error;
    }
}

export const findConsultsByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByRangeDateAndSucursal', error);
        return error;
    }
}

export const findHistoricConsultByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/historic/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findHistoricConsultByPaciente', error);
        return error;
    }
}

export const findHistoricConsultByDermatologo = async (dermatologoId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/historic/dermatologo/${dermatologoId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findHistoricConsultByDermatologo', error);
        return error;
    }
}

export const findConsultById = async (consultId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${consultId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultById', error);
        return error;
    }
}


export const createConsult = async (consulta, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta`,
            method: 'POST',
            data: consulta,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createConsult', error);
        return error;
    }
}

export const updateConsult = async (consultaId, consulta, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${consultaId}`,
            method: 'PUT',
            data: consulta,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updateConsult', error);
        return error;
    }
}

export const waitingListConsulta = async (sucursalId, statusAsistioId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('waitingListConsulta', error);
        return error;
    }
}

export const findConsultsByPayOfDoctor = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctor', error);
        return error;
    }
}

export const findConsultsByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorTurno', error);
        return error;
    }
}

export const findConsultsByPayOfDoctorTurnoFrecuencia = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno, frecuenciaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}/frecuencia/${frecuenciaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorTurnoFrecuencia', error);
        return error;
    }
}

export const findConsultsByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorHoraAplicacion', error);
        return error;
    }
}

export const findConsultsByPayOfDoctorHoraAplicacionFrecuencia = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, frecuenciaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}/frecuencia/${frecuenciaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorHoraAplicacionFrecuencia', error);
        return error;
    }
}

export const findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, frecuenciaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}/frecuencia/${frecuenciaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA', error);
        return error;
    }
}