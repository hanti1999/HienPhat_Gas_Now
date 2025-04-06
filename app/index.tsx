import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import moment from 'moment';
import { usePushNotifications } from '@/customHooks/useGetPushNotiToken';
import getNewToken from '@/utils/getNewToken';

const Page = () => {
  const token = SecureStore.getItem('accessToken');
  const { expoPushToken } = usePushNotifications();

  const checkLoginStatus = () => {
    try {
      const accessTokenExpiry = SecureStore.getItem('accessTokenExpiry');
      const expiryTime = parseInt(accessTokenExpiry as string);

      if (expiryTime) {
        console.log(
          'Hết hạn : ' + moment.unix(expiryTime).format('DD/MM/YYYY HH:mm')
        );
        if (expiryTime < moment().unix()) {
          getNewToken();
        }
      }
    } catch (error) {
      console.error('Lỗi (index.tsx): ', error);
    }
  };

  useEffect(() => {
    if (token) {
      checkLoginStatus();
    }
  }, []);

  return (
    <>
      <Redirect href='/(root)/(tabs)/home' />
    </>
  );
};

export default Page;
