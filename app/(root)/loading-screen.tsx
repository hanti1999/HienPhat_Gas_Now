import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ScreenHeader from '@/components/ScreenHeader';

const LoadingScreen = ({ showBack = true }: { showBack?: boolean }) => {
  return (
    <SafeAreaView edges={['top']} className='bg-primary-pink flex-1'>
      <StatusBar backgroundColor='#fb77c5' style='light' />
      {showBack && <ScreenHeader text='Trở lại' />}
      <View
        style={{ gap: 10 }}
        className='bg-white py-2 h-full flex-row justify-center items-center'
      >
        <Text className='text-lg'>Đang tải...</Text>
        <ActivityIndicator color='#fb77c5' />
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
