import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { getToken, setToken } from "../../utils/useToken";
import { loginUrl } from "../../utils/userUrl";

const initialState = {
  error: "",
  loading: false,
  token: getToken(),
};

export const loginApi = createAsyncThunk(
  "login/api",
  async ({ email, password }, thunkApi) => {
    try {
      const response = await axios.post(loginUrl, { email, password });
      return response.data;
    } catch (error) {
      console.log(error.response);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(loginApi.pending, (state) => {
      state.loading = true;
      console.log("loading");
    });

    builder.addCase(loginApi.fulfilled, (state, action) => {
      const data = action.payload;

      state.loading = false;
      state.error = "";
      if (data.status === "success") {
        state.token = `Bearer ${data.data.token}`;
        setToken(state.token);
      }
    });

    builder.addCase(loginApi.rejected, (state, action) => {
      state.error = action.payload?.msg;
      state.loading = false;
      state.token = "";
      console.log(action.payload);
    });
  },
});

export default loginSlice.reducer;
