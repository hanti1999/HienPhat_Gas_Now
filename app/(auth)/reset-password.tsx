import { TouchableWithoutFeedback, Text } from 'react-native';
import { View, ScrollView, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import axios from 'axios';
import useGetZaloToken from '@/customHooks/useGetZaloToken';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import InputField from '@/components/InputField';
import generateOTP from '@/utils/generateOTP';
import OTPModal from '@/components/OTPModal';
import { ZaloToken } from '@/types/type';

const ResetPassword = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | string[]>('');
  const [code, setCode] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpCountdown, setOtpCountdown] = useState<number>(0);

  const { zaloToken, refetch } = useGetZaloToken();

  const getOtp = async () => {
    // Lấy OTP từ Zalo
    const otp = generateOTP();
    setOtp(otp);
    const formatedPhone = (phoneNumber as string).replace('0', '84');
    const url = 'https://business.openapi.zalo.me/message/template';
    const data = {
      phone: formatedPhone,
      template_id: '353435',
      template_data: { otp: otp },
    };
    const config = {
      headers: { access_token: zaloToken.access_token },
    };
    const res = await axios.post(url, data, config);
    if (res.data.error === 0) {
      setLoading(false);
      setModalVisible(true);
      setOtpCountdown(30);
    } else if (res.data.error === -124) {
      console.error('Access token hết hạn', res.data);
      Toast.show({ type: 'info', text1: 'Vui lòng chờ trong giây lát' });
      getNewToken();
    } else {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: `${res.data.message} (${res.data.error})`,
      });
      console.error(`Lỗi: ${res.data.message} (${res.data.error})`);
    }
  };

  const getNewToken = async () => {
    // dùng refresh token để lấy access token mới từ server zalo
    setLoading(true);
    const zaloAppIdSecretKey = process.env.EXPO_PUBLIC_ZALO_APP_SECRET_KEY;
    const zaloAppId = process.env.EXPO_PUBLIC_ZALO_APP_ID as string;
    const url = 'https://oauth.zaloapp.com/v4/oa/access_token';
    const data = new URLSearchParams();
    data.append('refresh_token', zaloToken.refresh_token);
    data.append('app_id', zaloAppId);
    data.append('grant_type', 'refresh_token');
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        secret_key: zaloAppIdSecretKey,
      },
    };
    const res = await axios.post(url, data, config);
    if (res?.data.error < 0) {
      Toast.show({ type: 'error', text1: 'Vui lòng liên hệ bộ phận hỗ trợ' });
      console.error('Nhận token mới không thành công:', res?.data);
      setLoading(false);
      return;
    } else {
      console.log('Đã nhận token mới');
      updateNewTokenToNode(res.data);
    }
  };

  const updateNewTokenToNode = async (props: ZaloToken) => {
    try {
      setLoading(true);
      // Lưu access token lên node server cho người dùng sau
      const url = `${process.env.EXPO_PUBLIC_API}/zalo-tokens/b0455d2d-d138-46ad-b6c7-42aab30acf4b`;
      const data = {
        accessToken: props.access_token,
        refreshToken: props.refresh_token,
      };
      const res = await axios.put(url, data);
      if (res.status === 200) {
        refetch();
        Toast.show({ text1: 'Vui lòng thử lại lần nữa' });
      } else {
        console.error('Cập nhật token mới không thành công');
        Toast.show({ type: 'error', text1: 'Vui lòng liên hệ bộ phận hỗ trợ' });
      }
    } catch (error) {
      console.error('Cập nhật token mới không thành công', error);
      Toast.show({ type: 'error', text1: 'Vui lòng liên hệ bộ phận hỗ trợ' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (code != otp) {
      Toast.show({ type: 'error', text1: 'Mã OTP không chính xác!' });
      return;
    } else {
      setModalVisible(false);
      router.replace({
        pathname: '/(auth)/set-password',
        params: { phoneNumber: phoneNumber },
      });
    }
  };

  const handleSendOtp = async () => {
    getOtp();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    let interval: any;

    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown(otpCountdown - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [otpCountdown]);

  return (
    <ScrollView className='flex-1 bg-white'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <HeaderImage text='Lấy lại mật khẩu' />
          <View className='p-5'>
            <InputField
              label='Nhập số điện thoại cần lấy lại mật khẩu'
              placeholder='Nhập số điện thoại...'
              keyboardType='numeric'
              value={phoneNumber as string}
              onChangeText={setPhoneNumber}
            />
            {otpCountdown > 0 ? (
              <Text className='my-5'>Gửi lại sau {otpCountdown}s</Text>
            ) : (
              <CustomButton
                onPress={handleSendOtp}
                className='mt-5'
                title='Gửi mã xác nhận'
              />
            )}
            <OTPModal
              onClose={handleCloseModal}
              onConfirm={handleConfirm}
              onCodeChanged={setCode}
              modalVisible={modalVisible}
              phone={phoneNumber}
              loading={loading}
              code={code}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default ResetPassword;
