import { View, Text, Image } from 'react-native';
import React from 'react';
import bg from '@/assets/images/background.jpg';

const HeaderImage = ({ text }: { text: string }) => {
  return (
    <View className='relative w-full'>
      <Image source={bg} className='z-0 w-full h-[200px]' />
      <Text className='text-3xl text-white font-semibold absolute bottom-16 left-5'>
        {text}
      </Text>
      <View className='bg-white absolute bottom-0 w-full h-10 rounded-tl-full rounded-tr-full' />
    </View>
  );
};

export default HeaderImage;
