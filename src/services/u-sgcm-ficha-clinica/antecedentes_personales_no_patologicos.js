import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// ALERGIAS
export const showAllAntecedentesPersonalesNoPatologicos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentespersonalesnopatologicos`,
            method: 'GET'
        })
        return response
    } catch (error) {
        console.log('showAllAntecedentesPersonalesNoPatologicos', error)
    }
}

export const createAntecedentesPersonalesNoPatologicos = async (antecedentesPersonalesNoPatologicos) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentespersonalesnopatologicos`,
            method: 'POST',
            data: antecedentesPersonalesNoPatologicos
        })
        return response
    } catch (error) {
        console.log('createAntecedentesPersonalesNoPatologicos', error)
    }
}

export const updateAntecedentesPersonalesNoPatologicos = async (idAntecedentesPersonalesNoPatologicos, antecedentesPersonalesNoPatologicos) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentespersonalesnopatologicos/${idAntecedentesPersonalesNoPatologicos}`,
            method: 'PUT',
            data: antecedentesPersonalesNoPatologicos
        })
        return response
    } catch (error) {
        console.log('updateAntecedentesPersonalesNoPatologicos', error)
    }
}

export const findAntecedentesPersonalesNoPatologicosByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentespersonalesnopatologicos/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        console.log('findAntecedentesPersonalesNoPatologicosByRangeDateAndSucursal', error)
        return error;
    }
}