import { TouchableWithoutFeedback, Keyboard, Text, Alert } from 'react-native';
import { View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Link, router } from 'expo-router';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import axios from 'axios';
import { loginSuccess } from '@/redux/slices/authSlice';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';
import { SigninData } from '@/types/type';

const SignIn = () => {
  const [form, setForm] = useState<SigninData>({
    phonenumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onSignIn = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/auth/login`;
      const data = {
        phonenumber: form.phonenumber,
        password: form.password,
      };
      const res = await axios.post(url, data);
      if (res.status === 200) {
        const accessToken = res?.data.accessToken;
        const refreshToken = res?.data.refreshToken;
        const accessTokenExpiry = res?.data.accessTokenExpiry;
        const refreshTokenExpiry = res?.data.refreshTokenExpiry;
        dispatch(
          loginSuccess({
            accessToken,
            refreshToken,
            accessTokenExpiry,
            refreshTokenExpiry,
          })
        );
        router.replace('/(root)/(tabs)/home');
      } else {
        if (res.status === 401) {
          Toast.show({ type: 'error', text1: 'Đăng nhập không thành công' });
          console.log(res);
        } else {
          Toast.show({ type: 'error', text1: 'Lỗi máy chủ' });
          console.log(res);
        }
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Đăng nhập không thành công' });
      console.error('Lỗi (Signin): ', error);
    } finally {
      setLoading(false);
    }
  };

  const onTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView className='flex-1 bg-white'>
      <StatusBar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <HeaderImage text='Đăng nhập' />
          <View className='p-5'>
            <InputField
              onChangeText={(value) => setForm({ ...form, phonenumber: value })}
              placeholder='Nhập số điện thoại của bạn'
              value={form.phonenumber}
              keyboardType='numeric'
              label='Điện thoại'
              icon='phone'
            />
            <InputField
              onChangeText={(value) => setForm({ ...form, password: value })}
              placeholder='Nhập mật khẩu của bạn'
              secureTextEntry={!showPassword}
              textContentType='password'
              value={form.password}
              label='Mật khẩu'
              icon='lock'
              children={
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  onPress={onTogglePassword}
                  color='gray'
                  size={24}
                />
              }
            />
            <View className='items-end'>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Thông báo', 'Mật khẩu mặc định là: 88888888');
                }}
              >
                <Text className='text-blue-500'>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            <CustomButton
              onPress={onSignIn}
              disabled={loading}
              loading={loading}
              title='Đăng nhập'
              className='mt-5'
            />
            <Link
              className='text-lg text-center mt-5 text-primary-black'
              href={'/sign-up'}
            >
              <Text>Chưa có tài khoản? </Text>
              <Text className='text-primary-pink'>Đăng ký ngay</Text>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default SignIn;
