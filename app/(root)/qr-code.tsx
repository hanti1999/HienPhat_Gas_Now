import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';

const QrCode = () => {
  const { phonenumber, name } = useLocalSearchParams();
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar style='dark' />
      <ScreenHeader text='Mã QR của bạn' bg='white' textColor='black' />
      <View className='flex-1 items-center p-3'>
        <Text className='text-[16px] text-center'>
          Xin chào! <Text className='font-semibold text-lg'>{name}</Text>
          {'\n'}
          {'\n'}
          {phonenumber}
          {'\n'}
          {'\n'}
          Đưa mã này cho nhân viên để được tích điểm khi mua hàng trực tiếp!
          {'\n'}
        </Text>
        <QRCode value={phonenumber as string} size={260} />
      </View>
    </SafeAreaView>
  );
};

export default QrCode;
