import {createSlice} from "@reduxjs/toolkit";

export const hotelSlice = createSlice({
    name: 'hotel',
    initialState: {
        isLoadingHotels: true,
        hotels: [],
        links: [],
        errorMessage: undefined,
        successMessage: undefined,
        succesMessageTimestamp: 0,

        errorRoomMessage: undefined,
        successRoomMessage: undefined,
        successRoomMessageTimestamp: 0,

        hotelRooms: [],
    },
    reducers: {
        onSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
            state.successRoomMessageTimestamp = Date.now();
        },
        onErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },

        onSuccessRoomMessage: (state, action) => {
            state.successRoomMessage = action.payload;
            state.successRoomMessageTimestamp = Date.now();
        },
        onErrorRoomMessage: (state, action) => {
            state.errorRoomMessage = action.payload;
        },

        resetRoomMessages: (state) => {
            state.successRoomMessage = undefined;
            state.errorRoomMessage   = undefined;

            state.successMessage = undefined;
            state.errorMessage   = undefined;
        },

        onLoadHotels: (state, { payload }) => {
            state.isLoadingHotels = false;

            // Verifico que result y data existan en el payload
            if (payload.data && Array.isArray(payload.data)) {

                // Reemplazo el estado de hoteles con la nueva lista
                state.hotels = payload.data.filter(item => item.id);
            } else {
                console.warn("No se encontraron datos de hoteles");
            }

            // Si existen hoteles guardo
            if (payload.meta?.total) {
                state.totalHotels = payload.meta.total;
            }
        },

        onViewHotel: (state, action) => {

            const dataIndex    = state.hotels.findIndex(item => item.id === action.payload.id);

            // Si el hotel ya existe, se actualiza sii no, se agrega
            if (dataIndex >= 0) {
                state.hotels[dataIndex] = action.payload;
            } else {
                state.hotels.push(action.payload);
            }

            state.isLoadingHotels = false;
        },

        onAddNewHotel: (state, action) => {
            state.hotels.push(action.payload);
        },

        onUpdateHotel: (state, {payload}) => {

            state.hotels = state.hotels.map(item => {
                if (item.id === payload.id) {
                    return payload;
                }
                return item;
            });
        },

        onDeleteHotel: (state, {payload}) => {
            state.hotels = state.hotels.filter(item => item.id !== payload);
        },

        // Nuevos reducers para hotel-rooms
        onAddHotelRoom: (state, action) => {
            const hotelIndex = state.hotels.findIndex(hotel => hotel.id === action.payload.hotel_id);

            if (hotelIndex !== -1) {

                // Si el hotel existe, limpio o agrego
                if (!state.hotels[hotelIndex].rooms) {
                    state.hotels[hotelIndex].rooms = [];
                }
                state.hotels[hotelIndex].rooms.push(action.payload);
            }

            // Lista de las habitaciones
            state.hotelRooms.push(action.payload);
        },

        onUpdateHotelRoom: (state, action) => {

            // Actualizar en la lista de habitaciones
            state.hotelRooms = state.hotelRooms.map(room =>
                room.id === action.payload.id ? action.payload : room
            );

            // Actualizar en el hotel correspondiente
            const hotelIndex = state.hotels.findIndex(hotel => hotel.id === action.payload.hotel_id);
            if (hotelIndex !== -1 && state.hotels[hotelIndex].rooms) {
                state.hotels[hotelIndex].rooms = state.hotels[hotelIndex].rooms.map(room =>
                    room.id === action.payload.id ? action.payload : room
                );
            }
        },

        onDeleteHotelRoom: (state, action) => {

            // Eliminar de la lista de rooms
            state.hotelRooms = state.hotelRooms.filter(room => room.id !== action.payload.id);

            // Eliminar del hotel correspondiente
            const hotelIndex = state.hotels.findIndex(hotel => hotel.id === action.payload.hotel_id);
            if (hotelIndex !== -1 && state.hotels[hotelIndex].rooms) {
                state.hotels[hotelIndex].rooms = state.hotels[hotelIndex].rooms.filter(
                    room => room.id !== action.payload.id
                );
            }
        },

    },
});

export const {
    onSuccessMessage,
    onErrorMessage,
    onSuccessRoomMessage,
    onErrorRoomMessage,
    resetRoomMessages,

    onLoadHotels,
    onViewHotel,
    onAddNewHotel,
    onUpdateHotel,
    onDeleteHotel,

    // Nuevas acciones para hotel-rooms
    onAddHotelRoom,
    onUpdateHotelRoom,
    onDeleteHotelRoom,
} = hotelSlice.actions;