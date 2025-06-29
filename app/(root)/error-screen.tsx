import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import React from 'react';
import CustomButton from '@/components/CustomButton';

const ErrorScreen = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <View
        style={{ gap: 10 }}
        className='bg-white py-2 h-full flex-row justify-center items-center'
      >
        <Text className='text-lg text-red-500'>Có lỗi xảy ra!</Text>
        <CustomButton title='Thử lại' onPress={() => onRetry()} />
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;
