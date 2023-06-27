import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// APP SIGNOS VITALES

export const createAppSignosVitales = async (appSignosVitales) => {
    try {
        const response = await axios({
            url: `${baseUrl}/signosvitales`,
            method: 'POST',
            data: appSignosVitales
        })
        return response
    } catch (error) {
        console.log('createAppSignosVitales', error)
    }
}

export const updateAppSignosVitales = async (idAppSignosVitales, appSignosVitales) => {
    try {
        const response = await axios({
            url: `${baseUrl}/signosvitales/${idAppSignosVitales}`,
            method: 'PUT',
            data: appSignosVitales
        })
        return response
    } catch (error) {
        console.log('updateAppSignosVitales', error)
    }
}
