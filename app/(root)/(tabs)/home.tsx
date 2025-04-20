import { Image, ScrollView, RefreshControl, View } from 'react-native';
import { Dimensions, FlatList, Pressable } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import axios from 'axios';
import { IBrand, ICategory, Product } from '@/types/type';
import loadingIcon from '@/assets/icons/Loading_icon.gif';
import banner1 from '@/assets/slider-img/banner3.jpg';
import banner2 from '@/assets/slider-img/banner3.jpg';
import ProductTitle from '@/components/ProductTitle';
import ProductCard from '@/components/ProductCard';
import SeeMoreCard from '@/components/SeeMoreCard';
import useGetData from '@/customHooks/useGetData';
import SearchBar from '@/components/SearchBar';
import daisy from '@/assets/images/daisy.png';
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
  const [data, setData] = useState<Product[]>([]);
  const [lazyLoad, setLazyLoading] = useState<boolean>(false);
  const [noMore, setNoMore] = useState<boolean>(false);
  const [start, setStart] = useState<number>(1);
  const [end, setEnd] = useState<number>(13);
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
      setGasStove(res1.data?.slice(0, 6));
      setElectricStove(res2.data?.slice(0, 6));
      setKitchenAppli(res3.data?.slice(0, 6));
      setAccessories(res4.data?.slice(0, 6));
      setSale(res5.data?.slice(0, 6));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getSuggestProduct = async () => {
    // Mỗi khi cuộn đến cuối màn hình sẽ load thêm 12 sản phẩm
    // bugs: lần cuộn đầu sẽ fetch đến 24 sản phẩm?
    try {
      setLazyLoading(true);
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API}/product`);
      if (res.status === 200) {
        setData((prevData) => [...prevData, ...res.data.slice(start, end)]);
        setStart(end);
        setEnd((end) => end + 12);
        if (start > res.data.length) {
          setNoMore(true);
        }
      }
    } catch (error) {
    } finally {
      setLazyLoading(false);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 50;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <StatusBar backgroundColor='#fb77c5' style='light' />
      <SearchBar />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && !lazyLoad && noMore === false) {
            getSuggestProduct();
          }
        }}
        scrollEventThrottle={40}
        showsVerticalScrollIndicator={false}
        className='bg-gray-100'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                  resizeMode: 'contain',
                  width: width,
                  height: (width / 16) * 6,
                }}
              />
            </Pressable>
          )}
        />

        <HorizontalCategory />

        <HorizontalBrand />

        <View className='flex-row items-center justify-between bg-white py-1'>
          <Image className='w-12 h-12' source={daisy} />
          <Text className='font-bold text-2xl text-red-500 '>
            Ưu đãi quá trời!
          </Text>
          <Image className='w-12 h-12' source={daisy} />
        </View>

        <FlatList
          data={sale}
          style={{ backgroundColor: 'white', paddingHorizontal: 4 }}
          renderItem={({ item }) => <ProductCard item={item} size={0.45} />}
          keyExtractor={(item) => item?.product_id}
          showsHorizontalScrollIndicator={false}
          horizontal
        />

        <ProductSection
          title='Bếp gas'
          data={gasStove}
          cateId={idList.bepGas}
        />

        <Pressable onPress={() => router.push('/sale')}>
          <Image
            style={{ resizeMode: 'contain', width: width, height: 80 }}
            source={banner1}
          />
        </Pressable>

        <ProductSection
          title='Bếp điện'
          data={electricStove}
          cateId={idList.bepDien}
        />

        <Pressable onPress={() => router.push('/sale')}>
          <Image
            style={{ resizeMode: 'contain', width: width, height: 80 }}
            source={banner2}
          />
        </Pressable>

        <ProductSection
          title='Gia dụng'
          data={kitchenAppli}
          cateId={idList.giaDung}
        />

        <ProductSection
          title='Phụ kiện'
          data={accessories}
          cateId={idList.phuKien}
        />

        <SuggestedProduct data={data} loading={lazyLoad} />
      </ScrollView>
    </SafeAreaView>
  );
};

interface ISectionProps {
  title: string;
  data: Product[];
  cateId: string;
}

const ProductSection = ({ data, cateId, title }: ISectionProps) => {
  return (
    <View className='border-t-2 border-primary-pink mt-2 relative bg-white'>
      <View className='px-2 py-1 bg-primary-pink w-1/3 rounded-br-3xl'>
        <Text className='font-semibold text-white uppercase text-xl'>
          {title}
        </Text>
      </View>
      <View className='flex-row flex-wrap mt-2'>
        {data.map((item, index) => (
          <ProductCard key={index} item={item} size={0.5} />
        ))}
      </View>
      <SeeMoreCard categoryId={cateId} extraText={title} />
    </View>
  );
};

const HorizontalCategory = () => {
  const url = `${process.env.EXPO_PUBLIC_API}/category`;
  const { data: catList, loading } = useGetData<ICategory[]>(url);

  if (loading) {
    return (
      <View className='h-[84px] flex justify-center'>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className='bg-white mt-2 border-t-2 border-primary-pink'>
      <Text className='px-3 pt-1 font-semibold text-primary-pink text-[16px]'>
        Danh mục
      </Text>
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
              loadingIndicatorSource={loadingIcon}
            />
            <Text className='text-center font-medium'>
              {item?.category_name}
            </Text>
          </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
        data={catList}
        keyExtractor={(item) => item?.category_id}
        horizontal
        style={{ backgroundColor: 'white' }}
      />
    </View>
  );
};

const HorizontalBrand = () => {
  const url = `${process.env.EXPO_PUBLIC_API}/brand`;
  const { data: brandList, loading } = useGetData<IBrand[]>(url);

  if (loading) {
    return (
      <View className='h-[84px] flex justify-center'>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className='border-t-2 border-primary-pink my-2 bg-white'>
      <Text className='px-3 pt-1 font-semibold text-primary-pink text-[16px]'>
        Thương hiệu
      </Text>
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
              loadingIndicatorSource={loadingIcon}
            />
            <Text className='text-center font-medium'>{item?.brand_name}</Text>
          </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
        data={brandList}
        keyExtractor={(item) => item?.brand_id}
        horizontal
      />
    </View>
  );
};

interface IProps {
  data: Product[];
  loading: boolean;
}

const SuggestedProduct = ({ data, loading }: IProps) => {
  return (
    <View className='border-t-2 border-primary-pink mt-5 relative bg-white'>
      <ProductTitle text={'Gợi ý cho bạn'} />
      <View className='flex-row flex-wrap mt-5'>
        {data?.map((item, index) => (
          <ProductCard key={index} item={item} size={0.5} />
        ))}
      </View>
      {loading && (
        <View className='mt-2 mb-6 items-center'>
          <ActivityIndicator color='#fb77c5' />
        </View>
      )}
    </View>
  );
};

export default Home;
