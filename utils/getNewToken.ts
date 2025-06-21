import Toast from 'react-native-toast-message';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import { loginAndSaveAuth, logoutAndClearAuth } from '@/redux/slices/authSlice';
import { dispatch } from '@/redux/store';
import { getValueFor } from './sercureStore';

const getNewToken = async () => {
  const refreshToken = await getValueFor('refreshToken');

  if (!refreshToken) {
    dispatch(logoutAndClearAuth());
    Toast.show({ type: 'error', text1: 'Phiên đăng nhập không hợp lệ.' });
    return;
  }

  const url = `${process.env.EXPO_PUBLIC_API}/auth/refresh-token`;
  const data = {
    refreshToken: refreshToken,
  };
  try {
    const res = await axios.post(url, data);
    if (res.status === 200) {
      const at: string = res?.data.accessToken;
      const ate: number = res?.data.accessTokenExpiry + moment().unix();
      dispatch(
        loginAndSaveAuth({
          accessToken: at,
          accessTokenExpiry: ate.toString(),
          refreshToken: refreshToken as string,
        })
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        dispatch(logoutAndClearAuth());
        Toast.show({
          type: 'error',
          text1: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        });
      } else {
        Toast.show({ type: 'error', text1: 'Không thể kết nối đến máy chủ.' });
      }
    } else {
      dispatch(logoutAndClearAuth());
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra. Vui lòng đăng nhập lại.',
      });
    }
  }
};

export default getNewToken;
