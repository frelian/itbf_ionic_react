import {configureStore} from "@reduxjs/toolkit";
import {hotelSlice} from "./hotelSlice";

export const store = configureStore({
    reducer: {
        hotel: hotelSlice.reducer,
    }
});