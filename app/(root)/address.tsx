import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import LoadingScreen from './loading-screen';

const Address = () => {
  const { token } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<any>();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Lỗi khi lấy địa chỉ' });
        console.log('Lỗi fetch địa chỉ: ' + error);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]} className='bg-gray-100 flex-1'>
        <ScreenHeader text='Sổ địa chỉ' />
        <View className='p-3 bg-white'>
          <RectangleButton
            title='Thêm địa chỉ mới'
            textVariant='primary'
            bgVariant='outline'
            onPress={() => {
              router.push({
                pathname: '/(root)/add-address',
                params: { token },
              });
            }}
          />
          <View className='bg-white border-b border-gray-200 py-3'>
            <View className='flex flex-row justify-between items-center mb-1'>
              <Text className='text-base font-semibold'>
                Nguyễn Thông Hoàng Anh
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/(root)/update-address',
                    params: { token },
                  })
                }
              >
                <Text className='text-base text-blue-500'>Chỉnh sửa</Text>
              </Pressable>
            </View>
            <Text>0986359498</Text>
            <Text>199, QL51</Text>
            <View className='p-1 mt-1 border border-primary-pink rounded max-w-[140px]'>
              <Text className='text-center text-primary-pink'>
                Địa chỉ mặc định
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Address;
