import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';
import { useMemo } from 'react';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import useGetData from '@/customHooks/useGetData';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

const SearchResult = () => {
  const { input } = useLocalSearchParams();
  const url = useMemo(() => {
    return `${process.env.EXPO_PUBLIC_API}/product/search?search=${input}`;
  }, [input]);
  const { data: products, loading } = useGetData<Product[]>(url);

  if (loading) {
    return <LoadingScreen />;
  }

  if (products?.length === 0) {
    return <NoProduct text={'Không tìm thấy sản phẩm'} />;
  }

  return (
    <SafeAreaView edges={['top']} className='bg-primary-pink flex-1'>
      <FlatList
        keyExtractor={(item) => item.product_id}
        style={{ height: '100%' }}
        className='bg-gray-100'
        data={products}
        numColumns={2}
        renderItem={({ item }) => <ProductCard item={item} size={0.5} />}
        ListHeaderComponent={<ScreenHeader text={'Kết quả tìm kiếm'} />}
      />
    </SafeAreaView>
  );
};

export default SearchResult;
