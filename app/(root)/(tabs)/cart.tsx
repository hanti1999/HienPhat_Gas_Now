import { Text, View, SafeAreaView, ScrollView, Switch } from 'react-native';
import { Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { Image, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import axios from 'axios';
import { removeFromCart, clearCart } from '@/redux/slices/cartSlice';
import { MaterialIcons, Fontisto } from '@expo/vector-icons';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import tulip from '@/assets/images/tulip.png';
import { RootState } from '@/redux/store';
import LoadingScreen from '../loading-screen';
import NoProduct from '../no-product';

const cart = () => {
  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity
  );
  const cartAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<number>(cartAmount);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [orderLoading, setOrderLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [usePoint, setUsePoint] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  let cartPoints = Math.round((totalAmount * 0.8) / 100);
  let voucher = 0;
  const P_PINK = '#fb77c5';

  const fetchUser = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API}/user`;
      const config = {
        headers: {
          Authorization: ` Bearer ${token}`,
        },
      };
      const res = await axios.get(url, config);
      if (res.status === 200) {
        const data = res.data;
        setAddress(data?.address?.address_full);
        setName(data?.user?.user_fullname);
        setPhoneNumber(data?.account?.account_phonenumber);
        // setUserPoints(data?.points);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error('Lỗi (catch CartScreen): ', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    setTotalAmount(cartAmount);
  }, [cartAmount]);

  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    if (phoneNumber === '') {
      Alert.alert('Thông báo', 'Vui lòng điền số điện thoại!');
      setIsVisible(true);
      setOrderLoading(false);
      return;
    }
    try {
      const data = {
        userId: token,
        name: name,
        phoneNumber: phoneNumber,
        note: note,
        cartItems: cartItems,
        totalPrice: totalAmount,
        shippingAddress: address,
        paymentMethod: paymentMethod,
        cartPoints: cartPoints,
        usePoint: usePoint,
        usedPoints: usePoint === true ? userPoints : 0,
      };
      const url = `${process.env.EXPO_PUBLIC_API}/my-url`;
      const res = await axios.post(url, data);
      if (res.status === 200) {
        dispatch(clearCart());
      } else {
        console.log('Tạo đơn hàng không thành công');
      }
    } catch (error) {
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
      <ScreenHeader text={'Giỏ hàng'} />
      <ScrollView
        className='bg-gray-100'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='bg-pink-100 p-3 mb-2'>
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
            <Text className='text-primary-pink font-semibold text-[20px]'>
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

            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
              <View className='flex-row items-center' style={{ gap: 4 }}>
                <Text style={{ color: 'blue', fontSize: 16 }}>
                  Sửa thông tin
                </Text>
                <FontAwesome6 name='pencil' size={16} color='blue' />
              </View>
            </TouchableOpacity>
          </View>
          {isVisible ? (
            <View>
              <View className='flex-row items-center' style={{ gap: 8 }}>
                <Text className='w-[60px]'>Tên:</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder='Nhập tên...'
                  className='p-2 border-b border-gray-300 flex-1'
                />
              </View>
              <View className='flex-row items-center' style={{ gap: 8 }}>
                <Text className='w-[60px]'>SĐT:</Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType='numeric'
                  placeholder='Nhập số điện thoại...'
                  className='p-2 border-b border-gray-300 flex-1'
                />
              </View>
              <View className='flex-row items-center' style={{ gap: 8 }}>
                <Text className='w-[60px]'>Địa chỉ:</Text>
                <TextInput
                  value={address}
                  multiline
                  onChangeText={setAddress}
                  placeholder='Nhập địa chỉ...'
                  className='p-2 border-b border-gray-300 flex-1'
                />
              </View>
            </View>
          ) : (
            <View className='mt-2'>
              <Text>{name}</Text>
              <Text>{phoneNumber}</Text>
              <Text>{address}</Text>
            </View>
          )}

          <View className='flex-row items-center' style={{ gap: 8 }}>
            <Text className='w-[60px]'>Ghi chú:</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              multiline
              placeholder='(Không bắt buộc)'
              className='p-2 border-b border-gray-300 flex-1'
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
              onPress={() => setPaymentMethod('card')}
              style={{ gap: 8 }}
              className='flex-row border border-gray-300 rounded-xl p-2 items-center mt-2'
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
      </ScrollView>

      <View className='mt-2 p-3 bg-white'>
        <View className='flex-row justify-between items-center my-2'>
          <Text className='text-[18px]'>Tổng thanh toán: </Text>
          <Text className='text-primary-pink font-bold text-[20px]'>
            {totalAmount.toLocaleString()}đ
          </Text>
        </View>
        {cartAmount > totalAmount ? (
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
        ) : (
          <></>
        )}

        <View className='flex-row justify-between bg-white' style={{ gap: 12 }}>
          <RectangleButton
            onPress={() => router.push('/(root)/(tabs)/home')}
            title='Tiếp tục mua sắm'
            textVariant='primary'
            bgVariant='outline'
          />
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
      className='flex-row border-b bg-pink-100 border-gray-400 items-center py-2'
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
          <Fontisto name='trash' size={20} color={P_PINK} />
          <Text className='text-primary-pink text-[16px]'>Xoá sản phẩm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default cart;
