import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Pressable } from 'react-native';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';
import axios from 'axios';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import getNewToken from '@/utils/getNewToken';
import { IAddress } from '@/types/type';
import LoadingScreen from './loading-screen';

const Address = () => {
  const { token } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<IAddress[]>([]);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      if (res.status === 200) {
        setAddress(res?.data?.addresses);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        Toast.show({ type: 'error', text1: 'Lỗi khi lấy địa chỉ' });
        console.log('Lỗi fetch địa chỉ: ' + error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  // Lấy lại danh sách địa chỉ khi router.back()
  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [])
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]}>
        <ScreenHeader text='Địa chỉ nhận hàng' />
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
          {address?.map((item, index) => (
            <View
              key={index}
              className='bg-white border-b border-gray-200 py-3'
            >
              <View className='flex flex-row justify-between items-center mb-1'>
                <Text className='text-base font-semibold'>
                  {item.address?.address_recipient_name}
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/(root)/update-address',
                      params: {
                        token: token,
                        id: item.address.address_id,
                        address: item.address.address_full,
                        home: item.address.address_home,
                        note: item.address.address_note,
                        name: item.address.address_recipient_name,
                        phonenumber: item.address.address_recipient_phonenumber,
                        is_default: item.is_default,
                      },
                    })
                  }
                >
                  <Text className='text-base text-blue-500'>Chỉnh sửa</Text>
                </Pressable>
              </View>
              <Text>{item.address?.address_recipient_phonenumber}</Text>
              <Text>{item.address?.address_full}</Text>
              {item.is_default && (
                <View className='p-1 mt-1 border border-primary-pink rounded max-w-[140px]'>
                  <Text className='text-center text-primary-pink'>
                    Địa chỉ mặc định
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Address;
