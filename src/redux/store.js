import {configureStore} from "@reduxjs/toolkit";
import loginReducer from "./features/loginSlice";
import serverURLSlice from "./features/serverURLSlice";

export const store = configureStore({
    reducer:{
        loginInfo: loginReducer,
        serverUrl: serverURLSlice
    }
});