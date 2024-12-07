import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { getValueFor } from '@/utils/sercureStore';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isSignedin = getValueFor('accessToken');
      setIsLoggedIn(!!isSignedin);
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
