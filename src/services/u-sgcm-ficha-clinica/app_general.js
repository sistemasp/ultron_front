import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// APP GENERAL

export const createAppGenerales = async (appGenerales) => {
    try {
        const response = await axios({
            url: `${baseUrl}/appgenerales`,
            method: 'POST',
            data: appGenerales
        })
        return response
    } catch (error) {
        console.log('createAppGenerales', error)
    }
}

export const updateAppGenerales = async (idAppGenerales, appGenerales) => {
    try {
        const response = await axios({
            url: `${baseUrl}/appgenerales/${idAppGenerales}`,
            method: 'PUT',
            data: appGenerales
        })
        return response
    } catch (error) {
        console.log('updateAppGenerales', error)
    }
}
