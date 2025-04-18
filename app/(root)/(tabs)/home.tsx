import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image, ScrollView, RefreshControl, View, Button } from 'react-native';
import { Dimensions, FlatList, Pressable } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import axios from 'axios';
import banner2 from '@/assets/slider-img/DonTetSaleHet_MayLocNuoc.png';
import banner1 from '@/assets/slider-img/sale8-3.jpg';
import ProductTitle from '@/components/ProductTitle';
import ProductCard from '@/components/ProductCard';
import SeeMoreCard from '@/components/SeeMoreCard';
import SearchBar from '@/components/SearchBar';
import daisy from '@/assets/images/daisy.png';
import getNewToken from '@/utils/getNewToken';
import { Product } from '@/types/type';
import { slider } from '@/constants';
import LoadingScreen from '../loading-screen';

const Home = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sale, setSale] = useState<Product[]>([]);
  const [electricStove, setElectricStove] = useState<Product[]>([]);
  const [kitchenAppli, setKitchenAppli] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [gasStove, setGasStove] = useState<Product[]>([]);
  // lazy loading
  const [showSuggested, setShowSuggested] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);
  //<<
  const width = Dimensions.get('window').width;
  const idList = {
    bepGas: '28f860e1-fd20-4a43-9625-e1278506f7b4',
    bepDien: '317b0305-3afe-4102-8dd9-71b9a70a8ad4',
    giaDung: 'fa9569fc-c014-4f96-82c7-3d9530dd0561',
    phuKien: '812acba5-6456-4901-9b94-abf78a45531d',
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url1 = `${process.env.EXPO_PUBLIC_API}/product/category/${idList.bepGas}`;
      const url2 = `${process.env.EXPO_PUBLIC_API}/product/category/${idList.bepDien}`;
      const url3 = `${process.env.EXPO_PUBLIC_API}/product/category/${idList.giaDung}`;
      const url4 = `${process.env.EXPO_PUBLIC_API}/product/category/${idList.phuKien}`;
      const url5 = `${process.env.EXPO_PUBLIC_API}/product/top-discount`;
      const [res1, res2, res3, res4, res5] = await Promise.all([
        axios.get(url1),
        axios.get(url2),
        axios.get(url3),
        axios.get(url4),
        axios.get(url5),
      ]);
      setGasStove(res1.data);
      setElectricStove(res2.data);
      setKitchenAppli(res3.data);
      setAccessories(res4.data);
      setSale(res5.data);
    } catch (error) {
      console.error('Lỗi fetch sản phẩm', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

      if (isCloseToBottom && !showSuggested && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          setShowSuggested(true);
          setIsLoading(false);
        }, 1000);
      }
    },
    [isLoading, showSuggested]
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <StatusBar backgroundColor='#fb77c5' style='light' />
      <SearchBar />
      <ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={40}
        showsVerticalScrollIndicator={false}
        className='bg-gray-100'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HorizontalCategory />
        <SwiperFlatList
          autoplay
          autoplayDelay={5}
          autoplayLoop
          data={slider}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push('/sale')}>
              <Image
                source={item}
                style={{
                  height: 0.5625 * width,
                  aspectRatio: '16/9',
                  width: width,
                }}
              />
            </Pressable>
          )}
        />

        <View className='flex-row items-center justify-between bg-white py-1'>
          <Image className='w-12 h-12' source={daisy} />
          <Text className='font-bold text-2xl text-red-500 '>
            Ưu đãi quá trời!
          </Text>
          <Image className='w-12 h-12' source={daisy} />
        </View>

        <FlatList
          data={sale?.slice(0, 6)}
          style={{ backgroundColor: 'white', paddingHorizontal: 4 }}
          renderItem={({ item }) => <ProductCard item={item} size={0.45} />}
          keyExtractor={(item) => item?.product_id}
          showsHorizontalScrollIndicator={false}
          horizontal
        />

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Bếp gas'} />
          <View className='flex-row flex-wrap mt-5'>
            {gasStove.slice(0, 8).map((item, index) => (
              <ProductCard key={index} item={item} size={0.5} />
            ))}
          </View>
          <SeeMoreCard categoryId={idList.bepGas} extraText={'Bếp gas'} />
        </View>

        <Pressable onPress={() => router.push('/sale')}>
          <Image className='w-full h-[60px]' source={banner1} />
        </Pressable>

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Bếp điện'} />
          <View className='flex-row flex-wrap mt-5'>
            {electricStove.slice(0, 8).map((item, index) => (
              <ProductCard key={index} item={item} size={0.5} />
            ))}
          </View>
          <SeeMoreCard categoryId={idList.bepDien} extraText={'Bếp điện'} />
        </View>

        <Pressable onPress={() => router.push('/sale')}>
          <Image className='w-full h-[140px]' source={banner2} />
        </Pressable>

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Gia dụng'} />
          <View className='flex-row flex-wrap mt-5'>
            {kitchenAppli.slice(0, 8).map((item, index) => (
              <ProductCard key={index} item={item} size={0.5} />
            ))}
          </View>
          <SeeMoreCard categoryId={idList.giaDung} extraText={'Gia dụng'} />
        </View>

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Phụ kiện'} />
          <View className='flex-row flex-wrap mt-5'>
            {accessories.slice(0, 8).map((item, index) => (
              <ProductCard key={index} item={item} size={0.5} />
            ))}
          </View>
          <SeeMoreCard categoryId={idList.phuKien} extraText={'Phụ kiện'} />
        </View>

        <View className='border-t-2 border-primary-pink my-2 bg-white'>
          <View className='px-3 pt-2'>
            <Text className='font-semibold text-primary-pink text-[16px]'>
              Thương hiệu nổi bật
            </Text>
          </View>
          <HorizontalBrand />
        </View>

        {isLoading && (
          <View className='mt-2 mb-6 items-center'>
            <ActivityIndicator color='#fb77c5' />
          </View>
        )}

        {showSuggested && <SuggestedProduct />}
      </ScrollView>
    </SafeAreaView>
  );
};

