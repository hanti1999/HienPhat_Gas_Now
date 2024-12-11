import { Image, ScrollView, RefreshControl, View, Text } from 'react-native';
import { StatusBar, Dimensions, FlatList, Pressable } from 'react-native';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swiper from 'react-native-swiper';
import { router } from 'expo-router';
import axios from 'axios';
import banner2 from '@/assets/slider-img/DonTetSaleHet_MayLocNuoc.png';
import banner1 from '@/assets/slider-img/sale8-3.jpg';
import ProductTitle from '@/components/ProductTitle';
import ProductCard from '@/components/ProductCard';
import SeeMoreCard from '@/components/SeeMoreCard';
import SearchBar from '@/components/SearchBar';
// import daisy from '@/assets/images/daisy.png';
import { RootState } from '@/redux/store';
import { Product } from '@/types/type';
import { slider } from '@/constants';
import LoadingScreen from '../loading-screen';

const Home = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  // const [products, setProduct] = useState<Product[]>([]);
  const [electricStove, setElectricStove] = useState<Product[]>([]);
  const [kitchenAppli, setKitchenAppli] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [gasStove, setGasStove] = useState<Product[]>([]);

  const width = Dimensions.get('window').width;

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url1 = `${process.env.EXPO_PUBLIC_API}/product/category/90ebec20-4240-446c-a6ef-856b0c7fc730`;
      // url2 need replace
      const url2 = `${process.env.EXPO_PUBLIC_API}/product/category/553cfa8a-5bb6-4b48-a253-a9460a5c8922`;
      const url3 = `${process.env.EXPO_PUBLIC_API}/product/category/553cfa8a-5bb6-4b48-a253-a9460a5c8922`;
      // url4 need replace
      const url4 = `${process.env.EXPO_PUBLIC_API}/product/category/553cfa8a-5bb6-4b48-a253-a9460a5c8922`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const [response1, response2, response3, response4] = await Promise.all([
        axios.get(url1, config),
        axios.get(url2, config),
        axios.get(url3, config),
        axios.get(url4, config),
      ]);

      setGasStove(response1.data);
      setElectricStove(response2.data);
      setKitchenAppli(response3.data);
      setAccessories(response4.data);
    } catch (error) {
      console.error('Lỗi fetch sản phẩm', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className='flex-1 bg-primary-pink'>
      <StatusBar />
      <ScrollView
        stickyHeaderIndices={[0]}
        className='bg-gray-100'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SearchBar token={token} />
        <HorizontalCategory token={token} />
        <Swiper
          dot={<View className='w-1 h-1 mx-1 bg-gray-200 rounded-full' />}
          activeDot={
            <View className='w-1 h-1 mx-1 bg-primary-pink rounded-full' />
          }
          height={0.5625 * width}
          autoplayTimeout={5}
          autoplay={true}
          width={width}
          loop={true}
        >
          {slider.map((item, index) => (
            <Image
              source={item}
              key={index}
              style={{
                height: 0.5625 * width,
                aspectRatio: '16/9',
                width: width,
              }}
            />
          ))}
        </Swiper>

        {/* <View className='flex-row items-center justify-between bg-white py-1'>
          <Image className='w-12 h-12' source={daisy} />
          <Text className='font-bold text-2xl text-red-500 '>
            Ưu đãi quá trời!
          </Text>
          <Image className='w-12 h-12' source={daisy} />
        </View>

        <FlatList
          data={sale?.slice(0, 6)}
          style={{ backgroundColor: 'white', paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <ProductCard token={token} item={item} size={0.45} />
          )}
          keyExtractor={(item) => item?.product_id}
          showsHorizontalScrollIndicator={false}
          horizontal
        /> */}

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Bếp gas'} />

          <FlatList
            data={gasStove?.slice(0, 6)}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 4,
              marginTop: 20,
            }}
            renderItem={({ item }) => (
              <ProductCard token={token} item={item} size={0.45} />
            )}
            keyExtractor={(item) => item?.product_id}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
          <SeeMoreCard
            token={token}
            categoryId={'90ebec20-4240-446c-a6ef-856b0c7fc730'}
            extraText={'Bếp gas'}
          />
        </View>

        <Image className='w-full h-[60px]' source={banner1} />

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Bếp điện'} />

          <FlatList
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 4,
              marginTop: 20,
            }}
            renderItem={({ item }) => (
              <ProductCard token={token} item={item} size={0.45} />
            )}
            keyExtractor={(item) => item?.product_id}
            data={electricStove?.slice(0, 6)}
            showsHorizontalScrollIndicator={false}
            horizontal
          />

          <SeeMoreCard
            token={token}
            categoryId={'553cfa8a-5bb6-4b48-a253-a9460a5c8922'}
            extraText={'Bếp điện'}
          />
        </View>

        <Image className='w-full h-[140px]' source={banner2} />

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Gia dụng'} />

          <FlatList
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 4,
              marginTop: 20,
            }}
            renderItem={({ item }) => (
              <ProductCard token={token} item={item} size={0.45} />
            )}
            keyExtractor={(item) => item?.product_id}
            data={kitchenAppli?.slice(0, 6)}
            showsHorizontalScrollIndicator={false}
            horizontal
          />

          <SeeMoreCard
            token={token}
            categoryId={'553cfa8a-5bb6-4b48-a253-a9460a5c8922'}
            extraText={'Gia dụng'}
          />
        </View>

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Phụ kiện'} />

          <FlatList
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 4,
              marginTop: 20,
            }}
            renderItem={({ item }) => (
              <ProductCard token={token} item={item} size={0.45} />
            )}
            keyExtractor={(item) => item?.product_id}
            data={accessories?.slice(0, 6)}
            showsHorizontalScrollIndicator={false}
            horizontal
          />

          <SeeMoreCard
            token={token}
            categoryId={'553cfa8a-5bb6-4b48-a253-a9460a5c8922'}
            extraText={'Phụ kiện'}
          />
        </View>

        <View className='border-t-2 border-primary-pink my-2 bg-white'>
          <View className='px-3 pt-2'>
            <Text className='font-semibold text-primary-pink text-[16px]'>
              Thương hiệu
            </Text>
          </View>
          <HorizontalBrand token={token} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const HorizontalCategory = ({ token }: { token: string | null }) => {
  const [catList, setCatList] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_API}/category`;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(url, config);

        if (res.status === 200) {
          const cat = res.data;
          setCatList(cat);
        } else {
          console.error(res.data?.message);
        }
      } catch (error) {
        console.error('Lỗi Horizontal category', error);
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
                token: token,
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

const HorizontalBrand = ({ token }: { token: string | null }) => {
  const [brandList, setBrandList] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_API}/brand`;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(url, config);
        if (res.status === 200) {
          setBrandList(res?.data.reverse());
        } else {
          console.error(res.data?.message);
        }
      } catch (error) {
        console.error('Lỗi Horizontal brand ', error);
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
              params: { id: item?.brand_id, token: token, type: 'brand' },
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

export default Home;
