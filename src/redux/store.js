import storage from 'redux-persist/lib/storage';
import counterReducer from './features/counterSlice';
import {configureStore} from "@reduxjs/toolkit";
import {persistStore} from "redux-persist";

const persistConfig = {
    key: 'root',
    storage
}

const persistReducer = persistReducer(persistConfig, counterReducer);

const store = configureStore({
    reducer: persistReducer,
});

const persistor = persistStore(store);

export {store, persistor};