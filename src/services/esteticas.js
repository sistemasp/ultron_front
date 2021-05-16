import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// ESTÉTICA ( TOXINAS Y RELLENOS )

export const createEstetica = async (estetica, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica`,
            method: 'POST',
            data: estetica,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createEstetica', error);
        return error;
    }
}

export const findEsteticaByDateAndSucursal = async (dia, mes, anio, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findEsteticaByDateAndSucursal', error);
        return error;
    }
}

export const updateEstetica = async (idEstetica, estetica, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${idEstetica}`,
            method: 'PUT',
            data: estetica,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updateEstetica', error);
        return error;
    }
}

export const findEsteticaById = async (esteticaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${esteticaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findEsteticaById', error);
        return error;
    }
}

export const findEsteticaByConsultaId = async (consultaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/consulta/${consultaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findEsteticaByConsultaId', error);
        return error;
    }
}

export const findEsteticasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByRangeDateAndSucursal', error);
        return error;
    }
}

export const waitingListEstetica = async (sucursalId, statusAsistioId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('waitingListEstetica', error);
        return error;
    }
}

export const findEsteticasHistoricByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/historic/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findEsteticasHistoricByPaciente', error);
        return error;
    }
}

export const findEsteticasByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByPayOfDoctorHoraAplicacion', error);
        return error;
    }
}

export const findEsteticasByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByPayOfDoctorHoraAplicacionPA', error);
        return error;
    }
}