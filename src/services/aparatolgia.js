import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const showAllAparatologia = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllAparatologia', error);
        return error;
    }
}

export const showAllAparatologiaBySucursal = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllAparatologiaBySucursal', error);
        return error;
    }
}

export const showAllAparatologiaBySucursalAsistio = async (sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/asistio`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllAparatologiaBySucursalAsistio', error);
        return error;
    }
}

export const findAparatologiaByDate = async (dia, mes, anio, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${dia}/${mes}/${anio}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByDate', error);
        return error;
    }
}

export const findAparatologiaByDateAndSucursal = async (dia, mes, anio, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByDateAndSucursal', error);
        return error;
    }
}

export const findAparatologiaByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByRangeDateAndSucursal', error);
        return error;
    }
}

export const findAparatologiaByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByRangeDateAndSucursalAndService', error);
        return error;
    }
}

export const findHistoricAparatologiaByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/historic/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findHistoricAparatologiaByPaciente', error);
        return error;
    }
}

export const findHistoricAparatologiaByPacienteAndService = async (pacienteId, serviceId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findHistoricAparatologiaByPacienteAndService', error);
        return error;
    }
}

export const findAparatologiaById = async (aparatologiaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${aparatologiaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaById', error);
        return error;
    }
}

export const createAparatologia = async (aparatologia, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia`,
            method: 'POST',
            data: aparatologia,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createAparatologia', error);
        return error;
    }
}

export const updateAparatologia = async (aparatologiaId, aparatologia, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${aparatologiaId}`,
            method: 'PUT',
            data: aparatologia,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updateAparatologia', error);
        return error;
    }
}

export const waitingAparatologiaList = async (sucursalId, statusAsistioId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('waitingAparatologiaList', error);
        return error;
    }
}

export const findAparatologiaByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByPayOfDoctorTurno', error);
        return error;
    }
}

export const findAparatologiasByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findAparatologiasByPayOfDoctorHoraAplicacion', error);
        return error;
    }
}

export const findAparatologiasByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findAparatologiasByPayOfDoctorHoraAplicacionPA', error);
        return error;
    }
}

export const showAllAparatologiasBySucursalPendiente = async (sucursalId, pendienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/pendiente/${pendienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllAparatologiasBySucursalPendiente', error);
        return error;
    }
}