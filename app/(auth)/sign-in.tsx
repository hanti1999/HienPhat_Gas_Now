import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { Link, router } from 'expo-router';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { loginSuccess } from '@/redux/slices/authSlice';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';

interface SigninData {
  phonenumber: string;
  password: string;
}

const SignIn = () => {
  const [form, setForm] = useState<SigninData>({
    phonenumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/auth/login`;
      const data = {
        phonenumber: form.phonenumber,
        password: form.password,
      };
      const res = await axios.post(url, data);
      if (res.status === 200) {
        const at: string = res?.data.accessToken;
        const rt: string = res?.data.refreshToken;
        const ate: number = res?.data.accessTokenExpiry + moment().unix();
        const rte: number = res?.data.refreshTokenExpiry;
        dispatch(
          loginSuccess({
            accessToken: at,
            refreshToken: rt,
            accessTokenExpiry: ate.toString(),
            refreshTokenExpiry: rte.toString(),
          })
        );
        router.replace('/(root)/(tabs)/home');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        Toast.show({ type: 'error', text1: 'Tài khoản hoặc mật khẩu sai' });
      } else {
        Toast.show({ type: 'error', text1: 'Đăng nhập không thành công' });
        console.error('Lỗi (Signin): ', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const onTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView className='flex-1 bg-white'>
      <HeaderImage text='Đăng nhập' />
      <View className='px-5 pb-5'>
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
          autoCapitalize='none'
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
              router.push('/(auth)/reset-password');
            }}
          >
            <Text className='text-blue-500'>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
        <CustomButton
          onPress={handleSignIn}
          disabled={loading}
          loading={loading}
          title='Đăng nhập'
          className='mt-5'
        />
        <Text className='text-lg text-center mt-5 text-primary-black'>
          Chưa có tài khoản?
          <Link href={'/sign-up'}>
            <Text className='text-primary-pink'>Đăng ký ngay</Text>
          </Link>
        </Text>
        <Text className='text-lg text-center mt-1 text-primary-black'>
          Cần hỗ trợ?{' '}
          <Link href={'tel:0986359498'}>
            <Text className='text-primary-pink'>Gọi ngay</Text>
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
};

export default SignIn;
