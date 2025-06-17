import Toast from 'react-native-toast-message';
import moment from 'moment';
import axios from 'axios';
import { loginAndSaveAuth, logoutAndClearAuth } from '@/redux/slices/authSlice';
import { dispatch } from '@/redux/store';
import { getValueFor } from './sercureStore';

const getNewToken = async () => {
  try {
    const refreshToken = await getValueFor('refreshToken');
    const url = `${process.env.EXPO_PUBLIC_API}/auth/refresh-token`;
    const data = {
      refreshToken: refreshToken,
    };
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
      Toast.show({ type: 'info', text1: 'Vui lòng thử lại lần nữa' });
    }
  } catch (error) {
    dispatch(logoutAndClearAuth());
    Toast.show({ type: 'info', text1: 'Phiên đăng nhập đã hết hạn' });
  }
};

export default getNewToken;
