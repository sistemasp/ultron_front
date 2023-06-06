import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// ALERGIAS
export const showAllAntecedentesPersonalesPatologicos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentespersonalespatologicos`,
            method: 'GET'
        })
        return response
    } catch (error) {
        console.log('showAllAntecedentesPersonalesPatologicos', error)
    }
}

export const createAntecedentesPersonalesPatologicos = async (antecedentesPersonalesPatologicos) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentespersonalespatologicos`,
            method: 'POST',
            data: antecedentesPersonalesPatologicos
        })
        return response
    } catch (error) {
        console.log('createAntecedentesPersonalesPatologicos', error)
    }
}

export const updateAntecedentesPersonalesPatologicos = async (idAntecedentesPersonalesPatologicos, antecedentesPersonalesPatologicos) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentespersonalespatologicos/${idAntecedentesPersonalesPatologicos}`,
            method: 'PUT',
            data: antecedentesPersonalesPatologicos
        })
        return response
    } catch (error) {
        console.log('updateAntecedentesPersonalesPatologicos', error)
    }
}

export const findAntecedentesPersonalesPatologicosByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentespersonalespatologicos/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        console.log('findAntecedentesPersonalesPatologicosByRangeDateAndSucursal', error)
        return error;
    }
}