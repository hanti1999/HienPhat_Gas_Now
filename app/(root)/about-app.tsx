import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import ScreenHeader from '@/components/ScreenHeader';

const AboutApp = () => {
  const { version } = useLocalSearchParams();
  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <ScreenHeader text='Thông tin ứng dụng' />
      <View className='p-3 bg-white flex-1'>
        <Text className='text-[18px]'>Phiên bản: {version}</Text>
        <Text className='mt-4 text-[16px]'>
          Thiết kế và phát triển bởi:{'\n'}
          <Text className='text-primary-pink'>Tú Nhi (Manager | Tester)</Text>
          {'\n'}
          <Link href={'https://github.com/hanti1999'}>
            <Text className='text-blue-400 underline'>
              Hoàng Anh (Front-end | Media)
            </Text>
          </Link>
          {'\n'}
          <Link href={'https://github.com/vtit6109'}>
            <Text className='text-blue-400 underline'>Vũ Thắng (Back-end)</Text>
          </Link>
        </Text>
        <Text className='mt-4 text-[16px]'>
          Assets:{'\n'}
          Hình ảnh:{' '}
          <Link
            className='text-blue-400 underline'
            href={'https://www.freepik.com/'}
          >
            Freepik
          </Link>
          {', '}
          <Link
            className='text-blue-400 underline'
            href={'https://www.flaticon.com/'}
          >
            Flaticon
          </Link>
          {'\n'}
          Icons:{' '}
          <Link
            className='text-blue-400 underline'
            href={'https://icons.expo.fyi/Index'}
          >
            @expo/vector-icons
          </Link>
          {'\n'}
          Danh sách tỉnh thành:{' '}
          <Link
            className='text-blue-400 underline'
            href={'https://provinces.open-api.vn/'}
          >
            Province Open API
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AboutApp;
