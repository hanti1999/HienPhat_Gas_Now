import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import getNewToken from '@/utils/getNewToken';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

const ProductFilter = () => {
  const { id, token, type } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProductByBrand = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/product/${type}/${id}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      if (res.status === 200) {
        setProducts(res?.data);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.error('Lỗi (Product-filter)', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductByBrand();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProductByBrand();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (products.length === 0) {
    return <NoProduct text={'Chưa có sản phẩm'} />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <SearchBar token={token as string} />
      <ScreenHeader text={'Sản phẩm'} />
      <FlatList
        keyExtractor={(item) => item?.product_id}
        className='bg-white h-full'
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard item={item} token={token} size={0.5} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default ProductFilter;
