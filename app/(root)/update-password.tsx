import { Link, router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import PasswordValidate from '@/components/PasswordValidate';
import useGetZaloToken from '@/customHooks/useGetZaloToken';
import validationRules from '@/constants/validationRules';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import generateOTP from '@/utils/generateOTP';
import { Ionicons } from '@expo/vector-icons';
import getNewToken from '@/utils/getNewToken';
import OTPModal from '@/components/OTPModal';
import { ZaloToken } from '@/types/type';

const UpdatePassword = () => {
  const { token, account_phonenumber } = useLocalSearchParams();
  const [currentPass, setCurrentPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { zaloToken, refetch } = useGetZaloToken();

  const getOtp = async () => {
    // Lấy OTP từ Zalo
    setLoading(true);
    const otp = generateOTP();
    setOtp(otp);
    const formatedPhone = (account_phonenumber as string).replace('0', '84');
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
      console.error('Access token hết hạn: ', res.data);
      await getNewZaloToken();
    } else {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: `${res.data.message} (${res.data.error})`,
      });
      console.error(`Lỗi: ${res.data.message} (${res.data.error})`);
    }
  };

  const getNewZaloToken = async () => {
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
      await updateNewTokenToNode(res.data);
    }
  };

  const updateNewTokenToNode = async (props: ZaloToken) => {
    try {
      setLoading(true);
      // Lưu access token lên node server cho người dùng sau
      const url = `${process.env.EXPO_PUBLIC_API}/zalo-tokens/${process.env.EXPO_PUBLIC_ZALO_ID}`;
      const data = {
        accessToken: props.access_token,
        refreshToken: props.refresh_token,
      };
      const res = await axios.put(url, data);
      if (res.status === 200) {
        refetch();
        Toast.show({ text1: 'Vui lòng thử lại lần nữa' });
      }
    } catch (error) {
      console.error('Cập nhật token mới không thành công', error);
      Toast.show({ type: 'error', text1: 'Vui lòng liên hệ bộ phận hỗ trợ' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePass = async () => {
    if (!validated) {
      Toast.show({ type: 'error', text1: 'Mật khẩu không hợp lệ' });
      return;
    }
    try {
      getOtp();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Đổi mật khẩu không thành công' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (code != otp) {
      Toast.show({ type: 'error', text1: 'Mã OTP không chính xác!' });
      return;
    }

    try {
      setConfirmLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/account/change-password`;
      const data = {
        oldPassword: currentPass,
        newPassword: newPass,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(url, data, config);
      if (res.status === 200) {
        Toast.show({ text1: 'Đổi mật khẩu thành công' });
        router.back();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        Toast.show({ type: 'error', text1: 'Đổi mật khẩu không thành công' });
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  const onTogglePassword = () => {
    setShowPassword(!showPassword);
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
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <StatusBar backgroundColor='#fb77c5' style='light' />
        <ScreenHeader text='Thay đổi mật khẩu' />
        <ScrollView className='bg-gray-100'>
          <View className='p-3 bg-white'>
            <InputField
              placeholder='Nhập mật khẩu hiện tại'
              secureTextEntry={!showPassword}
              onChangeText={setCurrentPass}
              textContentType='password'
              label='Mật khẩu hiện tại'
              autoCapitalize='none'
              value={currentPass}
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
            <Link href={'/(auth)/reset-password'}>
              <Text className='text-blue-500 text-base'>Quên mật khẩu?</Text>
            </Link>
            <InputField
              secureTextEntry={!showPassword}
              placeholder='Nhập mật khẩu mới'
              textContentType='password'
              onChangeText={setNewPass}
              autoCapitalize='none'
              label='Mật khẩu mới'
              value={newPass}
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
            <InputField
              secureTextEntry={!showPassword}
              placeholder='Xác nhận mật khẩu'
              onChangeText={setConfirmPass}
              textContentType='password'
              label='Xác nhận mật khẩu'
              value={confirmPass}
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
            <PasswordValidate
              confirmPassword={confirmPass}
              newPassword={newPass}
              validationRules={validationRules}
              onPasswordValidateChange={(validatedBoolean) =>
                setValidated(validatedBoolean)
              }
            />
            <OTPModal
              onClose={() => setModalVisible(false)}
              onConfirm={handleConfirm}
              onCodeChanged={setCode}
              modalVisible={modalVisible}
              phone={account_phonenumber}
              loading={confirmLoading}
            />
            {otpCountdown > 0 ? (
              <Text className='my-5'>Gửi lại sau {otpCountdown}s</Text>
            ) : (
              <CustomButton
                onPress={handleChangePass}
                title='Đổi mật khẩu'
                disabled={loading}
                loading={loading}
                className='my-5'
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdatePassword;
