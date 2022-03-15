import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const showAllCuracionMotivos = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacionmotivo`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllCuracionMotivos', error);
        return error;
    }
}