import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {
    onAddHotelRoom,
    onAddNewHotel,
    onDeleteHotel, onDeleteHotelRoom,
    onErrorMessage,
    onErrorRoomMessage,
    onLoadHotels,
    onSuccessMessage,
    onSuccessRoomMessage,
    onUpdateHotel,
    onUpdateHotelRoom,
    onViewHotel,
    resetRoomMessages
} from "../redux/hotelSlice.js";
import {handleApiResponse} from "../helpers/handleApiResponse";
import hotelApi from "../api/hotelAPI";

export const useHotelStore = () => {

    const dispatch = useDispatch();
    const {hotels = [], successRoomMessageTimestamp} = useSelector((state) => state.hotel || {}); // Manejo de errores
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [errorRoomMessage, setErrorRoomMessage] = useState("");
    const [successRoomMessage, setSuccessRoomMessage] = useState("");

    const startLoadingHotels = async (url = "/hotel?per_page=2&page=1") => {
        try {
            const apiInstance = hotelApi();
            const {data} = await apiInstance.get(url);

            const res = {
                data: data?.result.data || [],
                meta: data?.result.meta || {}
            };

            dispatch(onLoadHotels(res));

        } catch (e) {
            console.error(`Error: `, e);
            console.error("Error en ambos endpoints, no se pudo cargar el listado de hoteles.");
        }
    };

    // Seleccionar un ingreso específico por ID
    const startViewHotel = async (id: any) => {

        // Buscar el ingreso en el estado de Redux
        const existingData = hotels.find((item: { id: any; }) => item.id === id);

        if (existingData) {

            // Si el ingreso ya está en Redux, lo retorno
            dispatch(onViewHotel(existingData));
            return existingData;
        } else {

            // Si no está, buscar en el backend
            try {

                const apiInstance = hotelApi();
                const {data} = await apiInstance.get(`/hotel/${id}`);

                dispatch(onViewHotel(data.result));
                return data.result;

            } catch (error) {
                console.error("Error obteniendo el hotel:", error);
                return null;
            }
        }
    };

    const startLoadingHotelById = async (id: string) => {
        try {
            const apiInstance = hotelApi();
            const {data} = await apiInstance.get(`/hotel/${id}`);
            return data.result;
        } catch (error) {
            console.error('Error loading hotel details', error);
            throw error;
        }
    };

    const startSaving = async (id: string, item: object) => {

        const apiInstance = hotelApi();

        try {

            // Reseteo los mensajes
            dispatch(resetRoomMessages());

            let response;
            let message;

            if (!id) {

                // Crear nuevo registro
                response = await apiInstance.post('/hotel', item);
                message = handleApiResponse(response, 'create');

                // Dispatch para agregar nuevo hotel
                dispatch(onAddNewHotel(response.data.result));
            } else {

                // Actualizar registro existente
                response = await apiInstance.put(`/hotel/${id}`, item);
                message = handleApiResponse(response, 'update');

                console.log(message);

                // Dispatch para actualizar hotel
                dispatch(onUpdateHotel({
                    id,
                    ...response.data.result
                }));
            }

            // Mensajes de éxito
            setSuccessMessage(message);
            dispatch(onSuccessMessage(message));
            dispatch(onErrorMessage(undefined));

            return response.data.result;

        } catch (error) {
            const message = handleApiResponse(error, '');

            // Manejo de errores
            setErrorMessage(message);
            dispatch(onSuccessMessage(undefined));
            dispatch(onErrorMessage(message));

            throw error;
        }
    }

    const startDeleteHotel = async (id: string) => {

        try {

            // Reseteo los mensajes
            dispatch(resetRoomMessages());

            const apiInstance = hotelApi();

            const response = await apiInstance.delete(`/hotel/${id}`);
            const message = handleApiResponse(response, 'delete');

            setSuccessMessage(message);
            dispatch(onSuccessMessage(message));
            dispatch(onErrorMessage(undefined));

            // Actualizo el redux
            dispatch(onDeleteHotel(id));

            return message;

        } catch (error) {

            const message = handleApiResponse(error, 'delete');

            dispatch(onSuccessMessage(undefined));
            dispatch(onErrorMessage(message));

            return message;
        }
    }

    // Hotel Room, Crear/Actualizar
    const startSavingHotelRoom = async (hotelId: string, roomId: any, roomData: any) => {
        const apiInstance = hotelApi();

        try {

            // Reseteo los mensajes
            dispatch(resetRoomMessages());

            let response;
            let message;

            console.log(hotelId, roomId, roomData);

            // Verificar si es creación o actualización
            if (!roomData.id) {

                console.log("Data a crear !")
                console.log(roomData)

                // Crear nueva habitación
                response = await apiInstance.post(`/hotel-room`, roomData);
                message = handleApiResponse(response, 'create');

                // Dispatch para agregar nueva habitación
                dispatch(onAddHotelRoom(response.data.result));
            } else {

                // Actualizar habitación existente
                response = await apiInstance.put(`/hotel-room/${roomData.id}`, roomData);
                message = handleApiResponse(response, 'update');

                // Dispatch para actualizar habitación
                dispatch(onUpdateHotelRoom(response.data.result));
            }

            // Recargar los datos del hotel después de guardar/actualizar la habitación
            const updatedHotelData = await startLoadingHotelById(hotelId);
            dispatch(onViewHotel(updatedHotelData));

            // Mensajes de éxito
            setSuccessRoomMessage(message);
            dispatch(onSuccessRoomMessage(message));
            dispatch(onErrorRoomMessage(undefined));

            return response.data.result;

        } catch (error) {
            const message = handleApiResponse(error, '');

            // Manejo de errores
            setErrorRoomMessage(message);
            dispatch(onSuccessRoomMessage(undefined));
            dispatch(onErrorRoomMessage(message));

            throw error;
        }
    };

    // Hotel Room, Listar
    const startLoadingHotelRoomById = async (roomId: string) => {
        const apiInstance = hotelApi();

        try {

            // Reseteo los mensajes
            dispatch(resetRoomMessages());

            const response = await apiInstance.get(`/hotel-room/${roomId}`);
            return response.data.result;
        } catch (error) {
            console.error('Error cargando habitación', error);
            throw error;
        }
    };

    // Hotel Room, Eliminar
    const startDeleteHotelRoom = async (id: string) => {

        console.log("Room a eliminar; ", id)

        try {

            // Reseteo los mensajes
            dispatch(resetRoomMessages());

            const apiInstance = hotelApi();

            const response = await apiInstance.delete(`/hotel-room/${id}`);
            const message = handleApiResponse(response, 'delete');

            setSuccessMessage(message);
            dispatch(onSuccessMessage(message));
            dispatch(onErrorMessage(undefined));

            // Actualizo el redux
            dispatch(onDeleteHotelRoom(id));

            return message;

        } catch (error) {

            const message = handleApiResponse(error, 'delete');

            dispatch(onSuccessMessage(undefined));
            dispatch(onErrorMessage(message));

            return message;
        }
    }

    return {

        /* Propiedades */
        hotels,
        successMessage,
        errorMessage,
        successRoomMessage,
        errorRoomMessage,
        successRoomMessageTimestamp,

        /* Metodos */
        startLoadingHotels,
        startViewHotel,
        startLoadingHotelById,
        startSaving,
        startDeleteHotel,
        startSavingHotelRoom,
        startLoadingHotelRoomById,
        startDeleteHotelRoom,
    }
}