import { createSlice } from "@reduxjs/toolkit";
const getStoreUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user && user != "undefined" ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: getStoreUser(),
  token: localStorage.getItem("token") || null,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.token = action.payload?.token;
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload?.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
