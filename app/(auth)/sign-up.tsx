import { TouchableOpacity, StatusBar } from 'react-native';
import { Text, ScrollView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Link, router } from 'expo-router';
import * as Location from 'expo-location';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from '@/components/CustomButton';
import { ZaloToken, SignupData } from '@/types/type';
import HeaderImage from '@/components/HeaderImage';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
  const [form, setForm] = useState<SignupData>({
    name: '',
    phone: '',
    address: '',
    password: '88888888',
    confirmPass: '88888888',
  });
  const [token, setToken] = useState<ZaloToken>({
    access_token: '',
    refresh_token: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const url = process.env.EXPO_PUBLIC_API;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getAccessToken = async () => {
    // lấy access token từ node server
    try {
      setLoading(true);
      const res = await axios.get(`${url}/token`);
      if (res.status === 200) {
        setToken(res.data.token[0]);
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
    const formatedPhone = form.phone.replace('0', '84');
    const url = 'https://business.openapi.zalo.me/message/template';
    const data = {
      phone: formatedPhone,
      template_id: '353435',
      template_data: { otp: otp },
    };
    const config = {
      headers: { access_token: token.access_token },
    };
    const res = await axios.post(url, data, config);
    if (res.data.error === 0) {
      setLoading(false);
      console.log('Gửi OTP thành công:', otp);
      router.push({
        pathname: '/(auth)/verify',
        params: { ...form, otp },
      });
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
    const zaloAppIdSecretKey = process.env.ZALO_APP_SECRET_KEY;
    const zaloAppId = process.env.ZALO_APP_ID as string;
    const url = 'https://oauth.zaloapp.com/v4/oa/access_token';
    const data = new URLSearchParams();
    data.append('refresh_token', token.refresh_token);
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
      const url = `api/token/update/66adeb7e4a83ea4165473167`;
      const data = {
        access_token: props.access_token,
        refresh_token: props.refresh_token,
        updateAt: Date.now(),
      };
      const res = await axios.patch(url, data);
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

  const onSignUp = async () => {
    if (form.password != form.confirmPass) {
      Toast.show({ type: 'error', text1: 'Mật khẩu không giống nhau' });
      return;
    }
    if (form.address === '') {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập địa chỉ' });
      return;
    }
    if (form.password.length < 8) {
      Toast.show({ type: 'error', text1: 'Mật khẩu tối thiểu 8 ký tự' });
      return;
    }

    try {
      getOtp();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Đăng ký không thành công' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.error('Người dùng từ chối quyền truy cập');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});

    let reverseGeocode = await Location.reverseGeocodeAsync({
      longitude: currentLocation.coords.longitude,
      latitude: currentLocation.coords.latitude,
    });

    if (reverseGeocode[0]?.formattedAddress === undefined) {
      setForm({
        ...form,
        address: `${reverseGeocode[0]?.name}, ${reverseGeocode[0]?.street}, ${reverseGeocode[0]?.subregion}, ${reverseGeocode[0]?.region}`,
      });
    } else {
      setForm({
        ...form,
        address: `${reverseGeocode[0]?.formattedAddress}`,
      });
    }
  };

  // useEffect(() => {
  //   getAccessToken();
  // }, []);

  return (
    <ScrollView className='flex-1 bg-white'>
      <StatusBar />
      <View>
        <HeaderImage text='Đăng ký' />
        <View className='p-5'>
          <InputField
            onChangeText={(value) => setForm({ ...form, phone: value })}
            placeholder='Nhập số điện thoại của bạn'
            keyboardType='numeric'
            value={form.phone}
            label='Điện thoại'
            icon='phone'
          />
          <InputField
            onChangeText={(value) => setForm({ ...form, name: value })}
            placeholder='Nhập tên của bạn'
            value={form.name}
            label='Tên'
            icon='user'
          />
          <InputField
            onChangeText={(value) => setForm({ ...form, address: value })}
            placeholder='Nhập địa chỉ của bạn'
            value={form.address}
            label='Địa chỉ'
            icon='home'
            children={
              <TouchableOpacity
                className='border border-gray-300 rounded-full p-1 flex flex-row items-center'
                onPress={onGetLocation}
              >
                <Text className='text-[12px] text-primary-black'>GPS </Text>
                <MaterialIcons name='gps-fixed' size={12} color='gray' />
              </TouchableOpacity>
            }
          />
          <InputField
            onChangeText={(value) => setForm({ ...form, password: value })}
            placeholder='Nhập mật khẩu của bạn'
            secureTextEntry={!showPassword}
            textContentType='password'
            value={form.password}
            label='Mật khẩu'
            icon='lock'
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={toggleShowPassword}
                color='gray'
                size={24}
              />
            }
          />
          <InputField
            onChangeText={(value) => setForm({ ...form, confirmPass: value })}
            placeholder='Nhập lại mật khẩu của bạn'
            secureTextEntry={!showPassword}
            textContentType='password'
            label='Nhập lại mật khẩu'
            value={form.confirmPass}
            icon='lock'
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={toggleShowPassword}
                color='gray'
                size={24}
              />
            }
          />
          <View className='mt-1'>
            <Text className='text-gray-500'>
              (Đã điền sẵn mật khẩu mặc định là: 88888888)
            </Text>
          </View>
          <CustomButton
            disabled={loading}
            onPress={onSignUp}
            loading={loading}
            className='mt-5'
            title='Đăng ký'
          />
          <Link
            className='text-lg text-center mt-5 text-primary-black'
            href={'/sign-in'}
          >
            <Text>Đã có tài khoản? </Text>
            <Text className='text-primary-pink'>Đăng nhập ngay</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

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

export default SignUp;
