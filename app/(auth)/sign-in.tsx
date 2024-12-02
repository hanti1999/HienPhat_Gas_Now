import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, View, ScrollView, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';
import { SigninData } from '@/types/type';

const SignIn = () => {
  const [form, setForm] = useState<SigninData>({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSignIn = async () => {};

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
              onChangeText={(value) => setForm({ ...form, phone: value })}
              placeholder='Nhập số điện thoại của bạn'
              keyboardType='numeric'
              value={form.phone}
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
                  size={24}
                  color='gray'
                  onPress={onTogglePassword}
                />
              }
            />
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
