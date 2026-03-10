import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyProfile, updateMyProfile } from "../../services/api";

const initialState = {
  user: null,
  status: "idle",
  error: "",
  isEditing: false,
  updateStatus: "idle",
  updateError: ""
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await getMyProfile(token);
      return response.data || null;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ token, payload }, { rejectWithValue }) => {
    try {
      const response = await updateMyProfile(token, payload);
      return response.data || null;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileEditing: (state, action) => {
      state.isEditing = action.payload;
      if (action.payload) {
        state.updateStatus = "idle";
        state.updateError = "";
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = "";
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateError = "";
        state.user = action.payload;
        state.isEditing = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update profile";
      });
  }
});

export const selectProfileUser = (state) => state.profile.user;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileError = (state) => state.profile.error;
export const selectProfileIsEditing = (state) => state.profile.isEditing;
export const selectProfileUpdateStatus = (state) => state.profile.updateStatus;
export const selectProfileUpdateError = (state) => state.profile.updateError;

export const { setProfileEditing } = profileSlice.actions;

export default profileSlice.reducer;
