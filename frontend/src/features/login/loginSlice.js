import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { getToken, setToken } from "../../utils/useToken";
import { loginUrl } from "../../utils/userUrl";

const initialState = {
  error: "",
  loading: false,
  user: "",
  user_id: "",
  token: getToken(),
};

export const loginApi = createAsyncThunk(
  "login/api",
  async ({ email, password }, thunkApi) => {
    try {
      const response = await axios.post(loginUrl, { email, password });
      return response.data;
    } catch (error) {
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
    });

    builder.addCase(loginApi.fulfilled, (state, action) => {
      const data = action.payload;

      state.loading = false;
      state.error = "";
      if (data.status === "success") {
        state.user = data.data.user_email;
        state.token = `Bearer ${data.data.token}`;
        state.user_id = data.data.user_id;
        setToken(state.token);
      }
    });

    builder.addCase(loginApi.rejected, (state, action) => {
      state.error = action.payload?.msg;
      state.user = "";
      state.loading = false;
      state.user_id = "";
      state.token = "";
    });
  },
});

export default loginSlice.reducer;
