import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import { Product } from '@/types/type';

const QuickSearchResultCard = ({ item }: { item: Product }) => {
  const navToInfo = () => {
    router.push({
      pathname: '/(root)/product-info',
      params: { itemId: item?.product_id },
    });
  };

  return (
    <Pressable onPress={navToInfo}>
      <View
        className='flex flex-row items-center h-20 w-full'
        style={{ gap: 4 }}
      >
        <Image
          source={{ uri: item?.product_image_url }}
          className='w-20 h-20'
        />
        <View>
          <Text numberOfLines={1}>{item?.product_name}</Text>
          <Text className='font-medium text-red-500 mt-2'>
            {item?.final_price.toLocaleString()} đ
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default QuickSearchResultCard;
