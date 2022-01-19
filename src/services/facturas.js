import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

// FACTURAS 

export const createFactura = async (factura, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura`,
            method: 'POST',
            data: factura,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('createFactura', error);
    }
}

export const findFacturasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacturasByRangeDateAndSucursal', error);
    }
}

export const findFacturaByRazonSocialId = async (razonSocialId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/razonsocial/${razonSocialId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('findFacturaByRazonSocialId', error);
    }
}

export const deleteFactura = async (facialId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/${facialId}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('deleteFactura', error);
    }
}