import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text, SafeAreaView, ScrollView, Modal } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import PasswordValidate from '@/components/PasswordValidate';
import useGetZaloToken from '@/customHooks/useGetZaloToken';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';
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
      } else {
        Toast.show({ type: 'error', text1: res.data });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Đổi mật khẩu không thành công' });
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
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]}>
        <ScreenHeader text='Thay đổi mật khẩu' />
        <View className='p-3'>
          <InputField
            placeholder='Nhập mật khẩu hiện tại'
            secureTextEntry={!showPassword}
            onChangeText={setCurrentPass}
            textContentType='password'
            label='Mật khẩu hiện tại'
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
          <Link href={'/(root)/(tabs)/home'}>
            <Text className='text-blue-500 text-base'>Quên mật khẩu?</Text>
          </Link>
          <InputField
            secureTextEntry={!showPassword}
            placeholder='Nhập mật khẩu mới'
            textContentType='password'
            onChangeText={setNewPass}
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
            validationRules={[
              {
                key: 'MIN_LENGTH',
                ruleValue: 8,
                label: 'Tối thiểu 8 ký tự',
              },
              {
                key: 'MAX_LENGTH',
                ruleValue: 20,
                label: 'Tối đa 20 ký tự',
              },
              { key: 'PASSWORDS_MATCH', label: 'Mật khẩu trùng khớp' },
            ]}
            onPasswordValidateChange={(validatedBoolean) =>
              setValidated(validatedBoolean)
            }
          />
          <Modal
            visible={modalVisible}
            animationType='fade'
            transparent={true}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View
              style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
              className='flex-1 items-center justify-center'
            >
              <View className='p-2 rounded-xl bg-white'>
                <Text className='text-center mt-4 text-[16px]'>
                  Nhập OTP được gửi đến {account_phonenumber} để tiếp tục
                </Text>
                <OTPInputView
                  codeInputHighlightStyle={{ borderColor: '#fb77c5' }}
                  codeInputFieldStyle={styles.codeInputFieldStyle}
                  onCodeChanged={(code) => setCode(code)}
                  style={{ height: 100, width: '80%' }}
                  autoFocusOnLoad={false}
                  pinCount={6}
                  code={code}
                />
                <View className='flex-row justify-evenly'>
                  <TouchableOpacity
                    className='rounded-full w-32 h-10 justify-center border-primary-pink border'
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text className='text-center text-[16px]'>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='rounded-full w-32 h-10 justify-center bg-primary-pink border-primary-pink border'
                    disabled={confirmLoading}
                    onPress={handleConfirm}
                  >
                    {confirmLoading ? (
                      <ActivityIndicator />
                    ) : (
                      <Text className='text-center text-[16px] text-white'>
                        Xác minh
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
    </SafeAreaView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  codeInputFieldStyle: {
    borderRadius: 12,
    color: '#333',
    height: 50,
    fontSize: 16,
  },
});

const generateOTP = () => {
  const length = 6;
  const characters = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};
