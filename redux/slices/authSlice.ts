import * as SecureStore from 'expo-secure-store';
import { createSlice } from '@reduxjs/toolkit';
import { AuthType } from '@/types/type';
import { save } from '@/utils/sercureStore';

const initialState: AuthType = {
  accessToken: SecureStore.getItem('accessToken')
    ? SecureStore.getItem('accessToken')
    : null,
  refreshToken: SecureStore.getItem('refreshToken')
    ? SecureStore.getItem('refreshToken')
    : null,
  accessTokenExpiry: SecureStore.getItem('accessTokenExpiry')
    ? SecureStore.getItem('accessTokenExpiry')
    : null,
  refreshTokenExpiry: SecureStore.getItem('refreshTokenExpiry')
    ? SecureStore.getItem('refreshTokenExpiry')
    : null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.accessTokenExpiry = action.payload.accessTokenExpiry;
      state.refreshTokenExpiry = action.payload.refreshTokenExpiry;
      save('accessToken', action.payload.accessToken);
      save('refreshToken', action.payload.refreshToken);
      save('accessTokenExpiry', action.payload.accessTokenExpiry);
      save('refreshTokenExpiry', action.payload.refreshTokenExpiry);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExpiry = null;
      state.refreshTokenExpiry = null;
      SecureStore.deleteItemAsync('accessToken');
      SecureStore.deleteItemAsync('refreshToken');
      SecureStore.deleteItemAsync('accessTokenExpiry');
      SecureStore.deleteItemAsync('refreshTokenExpiry');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
