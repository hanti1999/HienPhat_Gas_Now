import { KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { View, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import axios from 'axios';
import PasswordValidate from '@/components/PasswordValidate';
import validationRules from '@/constants/validationRules';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import { logout } from '@/redux/slices/authSlice';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';
import GoBack from '@/components/GoBack';

const SetPassword = () => {
  const { phoneNumber } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');

  const onTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSetPassword = async () => {
    if (!validated) {
      Toast.show({ type: 'error', text1: 'Mật khẩu không hợp lệ' });
      return;
    }

    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/account/reset-password`;
      const data = {
        phonenumber: phoneNumber,
        newPassword: newPass,
      };
      const res = await axios.put(url, data);
      if (res.status === 200) {
        dispatch(logout());
        Toast.show({ type: 'success', text1: 'Đổi mật khẩu thành công' });
        router.replace('/(auth)/sign-in');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Đổi mật khẩu không thành công' });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1'
    >
      <ScrollView className='flex-1 bg-white'>
        <StatusBar style='light' />
        <HeaderImage text='Lấy lại mật khẩu' />
        <View className='px-5 pb-5'>
          <GoBack />
          <InputField
            placeholder='Nhập mật khẩu mới...'
            secureTextEntry={!showPassword}
            textContentType='password'
            label='Nhập mật khẩu mới'
            onChangeText={setNewPass}
            autoCapitalize='none'
            value={newPass}
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={onTogglePassword}
                color='gray'
                size={24}
              />
            }
          />
          <InputField
            placeholder='Nhập lại mật khẩu...'
            secureTextEntry={!showPassword}
            onChangeText={setConfirmPass}
            textContentType='password'
            label='Nhập lại mật khẩu'
            autoCapitalize='none'
            value={confirmPass}
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={onTogglePassword}
                color='gray'
                size={24}
              />
            }
          />
          <PasswordValidate
            confirmPassword={confirmPass}
            newPassword={newPass}
            validationRules={validationRules}
            onPasswordValidateChange={(validatedBoolean) =>
              setValidated(validatedBoolean)
            }
          />
          <CustomButton
            title='Xác nhận mật khẩu mới'
            onPress={handleSetPassword}
            loading={loading}
            className='mt-5'
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SetPassword;
