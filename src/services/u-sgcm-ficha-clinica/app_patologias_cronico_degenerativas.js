import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// APP PATOLOGIAS CRONICO DEGENERATIVAS

export const createAppPatologiasCronicoDegenerativas = async (appPatologiasCronicoDegenerativas) => {
    try {
        const response = await axios({
            url: `${baseUrl}/apppatologiascronicodegenerativas`,
            method: 'POST',
            data: appPatologiasCronicoDegenerativas
        })
        return response
    } catch (error) {
        console.log('createAppPatologiasCronicoDegenerativas', error)
    }
}

export const updateAppPatologiasCronicoDegenerativas = async (idAppPatologiasCronicoDegenerativas, appPatologiasCronicoDegenerativas) => {
    try {
        const response = await axios({
            url: `${baseUrl}/apppatologiascronicodegenerativas/${idAppPatologiasCronicoDegenerativas}`,
            method: 'PUT',
            data: appPatologiasCronicoDegenerativas
        })
        return response
    } catch (error) {
        console.log('updateAppPatologiasCronicoDegenerativas', error)
    }
}