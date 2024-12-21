import axios from "axios";
import {getEnvVariables} from "../helpers/getEnvVariables";

// Tomo las variables de entorno
const {
    VITE_API_BASE_URL_DEV,
    VITE_API_BASE_URL_PRD,
    VITE_APP_ENV
} = getEnvVariables();


// Función para crear la instancia de Axios con la URL seleccionada
const hotelApi = () => {

    let baseURL = VITE_API_BASE_URL_DEV;
    if (VITE_APP_ENV === 'production') {

        baseURL = VITE_API_BASE_URL_PRD;
    }

    return axios.create({
        baseURL,

    });
};

export default hotelApi;
