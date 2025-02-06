import { Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Swiper from 'react-native-swiper';
import { useRef, useState } from 'react';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { onboarding } from '@/constants';

const Onboarding = () => {
  // const swiperRef = useRef<Swiper>(null);
  // const [activeIndex, setActiveIndex] = useState<number>(0);
  // const isLastSlide = activeIndex === onboarding.length - 1;

  return null;
  // <SafeAreaView className='flex h-full items-center justify-between bg-white'>
  //   <TouchableOpacity
  //     onPress={() => router.replace('/(auth)/sign-up')}
  //     className='w-full flex justify-end items-end p-5'
  //   >
  //     <Text className='font-RobotoBold text-lg'>Bỏ qua</Text>
  //   </TouchableOpacity>
  //   <Swiper
  //     ref={swiperRef}
  //     loop={false}
  //     dot={<View className='w-8 h-1 mx-1 bg-gray-200 rounded-full' />}
  //     activeDot={
  //       <View className='w-8 h-1 mx-1 bg-primary-pink rounded-full' />
  //     }
  //     onIndexChanged={(index) => setActiveIndex(index)}
  //   >
  //     {onboarding.map((item) => (
  //       <View key={item.id} className='flex items-center justify-center p-5'>
  //         <Image
  //           source={item.image}
  //           className='w-full h-[300px]'
  //           resizeMode='contain'
  //         />
  //         <View className='flex flex-row items-center justify-center w-full mt-10'>
  //           <Text className='text-2xl font-RobotoBold mx-10 text-center'>
  //             {item.title}
  //           </Text>
  //         </View>
  //         <Text className='text-center text-lg text-primary-black font-Roboto mx-10 mt-3'>
  //           {item.description}
  //         </Text>
  //       </View>
  //     ))}
  //   </Swiper>
  //   <CustomButton
  //     title={isLastSlide ? 'Bắt đầu' : 'Tiếp tục'}
  //     onPress={() =>
  //       isLastSlide
  //         ? router.replace('/(auth)/sign-up')
  //         : swiperRef.current?.scrollBy(1)
  //     }
  //     className='w-11/12 mt-10 mb-5'
  //   />
  // </SafeAreaView>
};

export default Onboarding;
