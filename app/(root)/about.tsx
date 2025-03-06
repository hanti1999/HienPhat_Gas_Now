import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image } from 'react-native';
import ScreenHeader from '@/components/ScreenHeader';
import logo from '@/assets/images/logoHp.png';

const About = () => {
  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <ScreenHeader text={'Thông tin công ty'} />
      <View className='px-3 py-2 bg-white flex-1'>
        <Image className='w-24 h-24' source={logo} />
        <Text>CÔNG TY TNHH HIỀN PHÁT VI NA</Text>
        <Text>
          Trụ sở: Quốc lộ 51, Ấp 7, Xã An Phước, Huyện Long Thành, Đồng Nai
        </Text>
        <Text>
          Giấy chứng nhận đăng ký doanh nghiệp số: 3603240938 do Sở Kế Hoạch và
          Đầu Tư tỉnh Đồng Nai cấp lần đầu ngày 30/12/2014
        </Text>
        <Text className='mt-2'>Thông tin liên hệ:</Text>
        <Text>Email: gashienphat1979@gmail.com</Text>
        <Text>Điện thoại/Zalo: 0975 841 582 (Lộc)</Text>
        <Text>Điện thoại/Zalo: 0986 573 072 (Nhựt)</Text>
        <Text>Điện thoại bàn: 02513 511 610</Text>
      </View>
    </SafeAreaView>
  );
};

export default About;
