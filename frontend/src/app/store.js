import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/login/loginSlice";
import registerReducer from "../features/register/registerSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
  },
});

export default store;
