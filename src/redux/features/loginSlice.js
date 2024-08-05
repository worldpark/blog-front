import {createSlice} from "@reduxjs/toolkit";

const initialStateValue = {
    userId: 'anonymous',
    auths: ['anonymous'],
    status: false
}

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        value: initialStateValue
    },
    reducers: {
        login: (state, action) => {
            state.value = action.payload
        },
        logout: (state) => {
            state.value = initialStateValue
        }
    }

});

export const {login, logout} = loginSlice.actions;
export default loginSlice.reducer;