import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import LoadingScreen from './loading-screen';
import ErrorScreen from './error-screen';
import NoProduct from './no-product';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import useGetData from '@/customHooks/useGetData';
import { Product } from '@/types/type';

const url = `${process.env.EXPO_PUBLIC_API}/wishlist`;

const Wishlist = () => {
  const { token } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );
  const {
    data: wishlist,
    error,
    refetch,
    loading,
  } = useGetData<Product[]>(url, config);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => <ProductCard item={item} size={0.5} />,
    []
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (error) {
    return <ErrorScreen onRetry={refetch} />;
  }

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  if (!wishlist || wishlist?.length === 0) {
    return <NoProduct text={'Nơi này trống!'} />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <FlatList
        keyExtractor={(item) => item?.product_id}
        style={{ height: '100%' }}
        className='bg-gray-100'
        data={wishlist}
        numColumns={2}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={<ScreenHeader text={'Danh sách yêu thích'} />}
      />
    </SafeAreaView>
  );
};

export default Wishlist;
