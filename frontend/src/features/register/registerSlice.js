import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { registerUrl } from "./../../utils/userUrl";

const initialState = {
  loading: false,
  success: "",
  error: "",
};

export const postUserData = createAsyncThunk(
  "register/postUserData",
  async ({ email, password, name }, thunkApi) => {
    try {
      const response = await axios.post(registerUrl, { email, password, name });

      return response.data;
    } catch (e) {
      return thunkApi.rejectWithValue(e.response.data);
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(postUserData.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(postUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      if (action.payload.status === "success") {
        state.success = action.payload.msg;
        console.log("Success");
      }
    });

    builder.addCase(postUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.msg;
      state.success = "";
      console.log("Error");
    });
  },
});

export default registerSlice.reducer;
