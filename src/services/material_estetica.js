import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

// MATERIALES ESTÉTICA

export const showMaterialEsteticasByProducto = async (productosIds) => {
    try {
        const response = await axios({
            url: `${baseUrl}/materialestetica/producto/${productosIds}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showMaterialEsteticasByProducto', error);
    }
}