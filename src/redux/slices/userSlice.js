import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL_NETWORK;

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    // async function
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        userData
      );
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk asynchrone pour remettre à jour le pseudo
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (updatedProfileData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Envoi de la requête de mise à jour sans assigner `response`
      await axios.put(
        `${API_URL}/api/auth/updateUsername`,
        updatedProfileData,
        config
      );

      // Retourner le nouveau pseudo directement
      return { newUsername: updatedProfileData.newUsername };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du pseudo"
      );
    }
  }
);

// Cette fonction récupère les infos utilisateur à partir du token
export const fetchUserFromToken = createAsyncThunk(
  "user/fetchUserFromToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Ajoutez cette action pour récupérer le profil de l'utilisateur
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user; // Récupérer le token depuis l'état global

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter l'en-tête Authorization avec le token
        },
      };

      const response = await axios.get(`${API_URL}/api/auth/profile`, config);
      return response.data;
    } catch (error) {
      // Si l'appel API échoue, retourner l'erreur
      return rejectWithValue(
        error.response.data.message ||
          "Erreur lors de la récupération du profil"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user", // name of the slice
  initialState: {
    userInfo: null,
    token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
    isAuthenticated: false,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserFromToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserFromToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userInfo = {
          ...state.userInfo,
          username: action.payload.newUsername, // Assurez-vous d'utiliser `newUsername`
        };
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload; // Mettre à jour le profil complet de l'utilisateur
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.status = "loading";
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer; // export the reducer
