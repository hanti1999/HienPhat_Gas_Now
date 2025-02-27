import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { loginSuccess, logout } from '@/redux/slices/authSlice';

const getNewToken = async () => {
  const dispatch = useDispatch();
  const [refreshLoading, setLoading] = useState<boolean>(false);
  const refreshToken = SecureStore.getItem('refreshToken');

  try {
    setLoading(true);
    const url = `${process.env.EXPO_PUBLIC_API}/auth/refresh-token`;
    const data = {
      refreshToken: refreshToken,
    };
    const res = await axios.post(url, data);
    if (res.status === 200) {
      const at: string = res?.data.accessToken;
      const ate: number = res?.data.accessTokenExpiry + moment().unix();
      dispatch(
        loginSuccess({
          accessToken: at,
          accessTokenExpiry: ate.toString(),
        })
      );
      Toast.show({ type: 'info', text1: 'Vui lòng thử lại lần nữa' });
    }
  } catch (error) {
    console.error('Lỗi lấy token mới: ', error);
    dispatch(logout());
    router.replace('/(auth)/sign-in');
    Toast.show({ type: 'info', text1: 'Phiên đăng nhập đã hết hạn' });
  } finally {
    setLoading(false);
  }

  return { refreshLoading };
};

export default getNewToken;
