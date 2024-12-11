import { FlatList, SafeAreaView, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

const ProductByCategory = () => {
  const { categoryId, token } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProductByCat = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}`;
      const res = await axios.get(url);

      if (res.status === 200) {
        const data = res?.data.products;
        setProducts(data);
      } else {
        console.log('Fetch sản phẩm không thành công');
      }
    } catch (error) {
      console.log('Lỗi (ProductByCategorySceen)', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchProductByCat();
  // }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProductByCat();
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
        keyExtractor={(item) => item?._id}
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

export default ProductByCategory;
