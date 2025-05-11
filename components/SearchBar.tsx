import {
  TextInput,
  View,
  Pressable,
  Text,
  Image,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import React, { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import tulip from '@/assets/images/tulip.png';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/redux/store';
import useGetData from '@/customHooks/useGetData';
import { Product } from '@/types/type';
import QuickSearchResultCard from './QuickSearchResultCard';

const SearchBar = () => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const [input, setInput] = useState<string>('');
  const url = useMemo(() => {
    return `${process.env.EXPO_PUBLIC_API}/product/search?search=${input}`;
  }, [input]);
  const {
    data: products,
    loading,
    refetch,
    clearData,
  } = useGetData<Product[]>(url, {}, false);

  const searchHandler = () => {
    router.push({
      pathname: '/(root)/search-result',
      params: { input: input },
    });
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (input.trim()) {
        await refetch();
      } else {
        clearData();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [input]);

  return (
    <View className='bg-primary-pink flex-row items-center'>
      <View
        style={{ gap: 8 }}
        className='px-3 flex-row flex-1 items-center bg-white h-10 rounded-full ml-3 my-3 relative z-20'
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
        {products && (
          <View className='absolute top-full left-0 right-0 bg-red-200 h-20 z-10 rounded-3xl'>
            <FlatList
              data={products?.slice(0, 3)}
              keyExtractor={(item) => item?.product_id.toString()}
              renderItem={({ item }) => <QuickSearchResultCard item={item} />}
            />
          </View>
        )}
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
