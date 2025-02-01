import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image } from 'react-native';
import React from 'react';
import bg from '@/assets/images/bg.jpg';

const HeaderImage = ({ text }: { text: string }) => {
  return (
    <View className='relative w-full'>
      <Image source={bg} className='z-0 w-full h-[180px]' />
      <LinearGradient
        colors={['transparent', '#fff']}
        className='absolute h-[180px] left-0 right-0 top-0'
      />
      <Text className='text-3xl text-primary-black font-RobotoBold absolute bottom-5 left-5'>
        {text}
      </Text>
    </View>
  );
};

export default HeaderImage;
