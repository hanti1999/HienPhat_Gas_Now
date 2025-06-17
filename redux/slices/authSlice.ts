import * as SecureStore from 'expo-secure-store';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthType, AuthPayload } from '@/types/type';

const initialState: AuthType = {
  accessToken: SecureStore.getItem('accessToken') || null,
  refreshToken: SecureStore.getItem('refreshToken') || null,
  accessTokenExpiry: SecureStore.getItem('accessTokenExpiry') || null,
};

export const loginAndSaveAuth = createAsyncThunk(
  'auth/loginAndSave',
  async (payload: AuthPayload, { dispatch }) => {
    try {
      await SecureStore.setItemAsync('accessToken', payload.accessToken);
      await SecureStore.setItemAsync('refreshToken', payload.refreshToken);
      await SecureStore.setItemAsync(
        'accessTokenExpiry',
        payload.accessTokenExpiry
      );

      dispatch(authSlice.actions.loginSuccess(payload));

      return payload;
    } catch (error) {
      console.error('Lỗi khi lưu thông tin đăng nhập vào SecureStore:', error);
      throw error;
    }
  }
);

export const logoutAndClearAuth = createAsyncThunk(
  'auth/logoutAndClear',
  async (_, { dispatch }) => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('accessTokenExpiry');

      dispatch(authSlice.actions.logout());

      return true;
    } catch (error) {
      console.error('Lỗi khi xóa thông tin đăng xuất khỏi SecureStore:', error);
      throw error;
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.accessTokenExpiry = action.payload.accessTokenExpiry;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExpiry = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
