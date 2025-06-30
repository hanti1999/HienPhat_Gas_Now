import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import useGetData from '@/customHooks/useGetData';
import { IAddress } from '@/types/type';
import LoadingScreen from './loading-screen';
import ErrorScreen from './error-screen';

const url = `${process.env.EXPO_PUBLIC_API}/shipping`;

interface IProps {
  item: IAddress;
  token: any;
}

const AddressItem = React.memo(({ item, token }: IProps) => {
  const handleEdit = () => {
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
        //@ts-ignore
        is_default: item.is_default,
      },
    });
  };

  return (
    <View className='bg-white border-b border-gray-200 p-3'>
      <View className='flex flex-row justify-between items-center mb-1'>
        <Text className='text-base font-semibold'>
          {item.address?.address_recipient_name}
        </Text>
        <Pressable onPress={handleEdit}>
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
  );
});

const Address = () => {
  const { token } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );
  const {
    data: address,
    loading,
    error,
    refetch,
  } = useGetData<IAddress[]>(url, config);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderHeader = useCallback(
    () => (
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
      </View>
    ),
    [token]
  );

  const renderItem = useCallback(
    ({ item }: { item: IAddress }) => <AddressItem item={item} token={token} />,
    [token]
  );

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen onRetry={refetch} />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <ScreenHeader text='Địa chỉ nhận hàng' />
      <FlatList
        data={address}
        //@ts-ignore
        keyExtractor={(item) => item.address.address_id.toString()}
        className='flex-1 bg-gray-100'
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Address;
