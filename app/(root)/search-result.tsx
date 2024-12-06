import { StatusBar, FlatList, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/type';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

const SearchResult = () => {
  const { input, token } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const searchProduct = async () => {
      try {
        // need replace
        const url = `https://hien-phat-expoapp-api.onrender.com/product/search?q=${input}`;
        const res = await axios.get(url);
        if (res.status === 200) {
          const data = res?.data?.products;
          setProducts(data);
        } else {
          console.log('Tìm kiếm không thành công!');
        }
      } catch (error) {
        console.log('Tìm kiếm không thành công!', error);
      } finally {
        setLoading(false);
      }
    };
    searchProduct();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (products.length === 0) {
    return <NoProduct text={'Không tìm thấy sản phẩm'} />;
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <ScreenHeader text={'Kết quả tìm kiếm'} />
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductCard token={token} item={item} size={0.5} />
        )}
        numColumns={2}
        style={{ height: '100%' }}
      />
    </SafeAreaView>
  );
};

export default SearchResult;
