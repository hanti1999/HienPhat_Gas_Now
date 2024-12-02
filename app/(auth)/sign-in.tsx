import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';
import { SigninData } from '@/types/type';
import hpLogo from '@/assets/logoHp.png';

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
    <SafeAreaView className='flex-1 bg-white'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='flex bg-white flex-col'>
          <View
            className='my-8 flex-row items-center justify-center'
            style={{ gap: 20 }}
          >
            <Image source={hpLogo} className='w-24 h-24' />
            <Text className='text-2xl text-primary-black font-RobotoMedium'>
              Đăng nhập
            </Text>
          </View>

          <View className='p-5'>
            <InputField
              label='Điện thoại'
              placeholder='Nhập số điện thoại của bạn'
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
              className='mt-6'
              loading={loading}
              disabled={loading}
            />

            <Link
              href={'/sign-up'}
              className='text-lg text-center mt-10 text-primary-black'
            >
              <Text>Chưa có tài khoản? </Text>
              <Text className='text-primary-pink'>Đăng ký ngay</Text>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignIn;
