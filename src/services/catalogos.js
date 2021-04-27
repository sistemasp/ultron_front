import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

// CATALOGOS 

export const showAllCatalogos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/catalogo`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllCatalogos', error);
    }
}
