import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// MATERIALES ESTÉTICA

export const showMaterialEsteticasByProducto = async (productosIds) => {
    console.log("KAOZ", productosIds === []);

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