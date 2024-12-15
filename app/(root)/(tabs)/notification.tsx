import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { RefreshControl, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';
import { RootState } from '@/redux/store';
import LoadingScreen from '../loading-screen';
import NoProduct from '../no-product';

const Notification = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [notification, setNotification] = useState<any>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotification();
    setRefreshing(false);
  };

  const fetchNotification = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/noti-url`;
      const res = await axios.get(url);
      if (res.status === 200) {
        const notification = res.data?.notification;
        setNotification(notification);
      } else {
        console.error('Fetch thông báo không thành công');
      }
    } catch (error) {
      console.error('Lỗi (NotificationScreen)', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchNotification();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (notification.length === 0 || notification.length === undefined) {
    return <NoProduct text={'Tạm chưa có thông báo'} />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle={'dark-content'} />
      <ScreenHeader text={'Thông báo'} />
      <FlatList
        data={notification}
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

const RenderItem = ({ item, index }: { item: any; index: number }) => {
  return (
    <View className='bg-white p-3 mb-2' key={index}>
      <Text className='font-semibold uppercase text-[16px]'>{item?.title}</Text>
      <Text className='text-[15px]'>
        Vào phần <Text className='underline'>Tài khoản</Text>
        <AntDesign name='arrowright' size={16} color='black' />
        <Text className='underline'>Đơn hàng của bạn</Text> để xem chi tiết
      </Text>
      <View className='mt-4'>
        <Text className='text-gray-500 text-[14px]'>
          {moment(item?.createAt).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>
    </View>
  );
};

export default Notification;
