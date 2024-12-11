import { FlatList, SafeAreaView, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
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
        const data = res?.data;
        setProducts(data);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error('Lỗi (ProductByCategorySceen)', error);
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
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <ScreenHeader text={'Sản phẩm'} />
      <FlatList
        keyExtractor={(item) => item?.product_id}
        style={{ height: '100%' }}
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
