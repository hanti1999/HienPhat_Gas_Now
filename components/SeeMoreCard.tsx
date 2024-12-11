import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';

interface IProps {
  categoryId: string;
  token: string | null;
  extraText: string;
}

const SeeMoreCard = ({ categoryId, token, extraText }: IProps) => {
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/(root)/product-filter',
          params: { id: categoryId, token: token, type: 'category' },
        })
      }
      className='flex-row items-center justify-center py-2'
    >
      <Text className='text-[#60a5fa]'>Xem thêm</Text>
      <Text className='text-[#60a5fa] font-semibold pl-1'>{extraText}</Text>
      <Entypo name='chevron-right' size={24} color='#60a5fa' />
    </TouchableOpacity>
  );
};

export default SeeMoreCard;
