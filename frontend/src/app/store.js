import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/login/loginSlice";
import registerReducer from "../features/register/registerSlice";
import otpReducer from "../features/otp/otpSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    otp: otpReducer,
  },
});

export default store;
