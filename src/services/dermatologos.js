import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// DERMATÓLOGOS

export const findCuracionesByPayOfDoctor = async (dia, mes, anio, sucursalId, dermatologoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCuracionesByPayOfDoctor', error);
    }
}

export const findCuracionesByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacion/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCuracionesByPayOfDoctorTurno', error);
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