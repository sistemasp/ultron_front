import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const showAllCuracionTipos = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curaciontipo`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllCuracionTipos', error);
        return error;
    }
}