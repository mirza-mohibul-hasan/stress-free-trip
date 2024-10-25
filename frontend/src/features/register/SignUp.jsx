import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import registerImage from "../../assets/register.svg";
import { postUserData } from "./registerSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerState = useSelector((state) => state.register);
  const [error, setError] = useState(""); // State to store error message
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showAlert, setShowAlert] = useState(false); // For error alert
  const [alertMessage, setAlertMessage] = useState(""); // For the alert message

  useEffect(() => {
    if (registerState.error) {
      setAlertMessage(registerState.error); // Set the alert message from registerState
      setShowAlert(true); // Show alert when there's an error
      // Automatically dismiss alert after 5 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      // Cleanup timer if component unmounts or when alert is dismissed manually
      return () => clearTimeout(timer);
    }
  }, [registerState.error]); // Re-run this effect every time `registerState.error` changes

  useEffect(() => {
    if (registerState.success) {
      console.log("signup");
      navigate("/login");
    }
  }, [registerState.success]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear local error if user starts typing
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If passwords do not match, set local error
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Reset alert visibility before dispatching action
    setShowAlert(false);

    dispatch(postUserData(formData));
  };

  return (
    <div className="flex items-center justify-evenly min-h-[85vh]">
      <div className="max-w-md w-full space-y-5">
        <div>
          <h2 className="mt-5 text-center text-3xl font-extrabold text-blue-600">
            STRESS FREE TRIP
          </h2>
          <p className="text-center text-slate-400 ">
            A Tour Planner
            <br />
            can easy your life
          </p>
        </div>
        {/* Alert for errors */}
        {showAlert && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{alertMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <button
                onClick={() => setShowAlert(false)}
                className="text-red-700"
              >
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 5.652a.5.5 0 00-.707 0L10 9.293 6.354 5.646a.5.5 0 10-.707.708l3.646 3.646-3.646 3.646a.5.5 0 00.707.707L10 10.707l3.646 3.646a.5.5 0 00.707-.707L10.707 10l3.646-3.646a.5.5 0 000-.707z" />
                </svg>
              </button>
            </span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Type Your Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm Your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p> // Error message display
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-500">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center">
        <img
          src={registerImage}
          alt="Illustration"
          className="aspect-video w-[30rem] h-[30rem]"
        />
      </div>
    </div>
  );
};

export default SignUp;
