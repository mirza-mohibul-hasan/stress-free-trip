import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import OtpInput from "./OtpInput"; // Import the OTP component
import { verifyOtp, clearOtpError } from "./otpSlice"; // Redux actions
import { useNavigate } from "react-router-dom";

const OtpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpState = useSelector((state) => state.otp);
  const [showAlert, setShowAlert] = useState(false); // For error alert
  const [alertMessage, setAlertMessage] = useState(""); // For the alert message

  // Handle OTP submission
  const handleOtpSubmit = (otp) => {
    dispatch(verifyOtp({ otp })); // Dispatch action to verify OTP
  };

  // Handle error display based on Redux state
  useEffect(() => {
    if (otpState.error) {
      setAlertMessage(otpState.error); // Set the alert message from Redux state
      setShowAlert(true); // Show alert when there's an error

      // Automatically dismiss alert after 5 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
        dispatch(clearOtpError()); // Clear error after alert disappears
      }, 5000);

      // Cleanup timer if component unmounts or when alert is dismissed manually
      return () => clearTimeout(timer);
    }
  }, [otpState.error]);

  useEffect(() => {
    if (otpState.success) {
      console.log("otp");
      navigate("/");
    }
  }, [otpState.success]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <h2 className="text-2xl text-center font-bold">Enter OTP</h2>

        {/* Error Alert */}
        {showAlert && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{alertMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <button
                onClick={() => {
                  setShowAlert(false);
                  dispatch(clearOtpError());
                }}
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

        <OtpInput length={4} onSubmit={handleOtpSubmit} />
      </div>
    </div>
  );
};

export default OtpPage;
