import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

// DERMATÓLOGOS

export const findCirugiasByPayOfDoctor = async (dia, mes, anio, sucursalId, dermatologoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfDoctor', error);
    }
}

export const findCirugiasByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfDoctorTurno', error);
    }
}

export const findEsteticasByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByPayOfDoctorTurno', error);
    }
}