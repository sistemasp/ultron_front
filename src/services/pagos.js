import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// PAGOS

export const createPago = async (pago) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago`,
            method: 'POST',
            data: pago
        });
        return response;
    } catch (error) {
        console.log('createPago', error);
    }
}

export const findPaysByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findPaysByRangeDateAndSucursal', error);
    }
}

export const findPagoByIds = async (pagosIds) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/${pagosIds}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagoByIds', error);
    }
}

export const findPagosByCita = async (idCita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/cita/${idCita}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagosByCita', error);
    }
}

export const findPagosByTipoServicioAndServicio = async (idTipoServicio, idServicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/tipo_servicio/${idTipoServicio}/servicio/${idServicio}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagosByTipoServicioAndServicio', error);
    }
}

export const updatePago = async (pagoId, pago) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/${pagoId}`,
            method: 'PUT',
            data: pago
        });
        return response;
    } catch (error) {
        console.log('updatePago', error);
    }
}

export const deletePago = async (pagoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/${pagoId}`,
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.log('deletePago', error);
    }
}
