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
        oldPrice: item?.product_price,
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
    <View className='m-1' style={{ width: width * size - 8 }}>
      <Pressable onPress={navToInfo}>
        <View className='border-x border-t rounded-tl-md rounded-tr-md border-gray-200'>
          <Image
            className='aspect-square rounded-tl-md rounded-tr-md'
            source={{ uri: item?.product_image_url }}
          />
        </View>
        <View className='p-1.5 justify-between bg-pink-100 border-x border-b rounded-bl-md rounded-br-md border-gray-200'>
          <Text numberOfLines={2}>{item?.product_name}</Text>
          {item?.product_discount != 0 && (
            <View className='flex-row items-center' style={{ gap: 4 }}>
              <View className='px-0.5 rounded bg-red-500'>
                <Text className='text-white text-[12px]'>
                  -{item?.product_discount}%
                </Text>
              </View>
              <Text className='line-through text-gray-500 text-[12px]'>
                {item?.product_price?.toLocaleString()}
              </Text>
            </View>
          )}
          <Text className='font-semibold text-red-500'>
            {item?.final_price.toLocaleString()} đ
          </Text>
          <Text className='text-gray-500 text-[12px]'>
            Đã bán: {item?.product_sold}
          </Text>
          <TouchableOpacity
            onPress={() => addItemToCart()}
            disabled={isLoading || item?.product_instock === false}
            className='m-0.5 h-[40px] flex items-center rounded-md justify-center'
            style={{
              borderColor: item?.product_instock ? '' : '#d9d9d9',
              backgroundColor: item?.product_instock
                ? '#fb77c5'
                : 'rgba(0,0,0,0.04)',
            }}
          >
            {isLoading ? (
              <ActivityIndicator color='#fff' />
            ) : (
              <Text
                className='font-medium'
                style={{
                  color: item?.product_instock ? '#fff' : 'rgba(0,0,0,0.25)',
                }}
              >
                {item?.product_instock ? 'Sắm ngay nào!' : 'Hết hàng'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  );
};

export default ProductCard;
