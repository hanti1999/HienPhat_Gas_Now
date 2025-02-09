import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Entypo } from '@expo/vector-icons';

const GoBack = () => {
  return (
    <TouchableOpacity
      className='flex-row items-center mb-1'
      style={{ gap: 4 }}
      onPress={() => router.back()}
    >
      <Entypo name='chevron-thin-left' size={16} color={'#3b82f6'} />
      <Text className='text-[18px] underline text-blue-500'>Trở lại</Text>
    </TouchableOpacity>
  );
};

export default GoBack;
