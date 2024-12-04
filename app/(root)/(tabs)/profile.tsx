import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { Text } from 'react-native';
import React from 'react';
import CustomButton from '@/components/CustomButton';
import { logout } from '@/redux/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/sign-in');
  };
  return (
    <SafeAreaView>
      <CustomButton title='Đăng xuất' onPress={onLogout} />
    </SafeAreaView>
  );
};

export default Profile;
