import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import weatherReducer from "./weather-slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
  },
});
