import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// ENTRADA

export const createEntrada = async (entrada) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada`,
            method: 'POST',
            data: entrada
        });
        return response;
    } catch (error) {
        console.log('createEntrada', error);
    }
}

export const showEntradasTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showEntradasTodayBySucursalAndTurno', error);
    }
}

export const showEntradasTodayBySucursalAndHoraAplicacion = async (sucursalId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/sucursal/${sucursalId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showEntradasTodayBySucursalAndHoraAplicacion', error);
    }
}

export const showEntradasTodayBySucursalAndHoraAplicacionPA = async (sucursalId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/sucursal/${sucursalId}/apertura/${hora_apertura}/cierre/${hora_cierre}/pa`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showEntradasTodayBySucursalAndHoraAplicacionPA', error);
    }
}

export const findEntradaById = async (entradaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/${entradaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEntradaById', error);
    }
}

/*export const findEntradaByPago = async (pagoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/pago/${pagoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEntradaByPago', error);
    }
}*/

export const updateEntrada = async (entradaId, entrada) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/${entradaId}`,
            method: 'PUT',
            data: entrada
        });
        return response;
    } catch (error) {
        console.log('updateEntrada', error);
    }
}

export const deleteEntrada = async (entradaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/entrada/${entradaId}`,
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.log('deleteEntrada', error);
    }
}