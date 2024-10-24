import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignIn from "./features/login/SignIn";
import NavbarComponent from "./components/NavbarComponent";
import SignUp from "./features/register/SignUp";
import OtpPage from "./features/otp/OtpPage";
import Home from "./features/home/Home";

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/email-confirmation" element={<OtpPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
