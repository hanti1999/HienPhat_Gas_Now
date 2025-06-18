import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { loginAndSaveAuth, logoutAndClearAuth } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import { getValueFor } from './sercureStore';

const getNewToken = async () => {
  console.log('Hàm getNewToken đang hoạt động'); // remove log
  const dispatch: AppDispatch = useDispatch();
  const refreshToken = await getValueFor('refreshToken');
  const url = `${process.env.EXPO_PUBLIC_API}/auth/refresh-token`;
  const data = {
    refreshToken: refreshToken,
  };
  try {
    const res = await axios.post(url, data);
    console.log(res.status); // remove log
    if (res.status === 200) {
      console.log('Đã cấp token mới'); // remove log
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
