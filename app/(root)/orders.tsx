import { SafeAreaView, Modal, TouchableOpacity } from 'react-native';
import { Dimensions, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { Text, View } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

interface IOrder {
  order_id: string;
  total_order_price: number;
  created_at: string;
  points_earned: number;
  points_used: number;
  order_status: string;
  items: [
    {
      product_id: string;
      product_name: string;
      product_image: string;
      product_quantity: number;
      unit_price: number;
      total_price: number;
    }
  ];
}

const Orders = () => {
  const { token } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<IOrder[]>([]);

  const fetchOrders = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/order`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      if (res.status === 200) {
        const orders = res.data.reverse();
        setOrders(orders);
      } else {
        console.error(res.data?.message);
        Toast.show({ type: 'error', text1: res.data?.message });
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Lỗi hệ thống!' });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (orders.length === 0) {
    return <NoProduct text={'Bạn chưa có đơn hàng nào!'} />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScreenHeader text='Lịch sử đơn hàng' />
      <FlatList
        style={{ backgroundColor: '#fff' }}
        keyExtractor={(item) => item.order_id}
        data={orders}
        renderItem={({ item }) => (
          <RenderOrders fetchOrders={fetchOrders} item={item} token={token} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

interface IProps {
  item?: IOrder;
  fetchOrders: () => Promise<any>;
  id?: string;
  token: string | string[];
}

const RenderOrders = ({ item, fetchOrders, token }: IProps) => {
  return (
    <View className='p-3 mb-3 bg-pink-100'>
      <Text className='text-[16px] text-gray-500 font-semibold italic'>
        <AntDesign name='calendar' size={16} color='black' />
        Thời gian: {moment(item?.created_at).format('DD/MM/YYYY _ HH:mm')}
      </Text>
      <Text className='text-[17px] my-1 italic font-semibold'>
        <AntDesign name='shoppingcart' size={16} color='black' />
        Đơn hàng: ({item?.items.length} sản phẩm)
      </Text>
      <FlatList
        data={item?.items}
        keyExtractor={(item) => item.product_id}
        renderItem={({ item }) => (
          <View className='flex-row border-2 border-gray-500'>
            <View className='p-1 flex-1'>
              <View className='flex-row items-center'>
                <AntDesign name='star' size={12} />
                <Text className='text-[16px] italic font-semibold text-pink-500'>
                  {item.product_name}
                </Text>
              </View>
            </View>
            <View className='p-1'>
              <Text className='text-right font-semibold'>
                x {item.product_quantity}
              </Text>
              <Text className='text-right italic'>
                {item?.unit_price?.toLocaleString()}
              </Text>
              <Text className='text-right font-semibold text-[16px]'>
                {item?.total_price?.toLocaleString()} đ
              </Text>
            </View>
          </View>
        )}
      />
      <View className='flex-row' style={{ gap: 4 }}>
        <View>
          <Text className='text-[16px]'>Trạng thái</Text>
          <Text className='text-[16px]'>Tổng</Text>
          <Text>Tích điểm</Text>
        </View>
        <View>
          <Text className='text-[16px]'>:</Text>
          <Text className='text-[16px]'>:</Text>
          <Text>:</Text>
        </View>
        <View>
          <Text
            style={{
              color: item?.order_status != 'Đã hủy' ? '#3b82f6' : '#fc0303',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {item?.order_status}
          </Text>
          <Text className='font-bold text-[16px]'>
            {item?.total_order_price.toLocaleString()} (vnđ)
          </Text>
          <Text>{item?.points_earned.toLocaleString()}</Text>
        </View>
      </View>
      {item?.order_status === 'completed' || item?.order_status === 'Đã hủy' ? (
        <></>
      ) : (
        <UpdateOrderButton
          fetchOrders={fetchOrders}
          id={item?.order_id}
          token={token}
        />
      )}
    </View>
  );
};

const UpdateOrderButton = ({ id, fetchOrders, token }: IProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const width = Dimensions.get('window').width;

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/order/${id}/Cancel`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(url, config);
      if (res.status === 200) {
        Toast.show({ text1: 'Hủy đơn hàng thành công' });
        fetchOrders();
      } else {
        Toast.show({ type: 'error', text1: res.data.message });
      }
    } catch (error) {
      console.error('Lỗi (OrderScreen):', error);
      Toast.show({ type: 'error', text1: 'Hủy đơn không thành công' });
    } finally {
      setModalVisible(!modalVisible);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
          className='flex-1 items-center justify-center'
        >
          <View
            className='p-3 rounded-xl bg-white shadow-lg'
            style={{ width: width * 0.8 - 8 }}
          >
            <Text className='text-center my-4 text-lg'>Bạn muốn hủy đơn?</Text>
            <View style={{ gap: 8 }} className='flex-row items-center'>
              <RectangleButton
                title='Không'
                bgVariant='outline'
                textVariant='primary'
                onPress={() => setModalVisible(!modalVisible)}
              />
              <RectangleButton
                title='Đồng ý'
                loading={loading}
                disabled={loading}
                onPress={handleCancelOrder}
              />
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        className='border border-red-500 rounded-xl py-1 mt-1 w-32 flex justify-center'
        onPress={() => setModalVisible(!modalVisible)}
      >
        <Text className='text-red-500 font-semibold text-center'>
          Hủy đơn hàng
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default Orders;
