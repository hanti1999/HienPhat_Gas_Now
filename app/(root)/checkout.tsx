import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';

const Checkout = () => {
  const { token, paymentMethod } = useLocalSearchParams();
  const [countdown, setCountdown] = useState(5);

  // useEffect(() => {
  //   if (paymentMethod === 'cod') {
  //     const interval = setInterval(() => {
  //       setCountdown((prev) => prev - 1);
  //     }, 1000);

  //     const timer = setTimeout(() => {
  //       router.replace('/(root)/(tabs)/home');
  //     }, 5000);

  //     return () => {
  //       clearInterval(interval);
  //       clearTimeout(timer);
  //     };
  //   } else {
  //     return;
  //   }
  // }, []);

  if (paymentMethod === 'cod') {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 items-center justify-center p-3'>
          <Text>Cảm ơn bạn đã tin tưởng và ủng hộ!</Text>
          <Text className='mt-2'>Đơn hàng của bạn đang được xử lý</Text>
          <CustomButton
            title='Trở về trang chủ'
            className='mt-5'
            onPress={() => router.replace('/(root)/(tabs)/home')}
          />
          <Text className='mt-2 text-gray-500'>
            Bạn sẽ được tự động chuyển đến trang chủ sau {countdown} giây
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View>
        <CustomButton
          title='Trở về trang chủ'
          onPress={() => router.push('/(root)/(tabs)/home')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Checkout;
