import { RefreshControl, FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { router } from 'expo-router';
import moment from 'moment';
import ScreenHeader from '@/components/ScreenHeader';
import useGetData from '@/customHooks/useGetData';
import LoadingScreen from '../loading-screen';
import NoProduct from '../no-product';

interface INoti {
  sysn_title: string;
  sysn_description: string;
  sysn_created_at: string;
  sysn_image?: string | null;
  sysn_link: string;
  sysn_is_link: boolean;
}
const url = `${process.env.EXPO_PUBLIC_API}/notification`;

const Notification = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { data: noti, loading, refetch } = useGetData<INoti[]>(url);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (noti?.length === 0 || noti?.length === undefined) {
    return <NoProduct text={'Tạm chưa có thông báo'} type='noti' />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <StatusBar backgroundColor='#fb77c5' style='light' />
      <ScreenHeader text={'Thông báo'} showBack={false} />
      <FlatList
        data={noti}
        renderItem={({ item, index }) => (
          <RenderItem item={item} index={index} />
        )}
        style={{ backgroundColor: 'rgb(243 244 246)' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const RenderItem = ({ item, index }: { item: INoti; index: number }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/(root)/sale`);
      }}
      className='mt-2 bg-white p-3'
      disabled={!item?.sysn_is_link}
      key={index}
    >
      <Text className='font-semibold uppercase text-base'>
        {item.sysn_title}
      </Text>
      <Text>✨{item?.sysn_description}</Text>
      {item?.sysn_image && (
        <Image
          source={{ uri: item?.sysn_image }}
          className='aspect-[16/6] py-2'
        />
      )}
      <View className='pb-2 border-b border-gray-200'>
        <Text className='text-gray-500 text-sm'>
          {moment(item?.sysn_created_at).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Notification;
