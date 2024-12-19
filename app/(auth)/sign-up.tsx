import { Text, ScrollView, View, Modal } from 'react-native';
import { TouchableOpacity, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Link, router } from 'expo-router';
import * as Location from 'expo-location';
import axios from 'axios';
import { District, Province, Ward, ZaloToken } from '@/types/type';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PasswordValidate from '@/components/PasswordValidate';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import InputField from '@/components/InputField';

interface SignupData {
  user_fullname: string;
  phonenumber: string;
  address_detail: string;
  password: string;
  confirmPass: string;
}

const SignUp = () => {
  const [form, setForm] = useState<SignupData>({
    user_fullname: '',
    phonenumber: '',
    address_detail: '',
    password: '88888888',
    confirmPass: '88888888',
  });
  const [token, setToken] = useState<ZaloToken>({
    access_token: '',
    refresh_token: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const getAccessToken = async () => {
    // lấy access token từ node server
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/zalo-tokens/b0455d2d-d138-46ad-b6c7-42aab30acf4b`;
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
    const formatedPhone = form.phonenumber.replace('0', '84');
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
    const zaloAppIdSecretKey = process.env.EXPO_PUBLIC_ZALO_APP_SECRET_KEY;
    const zaloAppId = process.env.EXPO_PUBLIC_ZALO_APP_ID as string;
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
      const url = `/zalo-tokens/b0455d2d-d138-46ad-b6c7-42aab30acf4b`;
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

  const handleSignUp = async () => {
    if (!validated) {
      Toast.show({ type: 'error', text1: 'Mật khẩu hợp lệ' });
      return;
    }
    if (form.address_detail === '') {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập địa chỉ' });
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

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Toast.show({ type: 'info', text1: 'Quyền truy cập vị trí bị từ chối' });
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
        address_detail: `${reverseGeocode[0]?.name}, ${reverseGeocode[0]?.street}, ${reverseGeocode[0]?.subregion}, ${reverseGeocode[0]?.region}`,
      });
    } else {
      setForm({
        ...form,
        address_detail: `${reverseGeocode[0]?.formattedAddress}`,
      });
    }
  };

  const fetchProvinces = async () => {
    const res = await axios.get(`${process.env.EXPO_PUBLIC_PROVINCE_API}/p/`);
    setProvinces(res.data);
  };

  const fetchDistrict = async (provinceCode: number, name: string) => {
    const url = `${process.env.EXPO_PUBLIC_PROVINCE_API}/p/${provinceCode}?depth=2`;
    const res = await axios.get(url);
    setProvinces([]);
    setSelectedProvince(name);
    setDistricts(res.data?.districts);
  };

  const fetchWard = async (districtCode: number, name: string) => {
    const url = `${process.env.EXPO_PUBLIC_PROVINCE_API}/d/${districtCode}?depth=2`;
    const res = await axios.get(url);
    setDistricts([]);
    setSelectedDistrict(name);
    setWards(res.data?.wards);
  };

  const onCompleteSelectAddress = (name: string) => {
    setModalVisible(!modalVisible);
    setWards([]);
    setForm((prev) => ({
      ...prev,
      address_detail: `${name}, ${selectedDistrict}, ${selectedProvince}`,
    }));
  };

  const onCloseModal = () => {
    setModalVisible(!modalVisible);
    setDistricts([]);
    setProvinces([]);
    setWards([]);
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  return (
    <ScrollView className='flex-1 bg-white'>
      <StatusBar />
      <View>
        <HeaderImage text='Đăng ký' />
        <View className='p-5'>
          <InputField
            onChangeText={(value) => setForm({ ...form, phonenumber: value })}
            placeholder='Nhập số điện thoại của bạn'
            value={form.phonenumber}
            keyboardType='numeric'
            label='Điện thoại'
            icon='phone'
          />
          <InputField
            onChangeText={(value) => setForm({ ...form, user_fullname: value })}
            placeholder='Nhập tên của bạn'
            value={form.user_fullname}
            label='Tên'
            icon='user'
          />
          <InputField
            onChangeText={(value) =>
              setForm({ ...form, address_detail: value })
            }
            placeholder='Nhập địa chỉ nhận hàng'
            value={form.address_detail}
            label='Địa chỉ nhận hàng'
            onFocus={() => {
              setModalVisible(!modalVisible);
              fetchProvinces();
            }}
            multiline
            icon='home'
            children={
              <TouchableOpacity
                className='border border-gray-300 rounded-full p-1 flex flex-row items-center'
                onPress={handleGetLocation}
              >
                <Text className='text-[12px] text-primary-black'>GPS </Text>
                <MaterialIcons name='gps-fixed' size={12} color='gray' />
              </TouchableOpacity>
            }
          />
          <Modal
            animationType='slide'
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View
              style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
              className='flex-1 items-center justify-end'
            >
              <View className='bg-white mb-3.5 rounded-lg w-full p-2 h-[80%]'>
                <View className='flex-row justify-between items-center'>
                  <Text className='text-left font-bold mb-2 mr-1 text-lg'>
                    Chọn địa chỉ
                  </Text>

                  <TouchableOpacity onPress={onCloseModal}>
                    <AntDesign name='close' size={24} color='black' />
                  </TouchableOpacity>
                </View>
                <ScrollView showsHorizontalScrollIndicator={false}>
                  {provinces.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => fetchDistrict(item?.code, item?.name)}
                      className='border-b border-gray-200 p-3'
                      key={index}
                    >
                      <Text>{item?.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {districts?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => fetchWard(item?.code, item?.name)}
                      className='border-b border-gray-200 p-3'
                      key={index}
                    >
                      <Text>{item?.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {wards?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        onCompleteSelectAddress(item?.name);
                      }}
                      className='border-b border-gray-200 p-3'
                      key={index}
                    >
                      <Text>{item?.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
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
                onPress={() => setShowPassword(!showPassword)}
                name={showPassword ? 'eye-off' : 'eye'}
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
                onPress={() => setShowPassword(!showPassword)}
                name={showPassword ? 'eye-off' : 'eye'}
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
          <PasswordValidate
            newPassword={form.password}
            confirmPassword={form.confirmPass}
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
          <CustomButton
            onPress={handleSignUp}
            disabled={loading}
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
