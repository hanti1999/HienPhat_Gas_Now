import { Image, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import axios from 'axios';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { addToCart } from '@/redux/slices/cartSlice';
import saleBg from '@/assets/images/sale-bg.jpg';
import daisy from '@/assets/images/daisy.png';
import getNewToken from '@/utils/getNewToken';
import { RootState } from '@/redux/store';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';

const Sale = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getProducts = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/product/top-discount`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className='flex-1'>
      <ImageBackground source={saleBg} style={{ flex: 1 }}>
        <Header />
        <View className='px-3'>
          <View className='flex-row items-center justify-center pb-3'>
            <Image className='w-10 h-10' source={daisy} />
            <Text className='font-bold text-2xl text-red-500'>
              Ưu đãi đến 50%!!!
            </Text>
            <Image className='w-10 h-10' source={daisy} />
          </View>
          <FlatList
            data={products}
            keyExtractor={(item) => item?.product_id}
            renderItem={({ item }) => <ProductCard item={item} token={token} />}
            showsVerticalScrollIndicator={false}
            className='mb-28'
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const Header = () => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const displayValue = cartQuantity > 9 ? '9+' : cartQuantity;

  return (
    <View className='flex-row justify-between items-center'>
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

interface IProps {
  item: Product;
  token: string | null;
}

const ProductCard = ({ item, token }: IProps) => {
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
      params: { token: token, itemId: item?.product_id },
    });
  };

  return (
    <View className='bg-white rounded-lg mb-2 overflow-hidden h-[140px]'>
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
              className='bg-primary-pink px-2 py-1 rounded-lg mt-2'
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color='#fff' />
              ) : (
                <Text className='text-white text-center text-[16px]'>
                  sắm ngay!
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Sale;
