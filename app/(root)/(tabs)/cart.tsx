import { Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { Image, TextInput, Text, View, Modal } from 'react-native';
import { SafeAreaView, ScrollView, Switch } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { router, useFocusEffect } from 'expo-router';
import { Pressable, StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { removeFromCart, clearCart } from '@/redux/slices/cartSlice';
import { MaterialIcons, Fontisto } from '@expo/vector-icons';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import tulip from '@/assets/images/tulip.png';
import { RootState } from '@/redux/store';
import { IAddress } from '@/types/type';
import LoadingScreen from '../loading-screen';
import NoProduct from '../no-product';

const Cart = () => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const cartAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [note, setNote] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<IAddress>();
  const [address, setAddress] = useState<IAddress[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(cartAmount);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [orderLoading, setOrderLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [usePoint, setUsePoint] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  let cartPoints = Math.round((totalAmount * 0.8) / 100);
  let voucher = 0;
  const P_PINK = '#fb77c5';

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
        setAddress(res?.data);
      } else {
        console.log(res.data?.message);
      }
    } catch (error) {
      console.log('Lỗi fetch địa chỉ: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (item: any) => {
    setSelectedAddress(item);
    setModalVisible(!modalVisible);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAddress();
    setRefreshing(false);
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

  // Lấy lại danh sách địa chỉ khi focus
  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [])
  );

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    try {
      const data = {
        userId: token,
        name: selectedAddress?.address?.address_recipient_name,
        phoneNumber: selectedAddress?.address?.address_recipient_phonenumber,
        note: note,
        cartItems: cartItems,
        totalPrice: totalAmount,
        shippingAddress: selectedAddress?.address?.address_full,
        paymentMethod: paymentMethod,
        cartPoints: cartPoints,
        usePoint: usePoint,
        usedPoints: usePoint === true ? userPoints : 0,
      };
      const url = `${process.env.EXPO_PUBLIC_API}/my-url`;
      const res = await axios.post(url, data);
      if (res.status === 200) {
        dispatch(clearCart());
        router.push({ pathname: '/(root)/orders', params: { token } });
      } else {
        Toast.show({ type: 'error', text1: res.data?.message });
        console.log('Tạo đơn hàng không thành công');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Tạo đơn hàng không thành công' });
      console.log('Lỗi (CartScreen): ', error);
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

  if (cartQuantity === 0) {
    return <NoProduct text={'Giỏ hàng trống!'} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle={'dark-content'} />
      <ScreenHeader text={'Giỏ hàng'} />
      <ScrollView
        className='bg-gray-100'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='mb-3 p-3 bg-white'>
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
              <View className='flex-row items-center' style={{ gap: 4 }}>
                <Text style={{ color: 'blue', fontSize: 16 }}>
                  Chọn địa chỉ khác
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className='mt-2'>
            <View className='flex-row items-center' style={{ gap: 8 }}>
              <Text className='font-bold text-lg'>
                {selectedAddress?.address.address_recipient_name}
              </Text>
              <Text>
                {selectedAddress?.address.address_recipient_phonenumber}
              </Text>
            </View>
            <Text>{selectedAddress?.address.address_full}</Text>
          </View>

          <View className='flex-row items-center' style={{ gap: 8 }}>
            <Text className='w-[60px]'>Ghi chú:</Text>
            <TextInput
              className='p-2 border-b border-gray-300 flex-1'
              placeholder='(Không bắt buộc)'
              onChangeText={setNote}
              value={note}
              multiline
            />
          </View>
        </View>

        <View className='bg-white p-3 mb-3'>
          <View className='flex-row items-center' style={{ gap: 4 }}>
            <View className='w-5'>
              <FontAwesome6 name='cart-shopping' size={16} color={P_PINK} />
            </View>
            <Text className='uppercase font-bold text-[18px]'>
              Chi tiết đơn hàng
            </Text>
          </View>
          {cartItems.map((item, index) => (
            <RenderItemToCart item={item} key={index} dispatch={dispatch} />
          ))}
          <View className='flex-row justify-between items-center mt-2'>
            <Text className='text-right text-[18px]'>Tổng tạm tính</Text>
            <Text className='text-primary-pink font-semibold text-[18px]'>
              {cartAmount?.toLocaleString()}đ
            </Text>
          </View>
          {voucher != 0 && (
            <View className='flex-row justify-between items-center mt-2'>
              <View className='flex-row items-center' style={{ gap: 4 }}>
                <Fontisto name='ticket-alt' size={24} color='pink' />
                <Text className='text-right text-[16px]'>Ưu đãi giảm</Text>
              </View>
              <Text className='text-primary-pink text-[18px]'>0đ</Text>
            </View>
          )}
          <View className='flex-row justify-between items-center mt-2'>
            <View className='flex-row items-center' style={{ gap: 4 }}>
              <MaterialIcons name='wallet' size={24} color='pink' />
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
        </View>

        <View className='p-3 mb-2 bg-white'>
          <View className='flex-row items-center' style={{ gap: 4 }}>
            <View className='w-5'>
              <FontAwesome6 name='money-bill-1' size={16} color={P_PINK} />
            </View>
            <Text className='uppercase font-bold text-[18px]'>
              Phương thức thanh toán
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => setPaymentMethod('cash')}
              style={{ gap: 8 }}
              className='flex-row border border-gray-300 rounded-xl p-2 items-center mt-2'
            >
              {paymentMethod === 'cash' ? (
                <AntDesign name='checkcircle' size={20} color={P_PINK} />
              ) : (
                <FontAwesome6 name='circle' size={20} color={P_PINK} />
              )}
              <Text className='text-[16px]'>
                Thanh toán tiền mặt khi nhận hàng
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-row border border-gray-300 rounded-xl p-2 items-center mt-2'
              onPress={() => setPaymentMethod('card')}
              style={{ gap: 8 }}
            >
              {paymentMethod === 'card' ? (
                <AntDesign name='checkcircle' size={20} color={P_PINK} />
              ) : (
                <FontAwesome6 name='circle' size={20} color={P_PINK} />
              )}
              <Text className='text-[16px]'>Thanh toán chuyển khoản</Text>
            </TouchableOpacity>
          </View>
        </View>

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
            <View className='p-2 mb-2 shadow-lg w-full bg-pink-100 rounded-lg'>
              <View className='flex-row justify-between items-center'>
                <Text className='text-left font-bold mb-2 mr-1 text-lg'>
                  Chọn địa chỉ
                </Text>

                <Pressable onPress={() => setModalVisible(!modalVisible)}>
                  <AntDesign name='close' size={24} color='black' />
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {address.map((item, index) => (
                  <Pressable
                    key={index}
                    className='w-36 h-36 p-3 border rounded-lg mr-1 bg-white'
                    onPress={() => handleSelectAddress(item)}
                  >
                    <View className='flex-row items-center justify-between'>
                      <Text className='font-bold pr-1'>
                        {item.address?.address_recipient_name}
                      </Text>
                      <FontAwesome
                        name={
                          selectedAddress === item ? 'check-circle' : 'circle-o'
                        }
                        size={20}
                        color={selectedAddress === item ? '#fb77c5' : 'black'}
                      />
                    </View>
                    <Text className='mt-1'>
                      {item.address?.address_recipient_phonenumber}
                    </Text>
                    <Text className='mt-1'>{item.address?.address_full}</Text>
                  </Pressable>
                ))}
                <Pressable
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
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <View
        className='p-3 bg-white flex-row border-t border-gray-300 justify-end'
        style={{ gap: 8 }}
      >
        <View>
          <View className='flex-row justify-between items-center my-2'>
            <Text>Tổng thanh toán: </Text>
            <Text className='text-primary-pink font-bold text-[16px]'>
              {totalAmount.toLocaleString()}đ
            </Text>
          </View>
          {cartAmount > totalAmount && (
            <View className='flex-row justify-between items-center mb-2'>
              <Text className='text-primary-pink'>
                Quý khách tiết kiệm được{' '}
                {(cartAmount - totalAmount).toLocaleString()}
                đ
                <Image className='w-5 h-5' source={tulip} />
              </Text>
              <Text className=' line-through'>
                {cartAmount.toLocaleString()}đ
              </Text>
            </View>
          )}
        </View>

        <View className='w-[120px] h-[40px]'>
          <RectangleButton
            onPress={handlePlaceOrder}
            disabled={orderLoading}
            loading={orderLoading}
            title='Đặt hàng'
            className=''
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

interface IProp {
  item: any;
  dispatch: (action: any) => void;
}

const RenderItemToCart = ({ item, dispatch }: IProp) => {
  const width = Dimensions.get('window').width;
  const handleProduct = () => {
    dispatch(removeFromCart(item?.id));
  };
  const P_PINK = '#fb77c5';

  return (
    <View
      style={{ gap: 8 }}
      className='flex-row border-b border-gray-400 items-center py-2'
    >
      <View style={{ width: width / 2 }}>
        <Image
          className=' w-full rounded-lg'
          style={{ width: width / 2, height: width / 2.5 }}
          source={{ uri: item?.productImg }}
        />
      </View>
      <View style={{ width: width / 2, overflow: 'hidden' }}>
        <View className='border-b-2 border-gray-300'>
          <Text className='font-semibold text-[18px]' numberOfLines={3}>
            {item?.title}
          </Text>
        </View>
        <Text className='mb-2 mt-4 text-[16px]'>
          Số lượng: <Text className='font-bold'>{item?.quantity}</Text> x{' '}
          {item?.price?.toLocaleString()}đ
        </Text>
        <Text className='font-bold text-[16px] mb-2'>
          = {(item?.quantity * item?.price)?.toLocaleString()}đ
        </Text>
        <TouchableOpacity
          onPress={handleProduct}
          className='flex-row items-center'
          style={{ gap: 4 }}
        >
          <FontAwesome name='trash' size={20} color={P_PINK} />
          <Text className='text-primary-pink text-[16px]'>Xoá sản phẩm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;
