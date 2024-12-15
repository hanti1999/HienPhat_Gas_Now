import { TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Text, View, Image, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { addToCart } from '@/redux/slices/cartSlice';
import { Product } from '@/types/type';

interface IProductCard {
  item: Product;
  token: string | null | string[];
  size: number;
}

const ProductCard = ({ item, token, size }: IProductCard) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const width = Dimensions.get('window').width;

  const addItemToCart = () => {
    dispatch(
      addToCart({
        id: item?.product_id,
        title: item?.product_name,
        productImg: item?.product_image_url,
        price: item?.final_price,
      })
    );
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
      Toast.show({ type: 'success', text1: 'Đã thêm sản phẩm vào giỏ hàng' });
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  };

  const navToInfo = () => {
    router.push({
      pathname: '/(root)/product-info',
      params: { token: token, itemId: item?.product_id },
    });
  };

  return (
    <View
      className='m-1 border border-gray-200 rounded-md overflow-hidden'
      style={{ width: width * size - 8 }}
    >
      <Pressable onPress={navToInfo}>
        <Image
          className='aspect-square'
          source={{ uri: item?.product_image_url }}
        />
        <View className='p-1.5 h-[120px] justify-between bg-pink-100'>
          <Text numberOfLines={2}>{item?.product_name}</Text>
          <View
            className={`flex-row items-center ${
              item?.product_discount == 0 ? 'none' : 'auto'
            }`}
            style={{
              gap: 4,
            }}
          >
            <View className='p-px rounded bg-red-500'>
              <Text className='text-white '>-{item?.product_discount}%</Text>
            </View>
            <Text className='line-through text-gray-500'>
              {item?.product_price?.toLocaleString()}
            </Text>
          </View>
          <Text className='font-semibold text-red-500 text-[18px]'>
            {item?.final_price.toLocaleString()}đ
          </Text>
          <Text className='text-gray-500 text-[12px]'>
            Đã bán: {item?.product_sold}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => addItemToCart()}
          disabled={isLoading}
          className=' bg-primary-pink h-[48px] flex items-center rounded-bl-md rounded-br-md justify-center'
        >
          {isLoading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text className=' text-white text-[16px] font-medium uppercase'>
              sắm ngay nào!
            </Text>
          )}
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};

export default ProductCard;
