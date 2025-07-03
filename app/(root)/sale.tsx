import { ActivityIndicator, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, Image } from 'react-native';
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { addToCart } from '@/redux/slices/cartSlice';
import useGetData from '@/customHooks/useGetData';
import saleBg from '@/assets/images/sale-bg.jpg';
import daisy from '@/assets/images/daisy.png';
import { RootState } from '@/redux/store';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';

const url = `${process.env.EXPO_PUBLIC_API}/product/top-discount`;

const Sale = () => {
  const { data: products, loading } = useGetData<Product[]>(url);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard item={item} />,
    []
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ImageBackground source={saleBg} style={{ flex: 1 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item?.product_id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <StatusBar backgroundColor='transparent' />
            <Header />
            <View className='flex-row items-center justify-center pb-3'>
              <Image className='w-10 h-10' source={daisy} />
              <Text className='font-bold text-2xl text-red-500'>
                Ưu đãi đến 50%!!!
              </Text>
              <Image className='w-10 h-10' source={daisy} />
            </View>
          </>
        }
      />
    </ImageBackground>
  );
};

const Header = () => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const displayValue = cartQuantity > 9 ? '9+' : cartQuantity;

  return (
    <View
      className='flex-row justify-between items-center'
      style={{ marginTop: Constants.statusBarHeight }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Entypo
          name='chevron-thin-left'
          size={24}
          color={'red'}
          style={{ paddingHorizontal: 12, paddingVertical: 10 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        className={`relative px-3 py-2.5`}
        onPress={() => router.push('/(root)/(tabs)/cart')}
      >
        <Ionicons name='cart-outline' size={30} color={'red'} />
        <View className='absolute w-5 h-5 bg-red-500 rounded-full right-1 top-1'>
          <Text className='text-center text-white leading-5'>
            {displayValue}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ProductCard = React.memo(({ item }: { item: Product }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

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
      params: { itemId: item?.product_id },
    });
  };

  return (
    <View className='bg-white rounded-lg mb-2 mx-3 overflow-hidden h-[140px]'>
      <TouchableOpacity onPress={navToInfo} className='flex-row'>
        <Image
          source={{ uri: item?.product_image_url }}
          className='w-[140px] aspect-square'
        />
        <View className='p-1 flex-1 relative'>
          <Text numberOfLines={2} className='shrink'>
            {item?.product_name}
          </Text>
          <Text className='line-through text-red-500 text-[16px]'>
            {item?.product_price.toLocaleString()}
          </Text>
          <Text className='font-bold text-lg text-primary-pink'>
            {item?.final_price?.toLocaleString()} đ
          </Text>
          <View className='flex-row items-end justify-between absolute bottom-2 left-2 right-2'>
            <Text className='text-red-500 font-bold text-[16px]'>
              🎉Giảm: {item?.product_discount}%
            </Text>
            <TouchableOpacity
              onPress={addItemToCart}
              className='px-2 py-1 rounded-lg mt-2'
              style={{
                borderColor: item?.product_instock ? '' : '#d9d9d9',
                backgroundColor: item?.product_instock
                  ? '#fb77c5'
                  : 'rgba(0,0,0,0.04)',
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text
                  className='text-center text-[16px]'
                  style={{
                    color: item?.product_instock ? '#fff' : 'rgba(0,0,0,0.25)',
                  }}
                >
                  {item?.product_instock ? 'Sắm ngay nào!' : 'Hết hàng'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

export default Sale;
