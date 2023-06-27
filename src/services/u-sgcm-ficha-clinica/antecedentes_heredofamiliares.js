import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_U_SGCM_FICHA_CLINICA;

// ANTECEDENTES HEREDOFAMILIARES

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
