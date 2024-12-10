import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text, SafeAreaView, ScrollView, Modal } from 'react-native';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import PasswordValidate from '@/components/PasswordValidate';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';
import { ZaloToken } from '@/types/type';

const Password = () => {
  const { token, account_phonenumber } = useLocalSearchParams();
  const nav = useNavigation();
  const [zaloToken, setToken] = useState<ZaloToken>({
    access_token: '',
    refresh_token: '',
  });
  const [currentPass, setCurrentPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getAccessToken = async () => {
    // lấy access token từ node server
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/zalo-tokens/031d43fe-b157-413d-8cf1-7f51d8c8bcd0`;
      const res = await axios.get(url);
      if (res.status === 200) {
        setToken({
          access_token: res.data.ztk_access_token,
          refresh_token: res.data.ztk_refresh_token,
        });
      } else {
        Toast.show({ type: 'error', text1: 'Lấy token không thành công' });
      }
    } catch (error) {
      console.error('Lấy token không thành công: ', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtp = async () => {
    // Lấy OTP từ Zalo
    const otp = generateOTP();
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
      const url = `${process.env.EXPO_PUBLIC_API}/zalo-tokens/031d43fe-b157-413d-8cf1-7f51d8c8bcd0`;
      const data = {
        accessToken: props.access_token,
        refreshToken: props.refresh_token,
        updateAt: Date.now(),
      };
      const res = await axios.put(url, data);
      if (res.status === 200) {
        getAccessToken();
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
        nav.goBack();
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
    getAccessToken();
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]} className='bg-gray-100 flex-1'>
        <ScreenHeader text='Thay đổi mật khẩu' />
        <View className='p-3 bg-white'>
          <InputField
            onChangeText={(text) => setCurrentPass(text)}
            value={currentPass}
            secureTextEntry={!showPassword}
            textContentType='password'
            label='Mật khẩu hiện tại'
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
            onChangeText={(text) => setNewPass(text)}
            value={newPass}
            secureTextEntry={!showPassword}
            textContentType='password'
            label='Mật khẩu mới'
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
            onChangeText={(text) => setConfirmPass(text)}
            value={confirmPass}
            secureTextEntry={!showPassword}
            textContentType='password'
            label='Xác nhận mật khẩu'
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
            newPassword={newPass}
            confirmPassword={confirmPass}
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
            animationType='fade'
            transparent={true}
            visible={modalVisible}
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
                  autoFocusOnLoad={false}
                  style={{ height: 100, width: '80%' }}
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

          <CustomButton
            onPress={handleChangePass}
            title='Đổi mật khẩu'
            disabled={loading}
            loading={loading}
            className='my-5'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Password;

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
