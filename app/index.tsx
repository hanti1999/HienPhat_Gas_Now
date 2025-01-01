import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { Redirect } from 'expo-router';
import { logout } from '@/redux/slices/authSlice';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const accessTokenExpiry = SecureStore.getItem('accessTokenExpiry');
        const expiryTime = parseInt(accessTokenExpiry as string);

        if (expiryTime) {
          if (expiryTime < Date.now()) {
            setIsLoggedIn(false);
            dispatch(logout());
            Toast.show({ type: 'info', text1: 'Phiên đăng nhập đã hết hạn' });
          } else {
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Lỗi (index.tsx): ', error);
      }
    };
    checkLoginStatus();
  }, []);

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
