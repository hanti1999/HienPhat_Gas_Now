import { Alert, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { RefreshControl, FlatList, View, Text, Image } from 'react-native';
import { Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import moment from 'moment';
import axios from 'axios';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';
import { RootState } from '@/redux/store';
import LoadingScreen from '../loading-screen';
import NoProduct from '../no-product';
import Toast from 'react-native-toast-message';

interface INoti {
  title: string;
  description: string;
  created_at: string;
  image?: string | null;
}

const Notification = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [notification, setNotification] = useState<INoti[]>([
    {
      title: 'Đón tết sale hết',
      description: 'Mở app đón ưu đãi',
      created_at: '2025-02-11T02:30:12.221Z',
      image: 'https://placehold.co/180x100',
    },
  ]);
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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      if (res.status === 200) {
        setNotification(res.data);
      } else {
        Toast.show({ type: 'error', text1: res.data?.message });
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

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  // if (notification.length === 0 || notification.length === undefined) {
  //   return <NoProduct text={'Tạm chưa có thông báo'} />;
  // }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle={'dark-content'} />
      <ScreenHeader text={'Thông báo'} showBack={false} />
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

const RenderItem = ({ item, index }: { item: INoti; index: number }) => {
  const width = Dimensions.get('window').width;
  return (
    <TouchableOpacity
      onPress={() => {
        Alert.alert('heloo');
      }}
      className='mt-2 bg-white p-3'
      key={index}
    >
      <Text className='font-semibold uppercase text-base'>{item.title}</Text>
      <Text>{item?.description}</Text>
      {item?.image && (
        <Image source={{ uri: item?.image }} className='aspect-video' />
      )}
      <View className='pb-2 border-b border-gray-200'>
        <Text className='text-gray-500 text-sm'>
          {moment(item?.created_at).format('DD/MM/YYYY HH:mm')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Notification;
