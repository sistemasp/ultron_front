import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// ALERGIAS
export const showAllAlergias = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/alergias`,
            method: 'GET'
        })
        return response
    } catch (error) {
        console.log('showAllAlergias', error)
    }
}

export const createAlergias = async (alergias) => {
    try {
        const response = await axios({
            url: `${baseUrl}/alergias`,
            method: 'POST',
            data: alergias
        })
        return response
    } catch (error) {
        console.log('createAlergias', error)
    }
}

export const updateAlergias = async (idAlergias, alergias) => {
    try {
        const response = await axios({
            url: `${baseUrl}/alergias/${idAlergias}`,
            method: 'PUT',
            data: alergias
        })
        return response
    } catch (error) {
        console.log('updateAlergias', error)
    }
}

export const findAlergiasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/alergias/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        console.log('findAlergiasByRangeDateAndSucursal', error)
        return error;
    }
}