import { Dimensions, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView, Modal, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { Text, View } from 'react-native';
import moment from 'moment';
import axios from 'axios';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import { AntDesign } from '@expo/vector-icons';
import { IOrder, IOrderItem } from '@/types/type';
import LoadingScreen from './loading-screen';
import NoProduct from './no-product';

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
        setOrders(res?.data.reverse());
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
  fetchOrders: () => Promise<any>;
  token: string | string[];
  item?: IOrder;
  id?: string;
}

const RenderOrders = ({ item, fetchOrders, token }: IProps) => {
  const navToReview = (items: IOrderItem[]) => {
    const productIds: string[] = [];
    items.forEach((item) => {
      productIds.push(item.product_id);
    });
    router.push({
      pathname: '/(root)/review',
      params: { token: token, product_id: productIds, orderId: item?.order_id },
    });
  };

  return (
    <View className='p-3 mb-2 bg-pink-100'>
      <Text className='text-[16px] text-gray-500 font-semibold italic'>
        <AntDesign name='calendar' size={16} />
        Thời gian: {moment(item?.created_at).format('DD/MM/YYYY _ HH:mm')}
      </Text>
      <Text className='text-[16px] my-1 italic font-semibold'>
        <AntDesign name='shoppingcart' size={16} />
        Đơn hàng: ({item?.items.length} sản phẩm)
      </Text>
      <FlatList
        data={item?.items}
        keyExtractor={(item) => item.product_id}
        renderItem={({ item }) => (
          <View className='flex-row border-b border-gray-500 py-1'>
            <View className='flex-1'>
              <View className='flex-row' style={{ gap: 4 }}>
                <Image
                  className='w-full rounded-lg border border-gray-200'
                  style={{ width: 90, height: 90 }}
                  source={{ uri: item?.product_image }}
                />
                <Text className='text-[16px] italic font-semibold'>
                  {item.product_name}
                </Text>
              </View>
            </View>
            <View>
              <Text className='text-right'>x {item.product_quantity}</Text>
              <Text className='text-right italic'>
                {item?.unit_price.toLocaleString()}
              </Text>
              <Text className='text-right font-semibold text-[16px]'>
                {item?.total_price.toLocaleString()} đ
              </Text>
            </View>
          </View>
        )}
      />
      <View className='flex-row mt-1' style={{ gap: 4 }}>
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
              color: item?.order_status != 'cancelled' ? '#3b82f6' : '#fc0303',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {translateStatus(item?.order_status as string)}
          </Text>
          <Text className='font-bold text-[16px]'>
            {item?.total_order_price.toLocaleString()} đ
          </Text>
          <Text>{item?.points_earned.toLocaleString()}</Text>
        </View>
      </View>
      <View>
        {item?.order_status === 'completed' && (
          <View className='h-8 w-24 mt-1'>
            <RectangleButton
              onPress={() => navToReview(item?.items)}
              textVariant='primary'
              bgVariant='outline'
              title='Đánh giá'
            />
          </View>
        )}
        {item?.order_status === 'completed' ||
        item?.order_status === 'cancelled' ? (
          <></>
        ) : (
          <CancelOrder
            fetchOrders={fetchOrders}
            id={item?.order_id}
            token={token}
          />
        )}
      </View>
    </View>
  );
};

const CancelOrder = ({ id, fetchOrders, token }: IProps) => {
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
      const res = await axios.put(url, {}, config);
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
      <View className='h-8 w-24 mt-1'>
        <RectangleButton
          onPress={() => setModalVisible(!modalVisible)}
          textVariant='danger'
          bgVariant='danger'
          title='Hủy đơn'
        />
      </View>
    </>
  );
};

const translateStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'Đã thanh toán';
    case 'cancelled':
      return 'Đã hủy';
    case 'shipping':
      return 'Đang giao';
    case 'shipped':
      return 'Đã giao';
    default:
      return 'Trạng thái không hợp lệ';
  }
};

export default Orders;
