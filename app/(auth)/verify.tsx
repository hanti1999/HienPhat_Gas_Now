import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams } from 'expo-router';
import {
  Text,
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import hpLogo from '@/assets/logoHp.png';

const Verify = () => {
  const { phone, name, address, password, otp } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const onVerify = async () => {
    if (code != otp) {
      console.log('object');
    }
    console.log(code);
  };
  return (
    <SafeAreaView className='bg-white flex-1'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='flex-1'>
          <View
            className='my-8 flex-row items-center justify-center'
            style={{ gap: 20 }}
          >
            <Image source={hpLogo} className='w-24 h-24' />
            <Text className='text-2xl text-primary-black font-RobotoMedium'>
              Đăng ký
            </Text>
          </View>
          <View className='p-5'>
            <Text className='text-center'>
              Vui lòng kiểm tra mã OTP được gửi đến Zalo {phone}
            </Text>
            <Link href={`https://zaloapp.com/`}>
              <Text className='text-blue-500 underline text-center text-lg'>
                Ấn để mở Zalo
              </Text>
            </Link>

            <InputField
              placeholder='Nhập mã xác minh'
              maxLength={6}
              keyboardType='numeric'
              value={code}
              textContentType='password'
              onChangeText={setCode}
            />
            <CustomButton
              title='Xác minh'
              onPress={onVerify}
              disabled={loading}
              loading={loading}
              className='mt-4'
            />
            <Link
              href={'/sign-in'}
              className='text-center mt-4 text-primary-black'
            >
              <Text>Quay về đăng nhập</Text>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Verify;
