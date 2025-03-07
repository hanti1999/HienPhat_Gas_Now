import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import getNewToken from '@/utils/getNewToken';
import { Product } from '@/types/type';

const Wishlist = () => {
  const { token } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const fetchWishlist = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/wishlist`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      if (res.status === 200) {
        setWishlist(res.data.wishlist);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.error(error);
        Toast.show({ type: 'error', text1: 'Lấy danh sách không thành công' });
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishlist();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (wishlist.length === 0) {
    return <NoProduct text={'Nơi này trống!'} />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <StatusBar backgroundColor='#fb77c5' style='light' />
      <ScreenHeader text={'Danh sách yêu thích'} />
      <FlatList
        keyExtractor={(item) => item?.product_id}
        style={{ height: '100%' }}
        className='bg-gray-100'
        data={wishlist}
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

export default Wishlist;
