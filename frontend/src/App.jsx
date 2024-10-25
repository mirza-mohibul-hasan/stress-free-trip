import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignIn from "./features/login/SignIn";
import NavbarComponent from "./components/NavbarComponent";
import SignUp from "./features/register/SignUp";
import Home from "./features/home/Home";
import Itinerary from "./features/home/Itinerary";

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
