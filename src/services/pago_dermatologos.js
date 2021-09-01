import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// PAGO DERMATÓLOGO

export const createPagoDermatologo = async (pagoDermatologo, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoDermatologo`,
            method: 'POST',
            data: pagoDermatologo,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createPagoDermatologo', error);
    }
}

export const showTodayPagoDermatologoBySucursalTurno = async (dermatologoId, sucursalId, turno, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoDermatologo/${dermatologoId}/sucursal/${sucursalId}/turno/${turno}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showTodayPagoDermatologoBySucursalTurno', error);
    }
}

export const updatePagoDermatologo = async (pagoDermatologoId, pagoDermatologo, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoDermatologo/${pagoDermatologoId}`,
            method: 'PUT',
            data: pagoDermatologo,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('updatePagoDermatologo', error);
        return error;
    }
}

export const findPagoDermatologosByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoDermatologo/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findPagoDermatologosByRangeDateAndSucursal', error);
        return error;
    }
}
