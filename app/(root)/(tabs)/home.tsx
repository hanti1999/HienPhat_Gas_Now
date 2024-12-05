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
import daisy from '@/assets/images/daisy.png';
import { RootState } from '@/redux/store';
import { Product } from '@/types/type';
import { slider } from '@/constants';
import LoadingScreen from '../loading-screen';

const Home = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [products, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const width = Dimensions.get('window').width;

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const fetchProducts = async () => {
    try {
      const api = `https://hien-phat-expoapp-api.onrender.com/product`;
      const res = await axios.get(api);
      if (res.status === 200) {
        const data = res?.data?.products;
        setProduct(data);
      } else {
        console.error('Lỗi!, không fetch được sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi HomeScreen - fet Products', error);
    } finally {
      setLoading(false);
    }
  };

  const bepGas = products?.filter(
    (product) => product.category.name === 'Bếp gas'
  );

  let bepDien = products?.filter(
    (product) => product.category.name === 'Bếp điện'
  );

  let giaDung = products?.filter(
    (product) => product.category.name === 'Gia dụng'
  );

  let phuKien = products?.filter(
    (product) => product.category.name === 'Phụ kiện'
  );

  let sale = products?.filter((product) => product?.discount > 10);

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
          loop={true}
          autoplay={true}
          autoplayTimeout={5}
          height={0.5625 * width}
          width={width}
        >
          {slider.map((item, index) => (
            <Image
              key={index}
              source={item}
              style={{
                height: 0.5625 * width,
                aspectRatio: '16/9',
                width: width,
              }}
            />
          ))}
        </Swiper>

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
          renderItem={({ item }) => (
            <ProductCard token={token} item={item} size={0.45} />
          )}
          keyExtractor={(item) => item?._id}
          showsHorizontalScrollIndicator={false}
          horizontal
        />

        <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
          <ProductTitle text={'Bếp gas'} />

          <FlatList
            data={bepGas?.slice(0, 6)}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 4,
              marginTop: 20,
            }}
            renderItem={({ item }) => (
              <ProductCard token={token} item={item} size={0.45} />
            )}
            keyExtractor={(item) => item?._id}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
          <SeeMoreCard
            token={token}
            categoryId={'6666d75349ada55e0903d7ec'}
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
            keyExtractor={(item) => item?._id}
            data={bepDien?.slice(0, 6)}
            showsHorizontalScrollIndicator={false}
            horizontal
          />

          <SeeMoreCard
            token={token}
            categoryId={'6667cd3d026b92076ff622a5'}
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
            keyExtractor={(item) => item?._id}
            data={giaDung?.slice(0, 6)}
            showsHorizontalScrollIndicator={false}
            horizontal
          />

          <SeeMoreCard
            token={token}
            categoryId={'6667cd99026b92076ff622a7'}
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
            keyExtractor={(item) => item?._id}
            data={phuKien?.slice(0, 6)}
            showsHorizontalScrollIndicator={false}
            horizontal
          />

          <SeeMoreCard
            token={token}
            categoryId={'6667cdc6026b92076ff622ab'}
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
  const [catList, setCatList] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const url = `https://hien-phat-expoapp-api.onrender.com/category`;
        const res = await axios.get(url);

        if (res.status === 200) {
          const cat = res.data.category;
          setCatList(cat);
        } else {
          console.log('Lỗi, fetch category không thành công');
        }
      } catch (error) {
        console.log('Lỗi Horizontal category', error);
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
              pathname: '/(root)/product-by-category',
              params: { categoryId: item?._id, token: token },
            })
          }
          className='m-1'
        >
          <Image
            resizeMode='contain'
            className='w-20 h-20'
            source={{ uri: item?.image }}
          />
          <Text className='text-center font-medium'>{item?.name}</Text>
        </Pressable>
      )}
      showsHorizontalScrollIndicator={false}
      data={catList}
      keyExtractor={(item) => item?._id}
      horizontal
      style={{ backgroundColor: 'white' }}
    />
  );
};

const HorizontalBrand = ({ token }: { token: string | null }) => {
  const [brandList, setBrandList] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const url = `https://hien-phat-expoapp-api.onrender.com/brand`;
        const res = await axios.get(url);
        if (res.status === 200) {
          setBrandList(res?.data.brand.reverse());
        } else {
          console.log('Fetch brand không thành công (HomeScreen)');
        }
      } catch (error) {
        console.log('Fetch brand không thành công (HomeScreen)');
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
              pathname: '/(root)/product-by-brand',
              params: { brandId: item?._id, token: token },
            })
          }
          className='m-1'
        >
          <Image
            resizeMode='contain'
            className='w-20 h-20'
            source={{ uri: item?.image }}
          />
          <Text className='text-center font-medium'>{item?.name}</Text>
        </Pressable>
      )}
      showsHorizontalScrollIndicator={false}
      data={brandList}
      keyExtractor={(item) => item?._id}
      horizontal
    />
  );
};

export default Home;
