import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text, SafeAreaView, Dimensions, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StatusBar, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import axios from 'axios';
import { addToCart } from '@/redux/slices/cartSlice';
import ScreenHeader from '@/components/ScreenHeader';
import { FontAwesome } from '@expo/vector-icons';
import openLink from '@/utils/openLink';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';

const ProductInfo = () => {
  const { token, itemId } = useLocalSearchParams();
  const [inWishlist, setIsInWishlist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [averageRating, setAverageRating] = useState<number>();
  const [actualPrice, setActualPrice] = useState<number>();
  const [totalRating, setTotalRating] = useState<number>();
  const [data, setData] = useState<Product>();
  const width = Dimensions.get('window').width;
  const dispatch = useDispatch();

  const checkWishlist = async () => {
    try {
      // need replace
      const url = `check-wishlist-url`;
      const res = await axios.get(url);
      if (res.status === 200) {
        const result = res.data.isProductInWishlist;
        setIsInWishlist(result);
      } else {
        console.log('Lỗi check wishlist');
      }
    } catch (error) {
      console.log('Lỗi check wishlist', error);
    }
  };

  const addItemToCart = () => {
    dispatch(
      addToCart({
        id: data?._id,
        title: data?.title,
        productImg: data?.image,
        price: data?.price,
      })
    );
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
      Toast.show({ text1: 'Đã thêm sản phẩm vào giỏ hàng' });
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  };

  const addWishlist = async () => {
    try {
      setLoading(true);
      // need replace
      const url = `add-wishlist-url`;
      const res = await axios.post(url);
      if (res.status === 200) {
        Toast.show({ text1: 'Đã thêm vào sản phẩm yêu thích' });
        checkWishlist();
      } else {
        Toast.show({ type: 'error', text1: 'Thêm không thành công' });
      }
    } catch (error) {
      console.log('Lỗi không thêm được wishlist', error);
      Toast.show({ type: 'error', text1: 'Thêm không thành công' });
    } finally {
      setLoading(false);
    }
  };

  const removeWishlist = async () => {
    try {
      setLoading(true);
      // need replace
      const url = `delete-wishlist-url`;
      const res = await axios.delete(url);
      if (res.status === 200) {
        checkWishlist();
        Toast.show({ text1: 'Đã xóa khỏi sản phẩm yêu thích' });
      } else {
        Toast.show({ type: 'error', text1: 'Xoá không thành công' });
      }
    } catch (error) {
      console.log('Lỗi không xóa được wishlist', error);
      Toast.show({ type: 'error', text1: 'Xoá không thành công' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.price != undefined) {
      setActualPrice(data?.price * (1 - data.discount / 100));
      setTotalRating(
        data?.reviews.reduce((acc, data) => acc + data?.rating, 0)
      );
      setAverageRating(totalRating && totalRating / data?.reviews.length);
    }
  }, [data]);

  useEffect(() => {
    const getProductInfo = async () => {
      try {
        // need replace
        const url = `https://hien-phat-expoapp-api.onrender.com/product/${itemId}`;
        const res = await axios.get(url);
        if (res.status === 200) {
          setData(res?.data?.product);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Lấy thông tin sản phẩm không thành công',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Lấy thông tin sản phẩm không thành công',
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProductInfo();
  }, []);

  // useEffect(()=> {
  //   checkWishlist()
  // }, [])

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        className='bg-gray-100'
      >
        <StatusBar />
        <ScreenHeader text={'Chi tiết sản phẩm'} />
        <Swiper
          dot={<View className='w-1 h-1 mx-1 bg-gray-200 rounded-full' />}
          activeDot={
            <View className='w-1 h-1 mx-1 bg-primary-pink rounded-full' />
          }
          loop={true}
          autoplay={false}
          autoplayTimeout={5}
          height={width}
          width={width}
        >
          {data?.carouselImages?.map((item, index) => (
            <Image
              key={index}
              source={{ uri: item }}
              style={{ height: width }}
            />
          ))}
        </Swiper>

        <View className='py-2 px-3 mb-2 bg-pink-100'>
          <Text numberOfLines={2} className='font-semibold text-[18px]'>
            {data?.title}
          </Text>
          <View className='flex-row items-center py-2' style={{ gap: 8 }}>
            <Text className='text-[24px] font-bold'>
              {actualPrice?.toLocaleString()}đ
            </Text>
            {data!.discount > 0 && (
              <>
                <Text className='line-through text-[16px] text-gray-500'>
                  {data?.price.toLocaleString()}đ
                </Text>
                <View className='px-1 py-0.5 rounded-lg bg-red-500'>
                  <Text className='text-white '>-{data?.discount}%</Text>
                </View>
              </>
            )}
          </View>
          <View className='flex-row justify-between items-center'>
            <View className='flex-row items-center' style={{ gap: 4 }}>
              <Text>{averageRating}</Text>
              <FontAwesome name='star' size={14} color='#faa935' />
              <Text>({data?.reviews.length} đánh giá)</Text>
              <Text className='text-gray-400'>|</Text>
              <Text>Đã bán: {data?.sold}</Text>
            </View>
            {inWishlist ? (
              <TouchableOpacity onPress={removeWishlist} disabled={loading}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <FontAwesome name='heart' size={24} color='#fb77c5' />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={addWishlist} disabled={loading}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <FontAwesome name='heart-o' size={24} color='#fb77c5' />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className='py-2 px-3 mb-2 bg-pink-200'>
          <Text className='text-[16px] font-semibold mb-2'>
            Đặc điểm nổi bật
          </Text>
          <View>
            {data?.features?.map((item, index) => (
              <Text className='pt-0.5' key={index}>
                o {item}
              </Text>
            ))}
          </View>
        </View>

        <View className='py-2 px-3 mb-2 bg-pink-300'>
          <Text className='text-[16px] font-semibold mb-2'>Bài đánh giá</Text>
          <Reviews reviews={data?.reviews} />
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(root)/review',
                params: { productId: data?._id, token: token },
              })
            }
            className='bg-white w-[200px] rounded-full p-2 mt-2'
          >
            <Text className='text-[16px] text-center'>
              Viết đánh giá của bạn
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className='flex-row justify-evenly bg-white py-4'>
        <TouchableOpacity
          className='border-[#0068ff] border-2 rounded-lg flex-1 mx-2 h-[60px] items-center justify-center'
          onPress={() => openLink('https://zalo.me/0975841582')}
        >
          <Text className='text-[#0068ff] text-[18px]'>
            Tư vấn
            <Text className='font-bold'> Zalo</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={addItemToCart}
          className='bg-primary-pink rounded-lg flex-1 mx-2 items-center h-[60px] justify-center'
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={'#fff'} />
          ) : (
            <Text className='text-white text-[18px] '>Mua ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Reviews = ({ reviews }: { reviews: any }) => {
  if (reviews.length === 0) {
    return <Text>Chưa có đánh giá!</Text>;
  }

  return (
    <FlatList
      renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
      showsHorizontalScrollIndicator={false}
      initialNumToRender={6}
      data={reviews}
      horizontal
    />
  );
};

const RenderItem = ({ item, index }: { item: any; index: number }) => {
  return (
    <View key={index} className='mr-2 bg-white rounded-lg p-2 w-[360px]'>
      <View className='flex-row items-center' style={{ gap: 4 }}>
        <Text className='text-[#faa935] font-semibold'>{item?.rating}</Text>
        <FontAwesome name='star' size={16} color='#faa935' />
      </View>
      <Text className='font-semibold mb-1'>{item?.name}</Text>
      <Text>{item?.comment}</Text>
      <View className='flex-row'>
        <Text className='text-[#faa935] font-medium'>
          Sản phẩm: {item?.productRating}
          <FontAwesome name='star' size={16} color='#faa935' />
        </Text>
        <Text className='text-[#faa935]'> | </Text>
        <Text className='text-[#faa935] font-medium'>
          Dịch vụ: {item?.serviceRating}
          <FontAwesome name='star' size={16} color='#faa935' />
        </Text>
      </View>
      <Text className='italic text-gray-500'>
        {moment(item?.createAt).format('DD/MM/YYYY HH:mm')}
      </Text>
    </View>
  );
};

export default ProductInfo;
