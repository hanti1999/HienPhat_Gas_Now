import { Text, SafeAreaView } from 'react-native';
import { Image, View } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ScreenHeader';
import img from '@/assets/images/cart.png';
import CustomButton from '@/components/CustomButton';

const NoProduct = ({ text }: { text: string }) => {
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScreenHeader text={text} />
      <View className='flex items-center h-full bg-gray-100 px-3'>
        <Image style={{ maxWidth: 400, maxHeight: 400 }} source={img} />
        <Text className='text-[#ff725e] text-[12px]'>
          Image by storyset on Freepik
        </Text>
        <Text className='font-semibold text-[18px] my-10'>{text}</Text>
        <CustomButton
          title='Tiếp tục mua hàng'
          onPress={() => router.push('/(root)/(tabs)/home')}
        />
      </View>
    </SafeAreaView>
  );
};

export default NoProduct;
