import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {userApi} from "../api/userApi.js";
import uiReducer from "./uiSlice.js";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware),
});
setupListeners(store.dispatch);