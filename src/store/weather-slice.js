import { createSlice } from "@reduxjs/toolkit";

const initialLat = localStorage.getItem("initialLat");
const initialLon = localStorage.getItem("initialLon");

const initialWeatherState = {
  weatherData: null,
  coordinates: {
    latitude: initialLat,
    longitude: initialLon,
  },
  moreInfo: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState: initialWeatherState,
  reducers: {
    loadWeatherData: (state, action) => {
      state.weatherData = action.payload;
      localStorage.setItem("weatherInfo", action.payload);
    },
    loadLocation: (state, action) => {
      state.coordinates = action.payload;
      // Saves previous coordinate to local storage to prevents data loss on reload
      localStorage.setItem("initialLat", action.payload.latitude);
      localStorage.setItem("initialLon", action.payload.longitude);
    },
    moreInfo: (state, action) => {
      state.moreInfo = action.payload;
      console.log(state.moreInfo);
    },
  },
});
export const weatherActions = weatherSlice.actions;
export default weatherSlice.reducer;
