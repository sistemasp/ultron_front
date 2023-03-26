import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

//  ANALISIS MEDICOS

export const showAllAnalisisMedico = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/analisismedico`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllAnalisisMedico', error);
    }
}

export const showAllAnalisisMedicoVisibles = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/analisismedico/visibles`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllAnalisisMedicoVisibles', error);
    }
}