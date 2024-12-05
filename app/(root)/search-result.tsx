import { useLocalSearchParams } from 'expo-router';
import { StatusBar, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/type';
import axios from 'axios';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

interface SearchParams {
  input: string;
  token: string | null;
}

const SearchResult = () => {
  const { input, token } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

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
        console.log('Lỗi (SearchResultList)', error);
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
