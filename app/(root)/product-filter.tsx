import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import useGetData from '@/customHooks/useGetData';
import SearchBar from '@/components/SearchBar';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

const ProductFilter = () => {
  const { id, type } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const url = `${process.env.EXPO_PUBLIC_API}/product/${type}/${id}`;
  const { data: products, loading, refetch } = useGetData<Product[]>(url);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (products?.length === 0) {
    return <NoProduct text={'Chưa có sản phẩm'} />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <StatusBar backgroundColor='#fb77c5' style='light' />
      <SearchBar />
      <ScreenHeader text={'Sản phẩm'} bg='white' textColor='black' />
      <FlatList
        keyExtractor={(item) => item?.product_id}
        className='bg-white'
        data={products}
        initialNumToRender={6}
        numColumns={2}
        renderItem={({ item }) => <ProductCard item={item} size={0.5} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default ProductFilter;
