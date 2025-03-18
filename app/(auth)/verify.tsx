import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { OtpInput } from 'react-native-otp-entry';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import GoBack from '@/components/GoBack';

const Verify = () => {
  const { phonenumber, user_fullname, address_full, password, otp } =
    useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const handleVerify = async () => {
    if (code != otp) {
      Toast.show({ type: 'error', text1: 'Mã OTP không chính xác' });
      return;
    }

    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/register`;
      const data = {
        accounts: {
          phonenumber: phonenumber,
          password: password,
        },
        users: {
          user_fullname: user_fullname,
        },
        address: {
          address_full: address_full,
        },
      };

      const res = await axios.post(url, data);
      if (res.status === 201) {
        Toast.show({ type: 'success', text1: 'Đăng ký tài khoản thành công' });
        router.push('/(auth)/sign-in');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Đăng ký không thành công' });
      console.error('Lỗi (VerifyScreen): ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className='bg-white flex-1'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='flex'>
          <HeaderImage text='Xác minh OTP' />
          <View className='px-5 pb-5'>
            <GoBack />
            <Text className='text-center'>
              Vui lòng kiểm tra mã OTP được gửi đến Zalo {phonenumber}
            </Text>
            <Link href={`https://zaloapp.com/`}>
              <Text className='text-blue-500 underline text-center text-lg'>
                Mở Zalo
              </Text>
            </Link>
            <OtpInput
              numberOfDigits={6}
              focusColor={'#fb77c5'}
              autoFocus={false}
              onTextChange={setCode}
              type='numeric'
              theme={{
                pinCodeTextStyle: { fontSize: 20 },
                containerStyle: { marginTop: 10, marginBottom: 10 },
              }}
            />
            <CustomButton
              disabled={loading}
              onPress={handleVerify}
              loading={loading}
              title='Xác minh'
            />
            <Link
              href={'/sign-in'}
              className='text-center text-base mt-5 text-primary-black'
            >
              <Text>Quay về đăng nhập</Text>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default Verify;

const styles = StyleSheet.create({
  codeInputFieldStyle: {
    borderRadius: 12,
    color: '#333',
    height: 50,
    fontSize: 16,
  },
});
