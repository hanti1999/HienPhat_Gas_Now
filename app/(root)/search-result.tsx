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
        const url = `${process.env.EXPO_PUBLIC_API}/product/search?search=${input}`;
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
        console.error('Tìm kiếm không thành công!', error);
      } finally {
        setLoading(false);
      }
    };
    searchProduct();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (products?.length === 0) {
    return <NoProduct text={'Không tìm thấy sản phẩm'} />;
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <ScreenHeader text={'Kết quả tìm kiếm'} />
      <FlatList
        keyExtractor={(item) => item.product_id}
        style={{ height: '100%' }}
        data={products}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard token={token} item={item} size={0.5} />
        )}
      />
    </SafeAreaView>
  );
};

export default SearchResult;