const HorizontalCategory = () => {
  const [catList, setCatList] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_API}/category`;
        const res = await axios.get(url);
        if (res.status === 200) {
          setCatList(res.data);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          await getNewToken();
        } else {
          console.error('Lỗi Horizontal category ', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  if (loading) {
    return (
      <View className='h-[84px] flex justify-center'>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/(root)/product-filter',
              params: {
                id: item?.category_id,
                type: 'category',
              },
            })
          }
          className='m-1'
        >
          <Image
            resizeMode='contain'
            className='w-20 h-20'
            source={{ uri: item?.category_img_url }}
          />
          <Text className='text-center font-medium'>{item?.category_name}</Text>
        </Pressable>
      )}
      showsHorizontalScrollIndicator={false}
      data={catList}
      keyExtractor={(item) => item?.category_id}
      horizontal
      style={{ backgroundColor: 'white' }}
    />
  );
};

const HorizontalBrand = () => {
  const [brandList, setBrandList] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_API}/brand`;
        const res = await axios.get(url);
        if (res.status === 200) {
          setBrandList(res?.data.reverse());
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          await getNewToken();
        } else {
          console.error('Lỗi Horizontal brand ', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, []);

  if (loading) {
    return (
      <View className='h-[84px] flex justify-center'>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/(root)/product-filter',
              params: { id: item?.brand_id, type: 'brand' },
            })
          }
          className='m-1'
        >
          <Image
            resizeMode='contain'
            className='w-20 h-20'
            source={{ uri: item?.brand_img_url }}
          />
          <Text className='text-center font-medium'>{item?.brand_name}</Text>
        </Pressable>
      )}
      showsHorizontalScrollIndicator={false}
      data={brandList}
      keyExtractor={(item) => item?.brand_id}
      horizontal
    />
  );
};

const SuggestedProduct = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API}/product`);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, []);

  if (loading) {
    return (
      <View className='h-[84px] flex justify-center'>
        <ActivityIndicator color='#fb77c5' />
      </View>
    );
  }

  return (
    <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
      <ProductTitle text={'Mua gì hôm nay'} />
      <View className='flex-row flex-wrap mt-5'>
        {data?.slice(0, 24).map((item, index) => (
          <ProductCard key={index} item={item} size={0.5} />
        ))}
        {!showMore && (
          <View className='w-full p-5'>
            <Button
              title='Tải thêm'
              onPress={() => setShowMore(true)}
              color={'#fb77c5'}
            />
          </View>
        )}
        {showMore &&
          data
            ?.slice(24, data?.length)
            .map((item, index) => (
              <ProductCard key={index} item={item} size={0.5} />
            ))}
      </View>
    </View>
  );
};

export default Home;
