import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL;

export const showAllCuracionNombres = async (token) => {
    try {
        const response = await axios({
            url: `${baseUrl}/curacionnombre`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.log('showAllCuracionNombres', error);
        return error;
    }
}