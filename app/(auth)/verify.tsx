import { Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { Link, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';

const Verify = () => {
  const { phone, name, address, password, otp } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const onVerify = async () => {
    if (code != otp) {
      Toast.show({ type: 'error', text1: 'Mã OTP không chính xác' });
      return;
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
              Vui lòng kiểm tra mã OTP được gửi đến Zalo {phone}
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
              onPress={onVerify}
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
