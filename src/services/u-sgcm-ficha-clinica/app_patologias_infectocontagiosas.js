import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// APP PATOLOGIAS INFECTOCONTAGIOSAS

export const createAppPatologiasInfectocontagiosas = async (appPatologiasInfectocontagiosas) => {
    try {
        const response = await axios({
            url: `${baseUrl}/apppatologiasinfectocontagiosas`,
            method: 'POST',
            data: appPatologiasInfectocontagiosas
        })
        return response
    } catch (error) {
        console.log('createAppPatologiasInfectocontagiosas', error)
    }
}

export const updateAppPatologiasInfectocontagiosas = async (idAppPatologiasInfectocontagiosas, appPatologiasInfectocontagiosas) => {
    try {
        const response = await axios({
            url: `${baseUrl}/apppatologiasinfectocontagiosas/${idAppPatologiasInfectocontagiosas}`,
            method: 'PUT',
            data: appPatologiasInfectocontagiosas
        })
        return response
    } catch (error) {
        console.log('updateAppPatologiasInfectocontagiosas', error)
    }
}