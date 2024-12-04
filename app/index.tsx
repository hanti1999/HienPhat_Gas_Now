import * as SecureStore from 'expo-secure-store';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

const Page = () => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const isSignedin = await SecureStore.getItemAsync('accessToken');
      if (isSignedin != null) {
        return <Redirect href='/(root)/(tabs)/home' />;
      }
    };
    checkLoginStatus();
  }, []);

  return <Redirect href='/(auth)/sign-in' />;
};

export default Page;
