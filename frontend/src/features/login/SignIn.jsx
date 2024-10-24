import React, { useState } from "react";
import { Button, Input, Label } from "keep-react";
import { useDispatch, useSelector } from "react-redux";

import loginImage from "../../assets/login.svg";
import { Link } from "react-router-dom";
import { loginApi } from "./loginSlice";

function SignIn() {
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginApi(formData));
  };

  return (
    <div className="flex md:h-[30rem] md:flex-row">
      <div className="md:w-[50%] w-full flex items-center justify-center flex-col">
        <div>
          <h2 className="text-blue-500 font-extrabold text-3xl">
            STRESS FREE TRIP
          </h2>
          <p className="text-center text-slate-400 ">
            A Tour Planner
            <br />
            can easy your life
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex items-center justify-center flex-col gap-4 mt-5"
        >
          <fieldset className="w-[50%] space-y-1">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter Email"
              type="email"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </fieldset>
          <fieldset className="w-[50%] space-y-1">
            <Label htmlFor="password">Password*</Label>
            <Input
              id="password"
              name="password"
              placeholder="Type Your Password"
              type="password"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </fieldset>
          <Button className="w-[30%]" size="sm" color="primary" type="submit">
            Sign In
          </Button>
          <Link className="text-center text-slate-400" to="/register">
            New to Login?
          </Link>
        </form>
      </div>
      <div className="md:flex items-center justify-center hidden w-[50%]">
        <img src={loginImage} className="aspect-video w-[30rem] h-[30rem]" />
      </div>
    </div>
  );
}

export default SignIn;
