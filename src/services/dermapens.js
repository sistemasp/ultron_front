import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const showAllDermapen = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllDermapen', error);
        return error;
    }
}

export const showAllDermapenBySucursal = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllDermapenBySucursal', error);
        return error;
    }
}

export const showAllDermapenBySucursalAsistio = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/asistio`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllDermapenBySucursalAsistio', error);
        return error;
    }
}

export const findDermapenByDate = async (dia, mes, anio, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dia}/${mes}/${anio}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findDermapenByDate', error);
        return error;
    }
}

export const findDermapenByDateAndSucursal = async (dia, mes, anio, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findDermapenByDateAndSucursal', error);
        return error;
    }
}

export const findDermapenByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findDermapenByRangeDateAndSucursal', error);
        return error;
    }
}

export const findDermapenByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findDermapenByRangeDateAndSucursalAndService', error);
        return error;
    }
}

export const findHistoricDermapenByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/historic/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findHistoricDermapenByPaciente', error);
        return error;
    }
}

export const findHistoricDermapenByPacienteAndService = async (pacienteId, serviceId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findHistoricDermapenByPacienteAndService', error);
        return error;
    }
}

export const findDermapenById = async (dermapenId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dermapenId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findDermapenById', error);
        return error;
    }
}

export const createDermapen = async (dermapen, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen`,
            method: 'POST',
            data: dermapen,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createDermapen', error);
        return error;
    }
}

export const updateDermapen = async (dermapenId, dermapen, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dermapenId}`,
            method: 'PUT',
            data: dermapen,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updateDermapen', error);
        return error;
    }
}

export const waitingDermapenList = async (sucursalId, statusAsistioId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('waitingDermapenList', error);
        return error;
    }
}

export const findDermapenByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findDermapenByPayOfDoctorTurno', error);
        return error;
    }
}

export const findDermapensByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findDermapensByPayOfDoctorHoraAplicacion', error);
        return error;
    }
}

export const findDermapensByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findDermapensByPayOfDoctorHoraAplicacionPA', error);
        return error;
    }
}

export const showAllDermapenBySucursalPendiente = async (sucursalId, pendienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/pendiente/${pendienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllDermapenBySucursalPendiente', error);
        return error;
    }
}