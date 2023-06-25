import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// APP PATOLOGIAS EXANTEMATICAS

export const createAppPatologiasExantematicas = async (appPatologiasExantematicas) => {
    try {
        const response = await axios({
            url: `${baseUrl}/apppatologiasexantematicas`,
            method: 'POST',
            data: appPatologiasExantematicas
        })
        return response
    } catch (error) {
        console.log('createAppPatologiasExantematicas', error)
    }
}

export const updateAppPatologiasExantematicas = async (idAppPatologiasExantematicas, appPatologiasExantematicas) => {
    try {
        const response = await axios({
            url: `${baseUrl}/apppatologiasexantematicas/${idAppPatologiasExantematicas}`,
            method: 'PUT',
            data: appPatologiasExantematicas
        })
        return response
    } catch (error) {
        console.log('updateAppPatologiasExantematicas', error)
    }
}