import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// ALERGIAS
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
