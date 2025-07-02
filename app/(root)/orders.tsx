import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, RefreshControl } from 'react-native';
import { Text, View, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import axios from 'axios';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import ConfirmModal from '@/components/ConfirmModal';
import useGetData from '@/customHooks/useGetData';
import { IOrder, IOrderItem } from '@/types/type';
import { AntDesign } from '@expo/vector-icons';
import getNewToken from '@/utils/getNewToken';
import LoadingScreen from './loading-screen';
import ErrorScreen from './error-screen';
import NoProduct from './no-product';

const url = `${process.env.EXPO_PUBLIC_API}/order`;

interface OrderItemProps {
  fetchOrders: () => void;
  token: string | string[];
  item: IOrder;
}

interface CancelOrderProps {
  fetchOrders: () => void;
  token: string | string[];
  id: string;
}

const Orders = () => {
  const { token } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );
  const {
    data: orders,
    error,
    refetch,
    loading,
  } = useGetData<IOrder[]>(url, config);

  const reversedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].reverse();
  }, [orders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: IOrder }) => (
      <OrderItem fetchOrders={refetch} item={item} token={token} />
    ),
    [token]
  );

  if (error) {
    return <ErrorScreen onRetry={refetch} />;
  }

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  if (!orders || orders?.length === 0) {
    return <NoProduct text={'Bạn chưa có đơn hàng nào!'} />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <ScreenHeader text='Lịch sử đơn hàng' />
      <FlatList
        className='bg-gray-100'
        keyExtractor={(item) => item.order_id}
        data={reversedOrders}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const OrderItem = React.memo(({ item, fetchOrders, token }: OrderItemProps) => {
  const navToReview = (items: IOrderItem[]) => {
    const productIds: string[] = [];
    items.forEach((item) => {
      productIds.push(item.product_id);
    });
    router.push({
      pathname: '/(root)/review',
      params: {
        token: token,
        product_id: productIds,
        order_id: item?.order_id,
      },
    });
  };

  const canCancelOrder = !['completed', 'cancelled'].includes(
    item.order_status
  );
  const canReviewOrder = item.order_status === 'completed' && !item.is_rated;

  return (
    <View className='p-3 mb-2 bg-white'>
      <Text className='text-[16px] text-gray-500 font-semibold italic'>
        <AntDesign name='calendar' size={16} />
        Thời gian: {moment(item?.created_at).format('DD/MM/YYYY _ HH:mm')}
      </Text>
      <Text className='text-[16px] my-1 italic font-semibold'>
        <AntDesign name='shoppingcart' size={16} />
        Đơn hàng: ({item?.items.length} sản phẩm)
      </Text>
      {item?.items.map((item, index) => (
        <View key={index} className='flex-row border-b border-gray-500 py-1'>
          <View className='flex-1'>
            <View className='flex-row' style={{ gap: 4 }}>
              <Image
                className='w-full rounded-lg border border-gray-200'
                style={{ width: 90, height: 90 }}
                source={{ uri: item?.product_image }}
              />
              <Text
                numberOfLines={3}
                className='text-[16px] flex-1 italic font-semibold'
              >
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
      ))}
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
        {canReviewOrder && (
          <View
            className='h-8 w-24 mt-1'
            style={{ display: item.is_rated ? 'none' : 'flex' }}
          >
            <RectangleButton
              onPress={() => navToReview(item?.items)}
              textVariant='primary'
              bgVariant='outline'
              title='Đánh giá'
            />
          </View>
        )}
        {canCancelOrder && (
          <CancelOrder
            fetchOrders={fetchOrders}
            id={item?.order_id}
            token={token}
          />
        )}
        {item?.is_rated && (
          <Text className='italic text-[16px] mt-1 text-primary-pink'>
            Cảm ơn bạn đã đánh giá đơn hàng này!
          </Text>
        )}
      </View>
    </View>
  );
});

const CancelOrder = ({ id, fetchOrders, token }: CancelOrderProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        getNewToken();
      } else {
        // console.error('Lỗi (OrderScreen):', error);
        Toast.show({ type: 'error', text1: 'Hủy đơn không thành công' });
      }
    } finally {
      setModalVisible(!modalVisible);
      setLoading(false);
    }
  };

  return (
    <>
      <ConfirmModal
        onConfirm={handleCancelOrder}
        onClose={() => setModalVisible(!modalVisible)}
        modalVisible={modalVisible}
        loading={loading}
        text='Bạn có chắc chắn muốn hủy đơn hàng này?'
      />
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
    case 'processing':
      return 'Chờ xác nhận';
    default:
      return 'Lỗi không xác định';
  }
};

export default Orders;
