import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: true,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = uiSlice.actions;
export default uiSlice.reducer;
