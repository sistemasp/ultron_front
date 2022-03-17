import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const showAllCuracionAreas = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacionarea`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllCuracionAreas', error);
        return error;
    }
}