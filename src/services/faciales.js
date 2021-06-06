import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const showAllFacial = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllFacial', error);
        return error;
    }
}

export const showAllFacialBySucursal = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllFacialBySucursal', error);
        return error;
    }
}

export const showAllFacialBySucursalAsistio = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/asistio`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllFacialBySucursalAsistio', error);
        return error;
    }
}

export const findFacialByDate = async (dia, mes, anio, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${dia}/${mes}/${anio}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacialByDate', error);
        return error;
    }
}

export const findFacialByDateAndSucursal = async (dia, mes, anio, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacialByDateAndSucursal', error);
        return error;
    }
}

export const findFacialByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacialByRangeDateAndSucursal', error);
        return error;
    }
}

export const findFacialByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacialByRangeDateAndSucursalAndService', error);
        return error;
    }
}

export const findHistoricFacialByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/historic/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findHistoricFacialByPaciente', error);
        return error;
    }
}

export const findHistoricFacialByPacienteAndService = async (pacienteId, serviceId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findHistoricFacialByPacienteAndService', error);
        return error;
    }
}

export const findFacialById = async (facialId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${facialId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacialById', error);
        return error;
    }
}

export const createFacial = async (facial, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial`,
            method: 'POST',
            data: facial,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createFacial', error);
        return error;
    }
}

export const updateFacial = async (facialId, facial, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${facialId}`,
            method: 'PUT',
            data: facial,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updateFacial', error);
        return error;
    }
}

export const waitingFacialList = async (sucursalId, statusAsistioId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('waitingFacialList', error);
        return error;
    }
}

export const findFacialByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacialByPayOfDoctorTurno', error);
        return error;
    }
}

export const findFacialesByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacialesByPayOfDoctorHoraAplicacion', error);
        return error;
    }
}

export const findFacialesByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacialesByPayOfDoctorHoraAplicacionPA', error);
        return error;
    }
}

export const showAllFacialBySucursalPendiente = async (sucursalId, pendienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/pendiente/${pendienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllFacialBySucursalPendiente', error);
        return error;
    }
}