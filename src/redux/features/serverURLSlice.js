import {createSlice} from "@reduxjs/toolkit";


const initialValue = {
    url: 'http://localhost:8080'
}

export const serverURLSlice = createSlice({
    name: 'serverURL',
    initialState: {
        value: initialValue
    }
})

export default serverURLSlice.reducer;