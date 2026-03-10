import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signin, signup, verifyAuthToken } from "../../services/api";

const initialToken = localStorage.getItem("magnet_token") || "";

const initialState = {
  token: initialToken,
  user: null,
  isVerified: false,
  isChecking: Boolean(initialToken),
  authLoading: false,
  error: ""
};

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return { token: "", user: null, isVerified: false };
    }

    try {
      const response = await verifyAuthToken(token);
      return { token, user: response.data?.user || null, isVerified: true };
    } catch (error) {
      return rejectWithValue(error.message || "Session verification failed");
    }
  }
);

export const signinUser = createAsyncThunk(
  "auth/signinUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await signin(payload);
      const token = response.data?.token || "";
      const verifyResponse = await verifyAuthToken(token);
      return {
        token,
        user: verifyResponse.data?.user || response.data?.user || null,
        message: response.message || "Signin successful"
      };
    } catch (error) {
      return rejectWithValue(error.message || "Signin failed");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await signup(payload);
      const token = response.data?.token || "";
      const verifyResponse = await verifyAuthToken(token);
      return {
        token,
        user: verifyResponse.data?.user || response.data?.user || null,
        message: response.message || "Signup successful"
      };
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = "";
      state.user = null;
      state.isVerified = false;
      state.isChecking = false;
      state.authLoading = false;
      state.error = "";
      localStorage.removeItem("magnet_token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isChecking = true;
        state.error = "";
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isVerified = action.payload.isVerified;
        state.isChecking = false;
        state.error = "";
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.token = "";
        state.user = null;
        state.isVerified = false;
        state.isChecking = false;
        state.error = action.payload || "Session verification failed";
        localStorage.removeItem("magnet_token");
      })
      .addCase(signinUser.pending, (state) => {
        state.authLoading = true;
        state.error = "";
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isVerified = true;
        state.error = "";
        localStorage.setItem("magnet_token", action.payload.token);
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload || "Signin failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.authLoading = true;
        state.error = "";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isVerified = true;
        state.error = "";
        localStorage.setItem("magnet_token", action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload || "Signup failed";
      });
  }
});

export const { logout } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthChecking = (state) => state.auth.isChecking;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token && state.auth.isVerified);
export default authSlice.reducer;
