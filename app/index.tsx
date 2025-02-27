import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { Redirect } from 'expo-router';
import moment from 'moment';
import axios from 'axios';
import { loginSuccess, logout } from '@/redux/slices/authSlice';
import LoadingScreen from './(root)/loading-screen';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const checkLoginStatus = () => {
    try {
      const accessTokenExpiry = SecureStore.getItem('accessTokenExpiry');
      const expiryTime = parseInt(accessTokenExpiry as string);
      console.log(
        'Hết hạn : ' + moment.unix(expiryTime).format('DD/MM/YYYY HH:mm')
      );

      if (expiryTime) {
        if (expiryTime < moment().unix()) {
          const refreshToken = SecureStore.getItem('refreshToken');
          getNewToken(refreshToken);
        } else {
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error('Lỗi (index.tsx): ', error);
    }
  };

  const getNewToken = async (refreshToken: string | null) => {
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
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Lỗi lấy token mới: ', error);
      setIsLoggedIn(false);
      dispatch(logout());
      Toast.show({ type: 'info', text1: 'Phiên đăng nhập đã hết hạn' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (loading) {
    return <LoadingScreen showBack={false} />;
  }

  return (
    <>
      {isLoggedIn ? (
        <Redirect href='/(root)/(tabs)/home' />
      ) : (
        <Redirect href='/(auth)/sign-in' />
      )}
    </>
  );
};

export default Page;
