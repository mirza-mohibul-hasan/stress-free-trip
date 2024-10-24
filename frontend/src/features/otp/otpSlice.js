import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { varifyAuth } from "../../utils/userUrl";

// Async action to verify OTP
export const verifyOtp = createAsyncThunk(
  "otp/verifyOtp",
  async ({ otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        varifyAuth,
        { otp },
        { withCredentials: true }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "An error occurred");
    }
  }
);

const otpSlice = createSlice({
  name: "otp",
  initialState: {
    error: null,
    success: false,
    loading: false,
  },
  reducers: {
    clearOtpError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg;
        state.success = false;
      });
  },
});

export const { clearOtpError } = otpSlice.actions;
export default otpSlice.reducer;
