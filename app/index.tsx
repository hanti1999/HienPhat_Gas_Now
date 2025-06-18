import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import moment from 'moment';
// import { usePushNotifications } from '@/customHooks/useGetPushNotiToken';
import { getValueFor } from '@/utils/sercureStore';
import getNewToken from '@/utils/getNewToken';

const Page = () => {
  // const { expoPushToken } = usePushNotifications();

  const checkLoginStatus = async () => {
    try {
      const ate = await getValueFor('accessTokenExpiry');
      const expiryTime = parseInt(ate as string);

      if (expiryTime) {
        if (expiryTime < moment().unix()) {
          console.log('Đã hết hạn, đang lấy token mới'); // remove log
          await getNewToken();
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return <Redirect href='/(root)/(tabs)/home' />;
};

export default Page;
