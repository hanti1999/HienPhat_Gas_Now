import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import useGetData from '@/customHooks/useGetData';
import SearchBar from '@/components/SearchBar';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

const ProductFilter = () => {
  const { id, type } = useLocalSearchParams();
  const url = useMemo(() => {
    return `${process.env.EXPO_PUBLIC_API}/product/${type}/${id}`;
  }, [type, id]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: products, loading, refetch } = useGetData<Product[]>(url);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard item={item} size={0.5} />,
    []
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  if (!products || products?.length === 0) {
    return <NoProduct text={'Chưa có sản phẩm'} />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <FlatList
        keyExtractor={(item) => item?.product_id}
        className='bg-white'
        data={products}
        initialNumToRender={6}
        numColumns={2}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            <SearchBar />
            <ScreenHeader text={'Sản phẩm'} bg='white' textColor='black' />
          </>
        }
      />
    </SafeAreaView>
  );
};

export default ProductFilter;
