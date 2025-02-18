import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { View, Text, Image, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import Constants from 'expo-constants';
import img from '@/assets/images/delivery.png';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import RectangleButton from '@/components/RectangleButton';

const Checkout = () => {
  const { paymentMethod, sum, description } = useLocalSearchParams();
  const [countdown, setCountdown] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const token = useSelector((state: RootState) => state.auth.accessToken);

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
    }
  }, []);

  const onError = () => {
    Toast.show({
      type: 'error',
      text1: 'Có lỗi xảy ra, vui lòng liên hệ với bộ phận hỗ trợ!',
    });
    router.replace('/(root)/orders');
  };

  const navToOrder = () => {
    router.replace({
      pathname: '/(root)/wishlist',
      params: { token: token },
    });
  };

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
                  pathname: '/(root)/wishlist',
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
    <SafeAreaView className='flex-1 bg-primary-pink'>
      <View
        className='flex-1 rounded-tl-xl rounded-tr-xl overflow-hidden'
        style={{ marginTop: Constants.statusBarHeight }}
      >
        <View className='bg-gray-200 p-3'>
          <Text className='text-[18px] text-center font-semibold'>
            Quét mã QR để thanh toán
          </Text>
        </View>
        {loading && (
          <View className='flex-1 items-center justify-center bg-white'>
            <View className='flex-row gap-1 items-center'>
              <Text className='text-[20px] font-semibold'>Vui lòng chờ...</Text>
              <ActivityIndicator size={'large'} />
            </View>
          </View>
        )}
        <WebView
          onLoad={() => setLoading(false)}
          source={{
            uri: `https://img.vietqr.io/image/Vietcombank-9986359498-print.jpg?amount=${sum}&addInfo=${description}&accountName=Nguyen%20Thong%20Hoang%20Anh`,
          }}
          style={{ flex: 1 }}
          onError={onError}
          onHttpError={onError}
        />
        <View className='bg-white flex-row items-center p-3' style={{ gap: 4 }}>
          <TouchableOpacity
            onPress={navToOrder}
            className='bg-gray-300 rounded-lg py-3 px-6'
          >
            <Text className='text-gray-500 text-base font-medium'>Hủy bỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navToOrder}
            className='bg-primary-pink rounded-lg p-3 flex-1'
          >
            <Text className='text-white text-base text-center font-medium'>
              Xác nhận đã chuyển khoản
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Checkout;
