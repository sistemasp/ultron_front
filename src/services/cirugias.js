import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

export const createCirugia = async (cirugia, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia`,
            method: 'POST',
            data: cirugia,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createCirugia', error);
        return error;
    }
}

export const updateCirugia = async (idCirugia, cirugia, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${idCirugia}`,
            method: 'PUT',
            data: cirugia,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updateCirugia', error);
        return error;
    }
}

export const findCirugiaById = async (cirugiaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${cirugiaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCirugiaById', error);
        return error;
    }
}

export const findCirugiaByConsultaId = async (consultaId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/consulta/${consultaId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCirugiaByConsultaId', error);
        return error;
    }
}

export const findCirugiaByDateAndSucursal = async (dia, mes, anio, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCirugiaByDateAndSucursal', error);
        return error;
    }
}

export const findCirugiasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByRangeDateAndSucursal', error);
        return error;
    }
}

export const waitingListCirugia = async (sucursalId, statusAsistioId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/waitingList/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('waitingListCirugia', error);
        return error;
    }
}

export const findCirugiasHistoricByPaciente = async (pacienteId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/historic/${pacienteId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCirugiasHistoricByPaciente', error);
        return error;
    }
}

export const findCirugiasByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfDoctorHoraAplicacion', error);
        return error;
    }
}

export const findCirugiasByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('finCirugiasByPayOfDoctorHoraAplicacionPA', error);
        return error;
    }
}

export const findCirugiasByPayOfPatologoHoraAplicacion = async (sucursalId, patologoId, hora_apertura, hora_cierre, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/sucursal/${sucursalId}/patologo/${patologoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfPatologoHoraAplicacion', error);
        return error;
    }
}