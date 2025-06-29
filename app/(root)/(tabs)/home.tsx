import { Image, ScrollView, RefreshControl, View } from 'react-native';
import { Dimensions, FlatList, Pressable } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text } from 'react-native';
import React, { useCallback, useState } from 'react';
import { router } from 'expo-router';
import axios from 'axios';
import { IBanner, IBrand, ICategory, Product } from '@/types/type';
import useGetMultipleData from '@/customHooks/useGetMultipleData';
import loadingIcon from '@/assets/icons/Loading_icon.gif';
import banner1 from '@/assets/slider-img/banner3.jpg';
import ProductTitle from '@/components/ProductTitle';
import ProductCard from '@/components/ProductCard';
import SeeMoreCard from '@/components/SeeMoreCard';
import useGetData from '@/customHooks/useGetData';
import SearchBar from '@/components/SearchBar';
import daisy from '@/assets/images/daisy.png';
import LoadingScreen from '../loading-screen';
import NoProduct from '../no-product';

const idList = {
  bepGas: '28f860e1-fd20-4a43-9625-e1278506f7b4',
  bepDien: '317b0305-3afe-4102-8dd9-71b9a70a8ad4',
  giaDung: 'fa9569fc-c014-4f96-82c7-3d9530dd0561',
  phuKien: '812acba5-6456-4901-9b94-abf78a45531d',
};

const urls = [
  `${process.env.EXPO_PUBLIC_API}/product/category/${idList.bepGas}`,
  `${process.env.EXPO_PUBLIC_API}/product/category/${idList.bepDien}`,
  `${process.env.EXPO_PUBLIC_API}/product/category/${idList.giaDung}`,
  `${process.env.EXPO_PUBLIC_API}/product/category/${idList.phuKien}`,
  `${process.env.EXPO_PUBLIC_API}/product/top-discount`,
];

const bannerUrl = `${process.env.EXPO_PUBLIC_API}/banner`;

const Home = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  // lazy loading
  const [data, setData] = useState<Product[]>([]);
  const [lazyLoad, setLazyLoading] = useState<boolean>(false);
  const [noMore, setNoMore] = useState<boolean>(false);
  const [start, setStart] = useState<number>(1);
  const [end, setEnd] = useState<number>(13);
  //<<
  const width = Dimensions.get('window').width;

  const {
    data: products,
    refetch,
    loading,
  } = useGetMultipleData<
    [Product[], Product[], Product[], Product[], Product[]]
  >(urls);
  const { data: banner } = useGetData<IBanner[]>(bannerUrl);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const getSuggestProduct = async () => {
    // Mỗi khi cuộn đến cuối màn hình sẽ load thêm 12 sản phẩm
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

  if (products && banner) {
    const gasStove = products[0]?.slice(0, 6);
    const electricStove = products[1]?.slice(0, 6);
    const kitchenAppli = products[2]?.slice(0, 6);
    const accessories = products[3]?.slice(0, 6);
    const sale = products[4]?.slice(0, 6);
    const mainBanner = banner.filter((b) => b.banner_type === 'main');

    return (
      <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
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
            data={mainBanner.map((banner) => banner.banner_img_url)}
            renderItem={({ item }) => (
              <Pressable onPress={() => router.push('/sale')}>
                <Image
                  source={{ uri: item }}
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
            keyExtractor={(item) => item?.product_id.toString()}
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
              source={banner1}
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
  }

  return <NoProduct text='Không tải được sản phẩm' />;
};

interface ISectionProps {
  title: string;
  data: Product[];
  cateId: string;
}

const ProductSection = ({ data, cateId, title }: ISectionProps) => {
  return (
    <FlatList
      data={data}
      numColumns={2}
      scrollEnabled={false}
      keyExtractor={(item) => item?.product_id.toString()}
      renderItem={({ item }) => <ProductCard item={item} size={0.5} />}
      className='border-t-2 border-primary-pink mt-2 relative bg-white'
      ListHeaderComponent={
        <View className='px-2 py-1 bg-primary-pink w-1/3 rounded-br-3xl'>
          <Text className='font-semibold text-white uppercase text-xl'>
            {title}
          </Text>
        </View>
      }
      ListFooterComponent={
        <SeeMoreCard categoryId={cateId} extraText={title} />
      }
    />
  );
};

const HorizontalCategory = () => {
  const url = `${process.env.EXPO_PUBLIC_API}/category`;
  const { data: catList, loading } = useGetData<ICategory[]>(url);

  const navToFilter = (id: string) => {
    router.push({
      pathname: '/(root)/product-filter',
      params: {
        id,
        type: 'category',
      },
    });
  };

  if (loading) {
    return (
      <View className='h-[84px] flex justify-center'>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className='bg-white mt-2 pb-1 border-t-2 border-primary-pink'>
      <Text className='px-3 pt-1 font-semibold text-primary-pink text-[16px]'>
        Danh mục
      </Text>
      <FlatList
        renderItem={({ item }) => (
          <Pressable onPress={() => navToFilter(item?.category_id)}>
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
        ItemSeparatorComponent={() => <View className='w-2' />}
        keyExtractor={(item) => item?.category_id.toString()}
        showsHorizontalScrollIndicator={false}
        data={catList}
        horizontal
        contentContainerStyle={{ marginLeft: 12 }}
      />
    </View>
  );
};

const HorizontalBrand = () => {
  const url = `${process.env.EXPO_PUBLIC_API}/brand`;
  const { data: brandList, loading } = useGetData<IBrand[]>(url);

  const navToFilter = (id: string) => {
    router.push({
      pathname: '/(root)/product-filter',
      params: { id, type: 'brand' },
    });
  };

  if (loading) {
    return (
      <View className='h-[84px] flex justify-center'>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className='border-t-2 border-primary-pink my-2 pb-1 bg-white'>
      <Text className='px-3 pt-1 font-semibold text-primary-pink text-[16px]'>
        Thương hiệu
      </Text>
      <FlatList
        renderItem={({ item }) => (
          <Pressable onPress={() => navToFilter(item?.brand_id)}>
            <Image
              resizeMode='contain'
              className='w-20 h-20'
              source={{ uri: item?.brand_img_url }}
              loadingIndicatorSource={loadingIcon}
            />
            <Text className='text-center font-medium'>{item?.brand_name}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View className='w-2' />}
        contentContainerStyle={{ marginLeft: 12 }}
        keyExtractor={(item) => item?.brand_id.toString()}
        showsHorizontalScrollIndicator={false}
        data={brandList}
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
    <View className='relative mt-5 bg-white border-t-2 border-primary-pink'>
      <ProductTitle text={'Gợi ý cho bạn'} />
      <FlatList
        numColumns={2}
        data={data}
        keyExtractor={(item) => item?.product_id.toString()}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => <ProductCard item={item} size={0.5} />}
        scrollEnabled={false}
        ListHeaderComponent={
          <>
            {loading && (
              <View className='mt-2 mb-6 items-center'>
                <ActivityIndicator color='#fb77c5' />
              </View>
            )}
          </>
        }
      />
    </View>
  );
};

export default Home;
