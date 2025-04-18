import { TextInput, View, Pressable, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { router } from 'expo-router';
import tulip from '@/assets/images/tulip.png';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/redux/store';

const SearchBar = () => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const [input, setInput] = useState<string>('');

  const searchHandler = () => {
    router.push({
      pathname: '/(root)/search-result',
      params: { input: input },
    });
  };

  return (
    <View className='bg-primary-pink flex-row items-center'>
      <View
        style={{ gap: 8 }}
        className='px-3 flex-row flex-1 items-center bg-white h-10 rounded-full ml-3 my-3'
      >
        <Pressable onPress={searchHandler}>
          <Ionicons name='search' size={24} />
        </Pressable>
        <TextInput
          placeholder='Khách iu tìm gì nè?'
          onSubmitEditing={searchHandler}
          className='text-[16px] flex-1'
          placeholderTextColor={'#999'}
          onChangeText={setInput}
          value={input}
        />
        <Pressable onPress={searchHandler}>
          <Image className='w-9 h-9' source={tulip} />
        </Pressable>
      </View>
      <Pressable
        className='relative px-3'
        onPress={() => router.push('/(root)/(tabs)/cart')}
      >
        <Ionicons name='cart-outline' size={30} />
        <View className='absolute w-5 h-5 bg-white rounded-full right-1 -top-2'>
          <Text className='text-center text-primary-pink h-full leading-5'>
            {cartQuantity}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default SearchBar;
