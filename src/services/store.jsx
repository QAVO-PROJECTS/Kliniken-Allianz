import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {userApi} from "./userApi.jsx";
import uiReducer from "./uiSlice.jsx";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware),
});
setupListeners(store.dispatch);