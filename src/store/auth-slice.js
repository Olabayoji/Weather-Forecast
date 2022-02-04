import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token");
const autoLogoutTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const expireTime = new Date(expirationTime).getTime();
  const remainingDuration = expireTime - currentTime;
  return remainingDuration;
};
const initialAuthState = {
  loginToken: initialToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logOut: (state) => {
      state.loginToken = null;
      localStorage.removeItem("token");
      console.log("log");
    },
    logIn: (state, action) => {
      state.loginToken = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      const logOutTime = autoLogoutTime(action.payload.expire);
      console.log(logOutTime);
      const logOut = () => {
        localStorage.removeItem("token");
      };
      // Automatically logout user after token expires
      setTimeout(logOut, logOutTime);
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;
