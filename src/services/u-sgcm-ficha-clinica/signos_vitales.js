import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// ALERGIAS
export const showAllSignosVitales = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/signosvitales`,
            method: 'GET'
        })
        return response
    } catch (error) {
        console.log('showAllSignosVitales', error)
    }
}

export const createSignosVitales = async (signosVitales) => {
    try {
        const response = await axios({
            url: `${baseUrl}/signosvitales`,
            method: 'POST',
            data: signosVitales
        })
        return response
    } catch (error) {
        console.log('createSignosVitales', error)
    }
}

export const updateSignosVitales = async (idSignosVitales, signosVitales) => {
    try {
        const response = await axios({
            url: `${baseUrl}/signosvitales/${idSignosVitales}`,
            method: 'PUT',
            data: signosVitales
        })
        return response
    } catch (error) {
        console.log('updateSignosVitales', error)
    }
}
