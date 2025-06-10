import { TextInput, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, Image, FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGetData from '@/customHooks/useGetData';
import tulip from '@/assets/images/tulip.png';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/redux/store';
import { Product } from '@/types/type';
import QuickSearchResultCard from './QuickSearchResultCard';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY_LENGTH = 6;

const SearchBar = () => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const [input, setInput] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const url = useMemo(() => {
    return `${process.env.EXPO_PUBLIC_API}/product/search?search=${input}`;
  }, [input]);
  const {
    data: products,
    loading,
    error,
    refetch,
    clearData,
  } = useGetData<Product[]>(url, {}, false);

  const loadSearchHistory = async () => {
    try {
      const historyString = await AsyncStorage.getItem(HISTORY_KEY);
      if (historyString !== null) {
        setSearchHistory(JSON.parse(historyString));
      }
    } catch (error) {
      return;
    }
  };

  const saveSearchHistory = async (query: string) => {
    if (!query) return;

    try {
      const updatedHistory = [
        query,
        ...searchHistory.filter((item) => item !== query),
      ];
      const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_LENGTH);
      setSearchHistory(limitedHistory);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      return;
    }
  };

  const searchHandler = () => {
    saveSearchHistory(input);
    setIsFocused(false);
    setInput('');
    router.push({
      pathname: '/(root)/search-result',
      params: { input: input },
    });
  };

  const handleHistoryItemPress = (item: string) => {
    setInput(item);
    setIsFocused(false);
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
        <Ionicons name='search' size={24} color={'#fb77c5'} />
        <TextInput
          placeholder='Tìm kiếm sản phẩm...'
          onSubmitEditing={searchHandler}
          className='text-[16px] flex-1'
          placeholderTextColor={'#999'}
          onChangeText={setInput}
          value={input}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onFocus={() => {
            setIsFocused(true);
            loadSearchHistory();
          }}
        />
        <Pressable onPress={searchHandler}>
          <Image className='w-9 h-9' source={tulip} />
        </Pressable>
        {!products && isFocused && searchHistory.length > 0 && (
          <View className='absolute top-full left-0 right-0 bg-white z-10 rounded-3xl overflow-hidden border border-gray-200'>
            <FlatList
              data={searchHistory}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps='handled'
              renderItem={({ item }) => (
                <TouchableOpacity
                  className='p-2'
                  onPress={() => handleHistoryItemPress(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {products && (
          <View className='absolute top-full left-0 right-0 bg-white z-10 rounded-3xl overflow-hidden border border-gray-200'>
            <FlatList
              data={products?.slice(0, 3)}
              keyExtractor={(item) => item?.product_id.toString()}
              renderItem={({ item }) => <QuickSearchResultCard item={item} />}
              scrollEnabled={false}
              contentContainerStyle={{ padding: 4 }}
              ListEmptyComponent={
                !loading && !error ? (
                  <View className='my-5 px-5'>
                    <Text className='text-center text-gray-500'>
                      Không tìm thấy sản phẩm nào
                    </Text>
                  </View>
                ) : null
              }
              ListHeaderComponent={
                <Text className='font-bold px-1 pt-1'>
                  Kết quả tìm kiếm cho:{' '}
                  <Text className='text-primary-pink'>{input}</Text>
                </Text>
              }
            />
          </View>
        )}
      </View>
      <Pressable
        className='relative px-3'
        onPress={() => router.push('/(root)/(tabs)/cart')}
      >
        <Ionicons name='cart-outline' size={30} color={'white'} />
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
