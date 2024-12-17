import { SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';
import ScreenHeader from '@/components/ScreenHeader';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/type';

const Wishlist = () => {
  const { token } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const fetchWishlist = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/`;
      const res = await axios.get(url);
      if (res.status === 200) {
        const wishlist = res.data.reverse();
        setWishlist(wishlist);
      } else {
        console.error(res.data?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishlist();
    setRefreshing(false);
  };

  // useEffect(() => {
  //   fetchWishlist();
  // }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (wishlist.length === 0) {
    return <NoProduct text={'Nơi này trống!'} />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScreenHeader text={'Danh sách yêu thích'} showCart={true} />
      <FlatList
        keyExtractor={(item) => item?.product_id}
        style={{ height: '100%' }}
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
