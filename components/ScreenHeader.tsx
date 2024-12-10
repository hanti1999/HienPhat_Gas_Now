import { Text, Pressable, View } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useSelector } from 'react-redux';
import React from 'react';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { RootState } from '@/redux/store';

interface IProps {
  text: string;
  showCart?: boolean;
}

const ScreenHeader = ({ text, showCart = true }: IProps) => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const navigation = useNavigation();
  const displayValue = cartQuantity > 9 ? '9+' : cartQuantity;

  return (
    <View className='flex-row justify-between items-center bg-white border-b border-gray-300'>
      <View className='flex-row items-center'>
        <Pressable onPress={() => navigation.goBack()}>
          <Entypo
            name='chevron-thin-left'
            size={24}
            style={{ paddingHorizontal: 12, paddingVertical: 10 }}
          />
        </Pressable>
        <Text className='font-bold text-[20px]'>{text}</Text>
      </View>
      <Pressable
        className={`relative px-3 py-2.5 ${showCart ? '' : 'hidden'}`}
        onPress={() => router.push('/(root)/(tabs)/cart')}
      >
        <Ionicons name='cart-outline' size={30} />
        <View className='absolute w-5 h-5 bg-primary-pink rounded-full right-1 top-1'>
          <Text className='text-center text-white leading-5'>
            {displayValue}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ScreenHeader;
