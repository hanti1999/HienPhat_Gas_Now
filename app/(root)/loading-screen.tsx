import { Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import React from 'react';
import ScreenHeader from '@/components/ScreenHeader';

const LoadingScreen = () => {
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScreenHeader text={'Trở lại'} />
      <View
        style={{ gap: 10 }}
        className='bg-white py-2 h-full flex-row justify-center items-center'
      >
        <Text>Đang tải...</Text>
        <ActivityIndicator color={'#000'} />
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
