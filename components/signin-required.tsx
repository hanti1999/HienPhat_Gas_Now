import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';

const SigninRequired = () => {
  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <ScreenHeader />
      <View className='flex-1 bg-white p-2'>
        <Text className='text-center text-xl font-bold'>
          Bạn cần đăng nhập để sử dụng tính năng này
        </Text>
        <Text className='text-center text-base '>
          Vui lòng đăng nhập hoặc đăng ký để tiếp tục
        </Text>
        <View
          className='flex-row items-center p-2 h-[60px]'
          style={{ gap: 12 }}
        >
          <View className='flex-1'>
            <RectangleButton
              title='Đăng nhập'
              onPress={() => router.push('/(auth)/sign-in')}
            />
          </View>
          <View className='flex-1'>
            <RectangleButton
              onPress={() => router.push('/(auth)/sign-up')}
              title='Đăng ký'
              textVariant='primary'
              bgVariant='outline'
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SigninRequired;
