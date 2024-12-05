import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';

interface IProps {
  categoryId: string;
  userId: string;
  extraText: string;
}

const SeeMoreCard = ({ categoryId, userId, extraText }: IProps) => {
  return (
    <TouchableOpacity
      //   onPress={() =>
      //     navigation.navigate('ProductByCategory', { categoryId, userId })
      //   }
      className='flex-row items-center justify-center py-2'
    >
      <Text className='text-[#60a5fa]'>Xem thêm</Text>
      <Text className='text-[#60a5fa] font-semibold pl-1'>{extraText}</Text>
      <Entypo name='chevron-right' size={24} color='#60a5fa' />
    </TouchableOpacity>
  );
};

export default SeeMoreCard;
