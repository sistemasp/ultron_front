import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// ALERGIAS
export const showAllAntecedentesHeredofamiliares = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentesheredofamiliares`,
            method: 'GET'
        })
        return response
    } catch (error) {
        console.log('showAllAntecedentesHeredofamiliares', error)
    }
}

export const createAntecedentesHeredofamiliares = async (antecedentesHeredofamiliares) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentesheredofamiliares`,
            method: 'POST',
            data: antecedentesHeredofamiliares
        })
        return response
    } catch (error) {
        console.log('createAntecedentesHeredofamiliares', error)
    }
}

export const updateAntecedentesHeredofamiliares = async (idAntecedentesHeredofamiliares, antecedentesHeredofamiliares) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentesheredofamiliares/${idAntecedentesHeredofamiliares}`,
            method: 'PUT',
            data: antecedentesHeredofamiliares
        })
        return response
    } catch (error) {
        console.log('updateAntecedentesHeredofamiliares', error)
    }
}

export const findAntecedentesHeredofamiliaresByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/antecedentesheredofamiliares/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        console.log('findAntecedentesHeredofamiliaresByRangeDateAndSucursal', error)
        return error;
    }
}