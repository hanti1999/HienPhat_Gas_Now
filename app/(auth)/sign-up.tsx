import { TouchableOpacity, StatusBar } from 'react-native';
import { Text, ScrollView, View } from 'react-native';
import { Link, router } from 'expo-router';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from '@/components/CustomButton';
import HeaderImage from '@/components/HeaderImage';
import InputField from '@/components/InputField';
import { Ionicons } from '@expo/vector-icons';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    password: '88888888',
    confirmPass: '88888888',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState({});

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSignUp = () => {
    router.push({
      pathname: '/(auth)/verify',
      params: { ...form, otp: '11234' },
    });
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

  return (
    <ScrollView className='flex-1 bg-white'>
      <StatusBar />
      <View>
        <HeaderImage text='Đăng ký' />

        <View className='p-5'>
          <InputField
            label='Điện thoại'
            placeholder='Nhập số điện thoại của bạn'
            keyboardType='numeric'
            icon='phone'
            value={form.phone}
            onChangeText={(value) => setForm({ ...form, phone: value })}
          />
          <InputField
            label='Tên'
            placeholder='Nhập tên của bạn'
            icon='user'
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label='Địa chỉ'
            placeholder='Nhập địa chỉ của bạn'
            icon='home'
            value={form.address}
            onChangeText={(value) => setForm({ ...form, address: value })}
            children={
              <TouchableOpacity
                onPress={onGetLocation}
                className='border border-gray-300 rounded-full p-1 flex flex-row items-center'
              >
                <Text className='text-[12px] text-primary-black'>GPS </Text>
                <MaterialIcons name='gps-fixed' size={12} color='gray' />
              </TouchableOpacity>
            }
          />
          <InputField
            label='Mật khẩu'
            placeholder='Nhập mật khẩu của bạn'
            icon='lock'
            secureTextEntry={!showPassword}
            value={form.password}
            textContentType='password'
            onChangeText={(value) => setForm({ ...form, password: value })}
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color='gray'
                onPress={toggleShowPassword}
              />
            }
          />
          <InputField
            label='Nhập lại mật khẩu'
            placeholder='Nhập lại mật khẩu của bạn'
            icon='lock'
            secureTextEntry={!showPassword}
            value={form.confirmPass}
            textContentType='password'
            onChangeText={(value) => setForm({ ...form, confirmPass: value })}
            children={
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color='gray'
                onPress={toggleShowPassword}
              />
            }
          />

          <View className='mt-1'>
            <Text className='text-gray-500'>
              (Đã điền sẵn mật khẩu mặc định là: 88888888)
            </Text>
          </View>

          <CustomButton
            onPress={onSignUp}
            title='Đăng ký'
            className='mt-5'
            loading={loading}
            disabled={loading}
          />

          <Link
            href={'/sign-in'}
            className='text-lg text-center mt-5 text-primary-black'
          >
            <Text>Đã có tài khoản? </Text>
            <Text className='text-primary-pink'>Đăng nhập ngay</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
