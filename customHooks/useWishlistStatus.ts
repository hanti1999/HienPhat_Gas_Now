import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import getNewToken from '@/utils/getNewToken';
import Toast from 'react-native-toast-message';
import { Product } from '@/types/type';
import { router } from 'expo-router';

export const useWishlistStatus = (
  productId: string | string[],
  token: string | null
) => {
  const [inWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const checkWishlist = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/wishlist`;
      const res = await axios.get(url, config);
      if (res.status === 200) {
        const products: Product[] = res.data;
        const filteredProducts = products.find(
          (p) => p.product_id === productId
        );
        setIsInWishlist(filteredProducts !== undefined);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        getNewToken();
      } else {
        // console.error('Lỗi check wishlist', error);
        Toast.show({
          type: 'error',
          text1: 'Kiểm tra mục yêu thích không thành công',
        });
      }
    }
  };

  const add = async () => {
    if (!token) {
      router.push('/(auth)/sign-in');
      return;
    }
    try {
      setIsLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/wishlist`;
      const data = {
        product_id: productId,
      };
      const res = await axios.post(url, data, config);
      if (res.status === 201) {
        Toast.show({ text1: 'Đã thêm vào sản phẩm yêu thích' });
        checkWishlist();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        getNewToken();
      } else {
        // console.log('Lỗi không thêm được wishlist', error);
        Toast.show({ type: 'error', text1: 'Thêm không thành công' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async () => {
    try {
      setIsLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/wishlist/${productId}`;
      const res = await axios.delete(url, config);
      if (res.status === 200) {
        checkWishlist();
        Toast.show({ text1: 'Đã xóa khỏi sản phẩm yêu thích' });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        getNewToken();
      } else {
        // console.log('Lỗi không xóa được wishlist', error);
        Toast.show({ type: 'error', text1: 'Xoá không thành công' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && productId) {
      checkWishlist();
    }
  }, [token, productId]);

  return { inWishlist, isLoading, add, remove };
};
