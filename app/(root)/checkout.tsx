import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useSelector } from 'react-redux';
import RectangleButton from '@/components/RectangleButton';
import CustomButton from '@/components/CustomButton';
import ScreenHeader from '@/components/ScreenHeader';
import img from '@/assets/images/delivery.png';
import { RootState } from '@/redux/store';

const Checkout = () => {
  const { paymentMethod, sum, description } = useLocalSearchParams();
  const [countdown, setCountdown] = useState<number>(5);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const handleOpenWeb = async () => {
    await WebBrowser.openBrowserAsync(
      `https://img.vietqr.io/image/Vietcombank-9986359498-print.jpg?amount=${sum}&addInfo=${description}&accountName=Nguyen%20Thong%20Hoang%20Anh`
    );
  };

  const navToHone = () => {
    router.replace('/(root)/(tabs)/home');
  };

  useEffect(() => {
    if (paymentMethod == 'cod') {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => {
        router.replace('/(root)/(tabs)/home');
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else if (paymentMethod == 'banking') {
      handleOpenWeb();
    }
  }, []);

  if (paymentMethod === 'cod') {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 items-center justify-center p-3'>
          <Image source={img} style={{ maxWidth: 400, maxHeight: 400 }} />
          <Text className='text-lg mt-2'>
            Cảm ơn bạn đã tin tưởng và ủng hộ!
          </Text>
          <Text className='text-lg'>Đơn hàng của bạn đang được xử lý</Text>
          <View style={{ gap: 8 }} className='flex-row items-center'>
            <RectangleButton
              title='Trở về trang chủ'
              className='mt-5'
              onPress={() => router.replace('/(root)/(tabs)/home')}
            />
            <RectangleButton
              title='Theo dõi đơn hàng'
              className='mt-5'
              onPress={() =>
                router.replace({
                  pathname: '/(root)/orders',
                  params: { token: token },
                })
              }
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScreenHeader showBack={false} text='Quét mã QR để thanh toán' />
      <View
        className='flex items-center justify-center p-3'
        style={{ gap: 20 }}
      >
        <CustomButton title='Mở lại mã QR' onPress={handleOpenWeb} />

        <View className='flex-row items-center' style={{ gap: 8 }}>
          <RectangleButton
            title='Bỏ qua'
            bgVariant='outline'
            textVariant='primary'
            onPress={navToHone}
          />
          <RectangleButton
            title='Xác nhận đã chuyển khoản'
            onPress={navToHone}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Checkout;
