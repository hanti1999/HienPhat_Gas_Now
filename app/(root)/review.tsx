import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import ScreenHeader from '@/components/ScreenHeader';
import { FontAwesome } from '@expo/vector-icons';

const Review = () => {
  const { productId, token } = useLocalSearchParams();
  const [defaultOverallRating, setDefaultOverallRating] = useState<number>(5);
  const [defaultProductRating, setDefaultProductRating] = useState<number>(5);
  const [defaultServiceRating, setDefaultServiceRating] = useState<number>(5);
  const [overallRating, setOverallRating] = useState<number[]>([1, 2, 3, 4, 5]);
  const [productRating, setProductRating] = useState<number[]>([1, 2, 3, 4, 5]);
  const [serviceRating, setServiceRating] = useState<number[]>([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  const handleSendReview = async () => {
    try {
      setLoading(true);
      const data = {
        comment: comment,
        rating: defaultOverallRating,
        productRating: defaultProductRating,
        serviceRating: defaultServiceRating,
      };
      // need replace
      const url = `${process.env.EXPO_PUBLIC_API}`;
      const res = await axios.post(url, data);
      if (res.status === 200) {
        Toast.show({ text1: 'Gửi đánh giá thành công' });
        router.back();
      } else {
        console.error('Gửi đánh giá không thành công');
        Toast.show({ type: 'error', text1: 'Gửi đánh giá không thành công' });
      }
    } catch (error) {
      console.log('Gửi đánh giá không thành công', error);
      Toast.show({ type: 'error', text1: 'Gửi đánh giá không thành công' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='bg-white flex-1'>
      <ScreenHeader text={'Trở lại'} />
      <View className='py-2 px-3'>
        <View className='my-4 flex-row'>
          <View className='w-1/2'>
            <Text className='text-[16px]'>Tổng quan</Text>
          </View>
          <View className='w-1/2 flex-row justify-between'>
            {overallRating.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() => setDefaultOverallRating(item)}
              >
                {item <= defaultOverallRating ? (
                  <FontAwesome name='star' size={26} color='#faa935' />
                ) : (
                  <FontAwesome name='star-o' size={26} color='black' />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className='my-4 flex-row justify-between'>
          <View className='w-1/2'>
            <Text className='text-[16px]'>Sản phẩm</Text>
          </View>
          <View className='w-1/2 flex-row justify-between'>
            {productRating.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() => setDefaultProductRating(item)}
              >
                {item <= defaultProductRating ? (
                  <FontAwesome name='star' size={26} color='#faa935' />
                ) : (
                  <FontAwesome name='star-o' size={26} color='black' />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className='my-4 flex-row justify-between'>
          <View className='w-1/2'>
            <Text className='text-[16px]'>Dịch vụ</Text>
          </View>
          <View className='w-1/2 flex-row justify-between'>
            {serviceRating.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() => setDefaultServiceRating(item)}
              >
                {item <= defaultServiceRating ? (
                  <FontAwesome name='star' size={26} color='#faa935' />
                ) : (
                  <FontAwesome name='star-o' size={26} color='black' />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          className='bg-white rounded-lg p-2 border border-gray-300 mt-2 min-h-[70px]'
          placeholder='Chia sẻ trải nghiệm của bạn'
          onChangeText={setComment}
          value={comment}
          multiline
        />
        <TouchableOpacity
          className='h-[42px] mt-6 rounded-full bg-blue-500 flex justify-center items-center'
          onPress={handleSendReview}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={'white'} />
          ) : (
            <Text className='text-white text-center font-medium'>
              Gửi đánh giá
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Review;
