import * as SecureStore from 'expo-secure-store';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const isSignedin = await SecureStore.getItemAsync('token');
      if (isSignedin != null) {
        console.log('Redirected');
        return <Redirect href='/(root)/(tabs)/home' />;
      }
    };
    checkLoginStatus();
  }, []);

  return <Redirect href='/(auth)/sign-in' />;
};

export default Home;
