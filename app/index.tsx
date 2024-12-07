import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
// import { getValueFor } from '@/utils/sercureStore';
import * as SecureStore from 'expo-secure-store';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const isSignedin = await getValueFor('accessToken');
  //     console.log(isSignedin);
  //     if (isSignedin != '') {
  //       setIsLoggedIn(true);
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //     // setIsLoggedIn(!!isSignedin);
  //   };
  //   checkLoginStatus();
  // }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isSignedin = SecureStore.getItem('accessToken');
      if (isSignedin != null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
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
