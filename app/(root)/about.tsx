import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import ScreenHeader from '@/components/ScreenHeader';
import logo from '@/assets/images/logoHp.png';

const About = () => {
  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <ScreenHeader text={'Thông tin công ty'} />
      <View className='px-3 py-2 bg-white flex-1'>
        <Image className='w-24 h-24' source={logo} />
        <Text className='text-[16px]'>
          CÔNG TY TNHH HIỀN PHÁT VI NA
          {'\n'}
          Trụ sở: Quốc lộ 51, Ấp 7, Xã An Phước, Huyện Long Thành, Đồng Nai
          {'\n'}
          Giấy chứng nhận đăng ký doanh nghiệp số: 3603240938 do Sở Kế Hoạch và
          Đầu Tư tỉnh Đồng Nai cấp lần đầu ngày 30/12/2014
        </Text>
        <Text className='mt-2 text-[16px]'>
          Thông tin liên hệ:
          {'\n'}
          Email: gashienphat1979@gmail.com
          {'\n'}
          Điện thoại/Zalo:{' '}
          <Link className='underline text-blue-500' href={'tel:0975841582'}>
            0975 841 582
          </Link>
          (Lộc)
          {'\n'}
          Điện thoại/Zalo:{' '}
          <Link className='underline text-blue-500' href={'tel:0986573072'}>
            0986 573 072
          </Link>
          (Nhựt)
          {'\n'}
          Điện thoại bàn:{' '}
          <Link className='underline text-blue-500' href={'tel:02513511610'}>
            02513 511 610
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default About;
