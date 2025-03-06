import { Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { Image, TextInput, Text, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, Switch } from 'react-native';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import axios from 'axios';
import { removeFromCart, clearCart } from '@/redux/slices/cartSlice';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';
import RectangleButton from '@/components/RectangleButton';
import RectangleInput from '@/components/RectangleInput';
import cashIcon from '@/assets/icons/dollar_128px.png';
import ScreenHeader from '@/components/ScreenHeader';
import bankIcon from '@/assets/icons/scan_128px.png';
import CheckedLabel from '@/components/CheckedLabel';
import { MaterialIcons } from '@expo/vector-icons';
import { CartItem, IAddress } from '@/types/type';
import { FontAwesome } from '@expo/vector-icons';
import getNewToken from '@/utils/getNewToken';
import { RootState } from '@/redux/store';
import LoadingScreen from '../loading-screen';
import NoProduct from '../no-product';

const Cart = () => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const totalDiscount = useSelector(
    (state: RootState) => state.cart.totalDiscount
  );
  const cartAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [voucher, setVoucher] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<IAddress>();
  const [address, setAddress] = useState<IAddress[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(cartAmount);
  const [voucherAmount, setVoucherAmount] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [orderLoading, setOrderLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [usePoint, setUsePoint] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const P_PINK = '#fb77c5';
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping`;
      const res = await axios.get(url, config);
      if (res.status === 200) {
        setAddress(res?.data?.addresses);
        setUserPoints(res?.data?.points?.total_points);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.error('Lỗi (NotificationScreen)', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseVoucher = async () => {
    // test
    Toast.show({ type: 'error', text1: `Voucher ${voucher} không tồn tại` });
    setVoucherAmount(0);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAddress();
    setRefreshing(false);
  };

  const handlePlaceOrder = async () => {
    try {
      setOrderLoading(true);
      const items = cartItems.map((cartItem) => ({
        product_id: cartItem.id,
        product_quantity: cartItem.quantity,
      }));
      const url = `${process.env.EXPO_PUBLIC_API}/order`;
      const data = {
        address_id: selectedAddress?.address?.address_id,
        voucher_code: voucher,
        payment_method: paymentMethod,
        points_used: usePoint === true ? userPoints : 0,
        delivery_note: note,
        items: items,
      };
      const res = await axios.post(url, data, config);
      if (res.status === 201) {
        dispatch(clearCart());
        const data: string = res.data?.order_id;
        const description: string = data.slice(-12);
        router.push({
          pathname: '/(root)/checkout',
          params: {
            paymentMethod,
            sum: totalAmount - voucherAmount,
            description,
          },
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        Toast.show({ type: 'error', text1: 'Tạo đơn hàng không thành công' });
        console.error('Lỗi (CartScreen): ', error);
      }
    } finally {
      setOrderLoading(false);
    }
  };

  const toggleSwitch = () => {
    setUsePoint(!usePoint);
    setTotalAmount(
      usePoint ? totalAmount + userPoints : totalAmount - userPoints
    );
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    setTotalAmount(cartAmount);
  }, [cartAmount]);

  useEffect(() => {
    const filteredAddress = address.find((address) => address.is_default);
    setSelectedAddress(filteredAddress);
  }, [address]);

  if (cartQuantity === 0) {
    return <NoProduct text={'Giỏ hàng trống!'} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <ScreenHeader text='Giỏ hàng' />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='bg-gray-100'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Địa chỉ giao hàng */}
        <View className='mb-2 p-3 bg-white'>
          <View className='flex-row justify-between'>
            <View className='flex-row items-center' style={{ gap: 4 }}>
              <View className='w-5'>
                <FontAwesome6 name='location-dot' size={18} color={P_PINK} />
              </View>
              <Text className='uppercase font-bold text-[18px]'>
                Giao hàng tới
              </Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Text className='text-blue-500 text-[16px] underline'>
                Chọn địa chỉ khác
              </Text>
            </TouchableOpacity>
          </View>

          <View className='mt-2'>
            <View className='flex-row items-end' style={{ gap: 4 }}>
              <Text className='font-bold text-[18px]'>
                {selectedAddress?.address.address_recipient_name}
              </Text>
              <Text>
                {selectedAddress?.address.address_recipient_phonenumber}
              </Text>
            </View>
            <Text>{selectedAddress?.address.address_full}</Text>
          </View>

          <View className='flex-row items-center' style={{ gap: 4 }}>
            <Text className='w-[60px]'>Ghi chú:</Text>
            <TextInput
              className='p-2 border-b border-gray-300 flex-1'
              placeholder='(Không bắt buộc)'
              placeholderTextColor={'#999'}
              onChangeText={setNote}
              value={note}
              multiline
            />
          </View>
        </View>

        {/* Chi tiết đơn hàng */}
        <View className='bg-white p-3 mb-2'>
          <View className='flex-row items-center' style={{ gap: 4 }}>
            <View className='w-5'>
              <FontAwesome6 name='cart-shopping' size={18} color={P_PINK} />
            </View>
            <Text className='uppercase font-bold text-[18px]'>
              Chi tiết đơn hàng
            </Text>
          </View>
          {cartItems.map((item, index) => (
            <RenderItemToCart item={item} key={index} dispatch={dispatch} />
          ))}
          <View className='flex-row justify-between items-center mt-2'>
            <Text className='text-right text-[16px]'>
              Tổng tạm tính ({cartQuantity} sản phẩm)
            </Text>
            <Text className='text-primary-pink font-semibold text-[16px]'>
              {cartAmount?.toLocaleString()}đ
            </Text>
          </View>
          <View className='flex-row justify-between items-center mt-2'>
            <View className='flex-row items-center' style={{ gap: 4 }}>
              <MaterialIcons name='wallet' size={24} color={P_PINK} />
              <Text className='text-right text-[16px]'>
                Dùng {userPoints?.toLocaleString()} điểm
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: P_PINK }}
              onValueChange={toggleSwitch}
              disabled={userPoints === 0}
              value={usePoint}
            />
          </View>
          <View className='flex-row items-center mt-1' style={{ gap: 8 }}>
            <View className='flex-1'>
              <RectangleInput
                placeholder='nhập mã giảm giá...'
                containerStyle='border-gray-200'
                onChangeText={setVoucher}
                value={voucher}
              />
            </View>
            <View className='h-[37px] w-[120px]'>
              <RectangleButton
                onPress={handleUseVoucher}
                disabled={voucher === ''}
                title='Áp dụng'
              />
            </View>
          </View>
        </View>
        {/* Phương thức thanh toán */}
        <View className='p-3 mb-2 bg-white'>
          <View className='flex-row items-center' style={{ gap: 4 }}>
            <View className='w-5'>
              <FontAwesome6 name='money-bill-1' size={18} color={P_PINK} />
            </View>
            <Text className='uppercase font-bold text-[18px]'>
              Phương thức thanh toán
            </Text>
          </View>
          <View className='flex-row mt-2' style={{ gap: 12 }}>
            <TouchableOpacity
              className='flex-1 border rounded-lg p-2 flex flex-row items-center relative'
              onPress={() => setPaymentMethod('cod')}
              style={{
                gap: 8,
                borderColor: paymentMethod === 'cod' ? P_PINK : '#d1d5db',
              }}
            >
              {paymentMethod === 'cod' && <CheckedLabel />}
              <Image source={cashIcon} className='w-12 h-12' />
              <Text className='text-[16px]'>Tiền mặt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-1 border rounded-lg p-2 flex flex-row items-center relative'
              onPress={() => setPaymentMethod('banking')}
              style={{
                gap: 8,
                borderColor: paymentMethod === 'banking' ? P_PINK : '#d1d5db',
              }}
            >
              {paymentMethod === 'banking' && <CheckedLabel />}
              <Image source={bankIcon} className='w-12 h-12' />
              <Text className='text-[16px]'>Chuyển khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Modal chọn địa chỉ */}
        <Modal
          visible={modalVisible}
          animationType='slide'
          transparent={true}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
            className='flex-1 items-center justify-end'
          >
            <View className='p-3 mb-2.5 shadow-lg w-full bg-pink-100 rounded-lg relative'>
              <Text className='text-left font-bold text-[18px] mb-2'>
                Chọn địa chỉ
              </Text>
              <View className='absolute top-0 right-0'>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  className='p-2'
                >
                  <AntDesign name='close' size={24} color='black' />
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {address.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className='w-36 h-36 p-3 border rounded-lg mr-1 bg-white'
                    style={{
                      borderColor: selectedAddress === item ? P_PINK : '',
                    }}
                    onPress={() => {
                      setSelectedAddress(item);
                      setModalVisible(!modalVisible);
                    }}
                  >
                    {selectedAddress === item && <CheckedLabel />}
                    <View className='flex-row items-center justify-between relative'>
                      <Text className='font-bold'>
                        {item.address?.address_recipient_name}
                      </Text>
                    </View>
                    <Text className='mt-1'>
                      {item.address?.address_recipient_phonenumber}
                    </Text>
                    <Text className='mt-1'>{item.address?.address_full}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  className='w-36 h-36 border rounded-lg bg-white'
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    router.push({
                      pathname: '/(root)/add-address',
                      params: { token },
                    });
                  }}
                >
                  <View className='w-36 h-36 justify-center items-center'>
                    <AntDesign name='plus' size={40} color='black' />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <View
        className='p-3 bg-white flex-row border-t border-gray-200 justify-end'
        style={{ gap: 8 }}
      >
        <View>
          <Text className='text-right'>
            Tổng thanh toán:{' '}
            <Text className='text-primary-pink text-[16px]'>
              {(totalAmount - voucherAmount).toLocaleString()}đ
            </Text>
          </Text>
          <Text className='text-right'>
            Tiết kiệm:{' '}
            <Text className='text-primary-pink'>
              {usePoint
                ? (totalDiscount + userPoints + voucherAmount).toLocaleString()
                : (totalDiscount + voucherAmount).toLocaleString()}
              đ
            </Text>
          </Text>
        </View>

        <View className='w-[120px] h-[40px]'>
          <RectangleButton
            onPress={handlePlaceOrder}
            disabled={orderLoading}
            loading={orderLoading}
            title='Đặt hàng'
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

interface IProp {
  item: CartItem;
  dispatch: (action: any) => void;
}

const RenderItemToCart = ({ item, dispatch }: IProp) => {
  const width = Dimensions.get('window').width;
  const handleProduct = () => {
    dispatch(removeFromCart(item?.id));
  };

  return (
    <View className='flex-row border-b border-gray-200 py-2' style={{ gap: 4 }}>
      <Image
        className='w-full rounded-lg border border-gray-200'
        style={{ width: width * 0.4, height: width * 0.4 }}
        source={{ uri: item?.productImg }}
      />
      <View className='flex-1'>
        <Text numberOfLines={2} className='font-semibold text-[18px]'>
          {item?.title}
        </Text>
        <Text className='mb-2 mt-4 text-[16px]'>
          {item?.quantity}x {item?.price?.toLocaleString()}đ{' '}
          {item?.oldPrice !== item?.price && (
            <Text className='line-through text-gray-500 text-xs'>
              {item?.oldPrice.toLocaleString()}đ
            </Text>
          )}
        </Text>
        <Text className='font-bold text-[16px] mb-2'>
          = {(item?.quantity * item?.price)?.toLocaleString()}đ
        </Text>
        <TouchableOpacity
          className='flex-row items-center'
          onPress={handleProduct}
          style={{ gap: 4 }}
        >
          <FontAwesome name='trash' size={20} color={'#fb77c5'} />
          <Text className='text-primary-pink text-[16px]'>Xoá sản phẩm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
