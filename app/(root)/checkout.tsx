import { SafeAreaView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import WebView from 'react-native-webview';
import Constants from 'expo-constants';
import CustomButton from '@/components/CustomButton';
import img from '@/assets/images/delivery.png';

// Logic:
// => Nếu người dùng chọn "Chuyển khoản"
// => Tạo đơn hàng trên server ở trạng thái "chờ thanh toán"
// => fetch api (vietqr) để tạo link thanh toán QR theo thông tin đơn hàng (số tiền, nội dung)
// => Chuyển hướng đến trang checkout và in link thanh toán đó lên màn hình theo dạng webview
// => quét mã thanh toán thành công sẽ fetch api cập nhật trạng thái đơn hàng thành đã thanh toán

const Checkout = () => {
  const { token, paymentMethod } = useLocalSearchParams();
  const [countdown, setCountdown] = useState<number>(5);
  const [url, setUrl] = useState<string>(
    'https://img.vietqr.io/image/vietinbank-113366668888-compact2.jpg?amount=790000&addInfo=dong%20gop%20quy%20vac%20xin&accountName=Quy%20Vac%20Xin%20Covid'
  );

  useEffect(() => {
    if (paymentMethod === 'cod') {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => {
        router.replace('/(root)/(tabs)/home');
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      return;
    }
  }, []);

  if (paymentMethod === 'cod') {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 items-center justify-center p-3'>
          <Image source={img} style={{ maxWidth: 400, maxHeight: 400 }} />
          <Text className='text-lg mt-2'>
            Cảm ơn bạn đã tin tưởng và ủng hộ!
          </Text>
          <Text className='text-lg'>Đơn hàng của bạn đang được xử lý</Text>
          <CustomButton
            title='Trở về trang chủ'
            className='mt-5'
            onPress={() => router.replace('/(root)/(tabs)/home')}
          />
          <Text className='mt-2 text-base text-gray-500'>
            Bạn sẽ được tự động chuyển đến trang chủ sau {countdown} giây
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-400'>
      <View
        className='flex-1 rounded-tl-xl rounded-tr-xl overflow-hidden'
        style={{ marginTop: Constants.statusBarHeight }}
      >
        <View className='bg-gray-200 flex-row justify-between items-center p-3'>
          <Text className='text-[18px] font-semibold'>
            Quét mã QR để thanh toán
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(root)/(tabs)/home')}
          >
            <Text className='text-blue-500 text-[18px] underline'>Bỏ qua</Text>
          </TouchableOpacity>
        </View>
        <WebView source={{ uri: url }} style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
};

export default Checkout;
