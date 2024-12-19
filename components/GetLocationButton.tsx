import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { ButtonProps } from '@/types/type';

const GetLocationButton = ({ onPress }: ButtonProps) => {
  return (
    <TouchableOpacity
      className='border border-gray-300 rounded-full p-1 flex flex-row items-center'
      onPress={onPress}
    >
      <Text className='text-[12px] text-primary-black'>GPS </Text>
      <MaterialIcons name='gps-fixed' size={12} color='gray' />
    </TouchableOpacity>
  );
};

export default GetLocationButton;
