import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import CustomButton from '@/components/CustomButton';
import ScreenHeader from '@/components/ScreenHeader';

const Checkout = () => {
  const { token, paymentMethod } = useLocalSearchParams();

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScreenHeader text='Thanh toán' />
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
