import { TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import { Text, View, ScrollView } from 'react-native';
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

  const toggleShowPassword = () => {
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
              label='Điện thoại'
              placeholder='Nhập số điện thoại của bạn'
              keyboardType='numeric'
              icon='phone'
              value={form.phone}
              onChangeText={(value) => setForm({ ...form, phone: value })}
            />
            <InputField
              label='Mật khẩu'
              placeholder='Nhập mật khẩu của bạn'
              icon='lock'
              secureTextEntry={!showPassword}
              value={form.password}
              textContentType='password'
              onChangeText={(value) => setForm({ ...form, password: value })}
              children={
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color='gray'
                  onPress={toggleShowPassword}
                />
              }
            />
            <CustomButton
              onPress={onSignIn}
              title='Đăng nhập'
              className='mt-5'
              loading={loading}
              disabled={loading}
            />

            <Link
              href={'/sign-up'}
              className='text-lg text-center mt-5 text-primary-black'
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
