import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import React, { useState, useEffect, useMemo } from 'react';
import { Image, FlatList, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import axios from 'axios';
import useGetMultipleData from '@/customHooks/useGetMultipleData';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import RectangleButton from '@/components/RectangleButton';
import { addToCart } from '@/redux/slices/cartSlice';
import ScreenHeader from '@/components/ScreenHeader';
import { Product, Review } from '@/types/type';
import getNewToken from '@/utils/getNewToken';
import { RootState } from '@/redux/store';
import LoadingScreen from './loading-screen';

interface IDes {
  description_id: string;
  product_id: string;
  description: string;
  title: string;
}

interface IFeature {
  feature_id: string;
  product_id: string;
  feature_name: string;
  feature_des: string;
}

interface ICarousel {
  image_id: string;
  product_id: string;
  image_url: string;
}

const ProductInfo = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const { itemId } = useLocalSearchParams();
  const [inWishlist, setIsInWishlist] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wlLoading, setWlLoading] = useState<boolean>(false);
  const width = Dimensions.get('window').width;
  const dispatch = useDispatch();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const urls = useMemo(() => {
    return [
      `${process.env.EXPO_PUBLIC_API}/product/${itemId}`,
      `${process.env.EXPO_PUBLIC_API}/carousel/${itemId}`,
      `${process.env.EXPO_PUBLIC_API}/description/${itemId}`,
      `${process.env.EXPO_PUBLIC_API}/review/product/${itemId}`,
      `${process.env.EXPO_PUBLIC_API}/feature/${itemId}`,
    ];
  }, [itemId]);

  const checkWishlist = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/wishlist`;
      const res = await axios.get(url, config);
      if (res.status === 200) {
        const products: Product[] = res.data;
        const filteredProducts = products.find((p) => p.product_id === itemId);
        setIsInWishlist(filteredProducts !== undefined);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.error('Lỗi check wishlist', error);
      }
    }
  };

  const addItemToCart = (data: Product) => {
    dispatch(
      addToCart({
        id: data?.product_id,
        title: data?.product_name,
        productImg: data?.product_image_url,
        price: data?.final_price,
        oldPrice: data?.product_price,
      })
    );
  };

  const handleAddToCart = (data: Product) => {
    addItemToCart(data);
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
      Toast.show({ text1: 'Đã thêm sản phẩm vào giỏ hàng' });
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  };

  const handleBuyNow = (data: Product) => {
    addItemToCart(data);
    router.push('/(root)/(tabs)/cart');
  };

  const addWishlist = async () => {
    if (!token) {
      router.push('/(auth)/sign-in');
      return;
    }
    try {
      setWlLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/wishlist`;
      const data = {
        product_id: itemId,
      };
      const res = await axios.post(url, data, config);
      if (res.status === 201) {
        Toast.show({ text1: 'Đã thêm vào sản phẩm yêu thích' });
        checkWishlist();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.log('Lỗi không thêm được wishlist', error);
        Toast.show({ type: 'error', text1: 'Thêm không thành công' });
      }
    } finally {
      setWlLoading(false);
    }
  };

  const removeWishlist = async () => {
    try {
      setWlLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/wishlist/${itemId}`;
      const res = await axios.delete(url, config);
      if (res.status === 200) {
        checkWishlist();
        Toast.show({ text1: 'Đã xóa khỏi sản phẩm yêu thích' });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.log('Lỗi không xóa được wishlist', error);
        Toast.show({ type: 'error', text1: 'Xoá không thành công' });
      }
    } finally {
      setWlLoading(false);
    }
  };

  const { data: datas, loading } =
    useGetMultipleData<[Product, ICarousel[], IDes[], Review[], IFeature[]]>(
      urls
    );

  useEffect(() => {
    if (token) {
      checkWishlist();
    }
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (datas) {
    const data = datas?.[0];
    const carousel = datas?.[1];
    const description = datas?.[2];
    const reviews = datas?.[3];
    const feature = datas?.[4];
    // Tính đánh giá trung bình
    const totalRating = reviews?.reduce(
      (acc: any, item: any) => acc + item.review_rating,
      0
    );
    // setAverageRating(totalRating / reviews.length);
    const averageRating = totalRating / reviews.length;
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <ScreenHeader
          text={'Chi tiết sản phẩm'}
          showCart={true}
          bg='white'
          textColor='black'
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          className='bg-gray-100'
        >
          <SwiperFlatList
            data={carousel}
            renderItem={({ item }: { item: ICarousel }) => (
              <Image
                source={{ uri: item?.image_url }}
                style={{ height: width, width: width }}
              />
            )}
          />

          <View className='p-3 mb-2 bg-pink-100'>
            <Text numberOfLines={2} className='font-semibold text-[18px]'>
              {data?.product_name}
            </Text>
            <View className='flex-row items-center py-2' style={{ gap: 8 }}>
              <Text className='text-[24px] font-bold'>
                {data?.final_price.toLocaleString()}đ
              </Text>
              {data!.product_discount > 0 && (
                <>
                  <Text className='line-through text-[16px] text-gray-500'>
                    {data?.product_price.toLocaleString()}đ
                  </Text>
                  <View className='px-1 py-0.5 rounded-lg bg-red-500'>
                    <Text className='text-white '>
                      -{data?.product_discount}%
                    </Text>
                  </View>
                </>
              )}
            </View>
            <View className='flex-row justify-between items-center'>
              <View className='flex-row items-center' style={{ gap: 4 }}>
                <Text>{averageRating}</Text>
                <FontAwesome name='star' size={14} color='#faa935' />
                <Text>({reviews?.length} đánh giá)</Text>
                <Text className='text-gray-400'>|</Text>
                <Text>Đã bán: {data?.product_sold}</Text>
              </View>
              {inWishlist ? (
                <TouchableOpacity onPress={removeWishlist} disabled={wlLoading}>
                  {wlLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <FontAwesome name='heart' size={24} color='#fb77c5' />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={addWishlist} disabled={wlLoading}>
                  {wlLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <FontAwesome name='heart-o' size={24} color='#fb77c5' />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList
            data={feature}
            keyExtractor={(item) => item?.feature_id}
            renderItem={({ item }) => (
              <Text className='pt-0.5'>o {item?.feature_des}</Text>
            )}
            scrollEnabled={false}
            ListHeaderComponent={
              <Text className='text-[16px] font-semibold mb-2'>
                Đặc điểm nổi bật
              </Text>
            }
            className='p-3 mb-2 bg-pink-200'
          />

          <FlatList
            data={description}
            scrollEnabled={false}
            keyExtractor={(item) => item?.description_id}
            renderItem={({ item }) => (
              <Text className='pt-0.5'>o {item?.description}</Text>
            )}
            ListHeaderComponent={
              <Text className='text-[16px] font-semibold mb-2'>
                Thông tin chi tiết
              </Text>
            }
            className='p-3 mb-2 bg-pink-200'
          />

          <View className='p-3 mb-2 bg-pink-300'>
            <Text className='text-[16px] font-semibold mb-2'>Bài đánh giá</Text>
            <Reviews reviews={reviews} />
          </View>
        </ScrollView>

        <View
          className='flex-row items-center py-2 px-3 h-[60px]'
          style={{ gap: 12 }}
        >
          <Link href={'https://zalo.me/0975841582'}>
            <View className='flex items-center justify-center rounded-full border border-[#0068ff] h-10 w-10'>
              <AntDesign name='customerservice' size={20} color='#0068ff' />
              <Text className='text-[10px] text-[#0068ff]'>Chat</Text>
            </View>
          </Link>
          <View className='flex-1'>
            <RectangleButton
              onPress={() => handleAddToCart(data)}
              textVariant={data?.product_instock ? 'danger' : 'disabled'}
              title={data?.product_instock ? 'Thêm vào giỏ' : 'Hết hàng'}
              bgVariant={data?.product_instock ? 'primary' : 'disabled'}
              disabled={isLoading || data?.product_instock === false}
              loading={isLoading}
            />
          </View>
          <View className={`${data?.product_instock ? 'flex-1' : 'hidden'}`}>
            <RectangleButton
              onPress={() => handleBuyNow(data)}
              title={'Mua ngay'}
              textVariant='primary'
              bgVariant='outline'
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
};

const Reviews = ({ reviews }: { reviews: Review[] }) => {
  return (
    <FlatList
      renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
      ListEmptyComponent={<Text>Chưa có đánh giá</Text>}
      showsHorizontalScrollIndicator={false}
      initialNumToRender={2}
      data={reviews}
      horizontal
    />
  );
};

const RenderItem = ({ item, index }: { item: Review; index: number }) => {
  return (
    <View key={index} className='mr-2 bg-white rounded-lg p-2 w-[360px]'>
      <View className='flex-row items-center mb-3' style={{ gap: 4 }}>
        {item?.user?.user_img_url != null ? (
          <Image
            className='w-8 h-8 rounded-full border border-primary-pink'
            source={{ uri: item?.user?.user_img_url }}
          />
        ) : (
          <FontAwesome name='user-circle' size={32} color='#fb77c5' />
        )}
        <View>
          <Text className='font-semibold'>{item?.user.user_fullname}</Text>
          <Text className='text-gray-500 text-[12px]'>
            Đánh giá {moment().diff(moment('2024-12-26T15:16:39.186Z'), 'days')}{' '}
            ngày trước
          </Text>
        </View>
      </View>
      <View className='flex-row items-center' style={{ gap: 4 }}>
        {Array(parseInt(item?.review_rating))
          .fill(0)
          .map((item, index) => (
            <FontAwesome name='star' size={16} color='#faa935' key={index} />
          ))}
      </View>
      <Text className='my-1'>{item?.review_comment}</Text>
      <View className='flex-row'>
        <Text className='font-medium'>
          Sản phẩm: {item?.review_productrating}
          <FontAwesome name='star' size={16} color='#faa935' />
        </Text>
        <Text> | </Text>
        <Text className='font-medium'>
          Dịch vụ: {item?.review_servicerating}
          <FontAwesome name='star' size={16} color='#faa935' />
        </Text>
      </View>
    </View>
  );
};

export default ProductInfo;
