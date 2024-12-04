import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import React from 'react';
import CustomButton from '@/components/CustomButton';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { router } from 'expo-router';

const Home = () => {
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/sign-in');
  };
  return (
    <SafeAreaView>
      <Text>Home</Text>
      <CustomButton title='Đăng xuất' onPress={onLogout} />
    </SafeAreaView>
  );
};

export default Home;
