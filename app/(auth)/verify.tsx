import { Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import { Link, useLocalSearchParams, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';

const Verify = () => {
  const { phonenumber, user_fullname, address_detail, password, otp } =
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
          address_detail: address_detail,
        },
      };

      const res = await axios.post(url, data);
      if (res.status === 201) {
        Toast.show({ type: 'success', text1: 'Đăng ký tài khoản thành công' });
        router.push('/(auth)/sign-in');
      } else {
        Toast.show({ type: 'error', text1: 'Đăng ký không thành công' });
        console.log(res);
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
      <StatusBar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='flex'>
          <HeaderImage text='Xác minh OTP' />
          <View className='p-5'>
            <Text className='text-center'>
              Vui lòng kiểm tra mã OTP được gửi đến Zalo {phonenumber}
            </Text>
            <Link href={`https://zaloapp.com/`}>
              <Text className='text-blue-500 underline text-center text-lg'>
                Mở Zalo
              </Text>
            </Link>
            <OTPInputView
              codeInputHighlightStyle={{ borderColor: '#fb77c5' }}
              codeInputFieldStyle={styles.codeInputFieldStyle}
              onCodeChanged={(code) => setCode(code)}
              autoFocusOnLoad={false}
              style={{ height: 120 }}
              pinCount={6}
              code={code}
            />
            <CustomButton
              disabled={loading}
              onPress={handleVerify}
              loading={loading}
              title='Xác minh'
            />
            <Link
              href={'/sign-in'}
              className='text-center text-lg mt-5 text-primary-black'
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
