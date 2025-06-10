import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Keyboard, View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import RectangleButton from '@/components/RectangleButton';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import { FontAwesome } from '@expo/vector-icons';
import getNewToken from '@/utils/getNewToken';

const Review = () => {
  const { product_id, order_id, token } = useLocalSearchParams();
  const productArr = (product_id as string).split(',');

  return (
    <SafeAreaView edges={['top']} className='bg-primary-pink flex-1'>
      <FlatList
        data={productArr}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Form
            product_id={item}
            order_id={order_id as string}
            token={token as string}
          />
        )}
        ListHeaderComponent={<ScreenHeader text='Trở lại' />}
      />
    </SafeAreaView>
  );
};

interface IProps {
  product_id: string;
  order_id: string;
  token: string;
}

const Form = ({ product_id, order_id, token }: IProps) => {
  const [defaultOverallRating, setDefaultOverallRating] = useState<number>(5);
  const [defaultProductRating, setDefaultProductRating] = useState<number>(5);
  const [defaultServiceRating, setDefaultServiceRating] = useState<number>(5);
  const [overallRating, setOverallRating] = useState<number[]>([1, 2, 3, 4, 5]);
  const [productRating, setProductRating] = useState<number[]>([1, 2, 3, 4, 5]);
  const [serviceRating, setServiceRating] = useState<number[]>([1, 2, 3, 4, 5]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  const handleSendReview = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/review`;
      const data = {
        review_comment: comment,
        review_rating: defaultOverallRating,
        review_productrating: defaultProductRating,
        review_servicerating: defaultServiceRating,
        product_id: product_id,
        order_id: order_id,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(url, data, config);
      if (res.status === 201) {
        Toast.show({ text1: 'Gửi đánh giá thành công' });
        setDisabled(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await getNewToken();
      } else {
        console.log('Gửi đánh giá không thành công', error);
        Toast.show({ type: 'error', text1: 'Gửi đánh giá không thành công' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='p-3 flex-1 bg-white'>
        <View className='mb-2 flex-row'>
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
                  <FontAwesome name='star-o' size={26} color='#faa935' />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className='mb-2 flex-row justify-between'>
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
                  <FontAwesome name='star-o' size={26} color='#faa935' />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className='mb-2 flex-row justify-between'>
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
                  <FontAwesome name='star-o' size={26} color='#faa935' />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <RectangleInput
          placeholder='Chia sẻ trải nghiệm của bạn'
          placeholderTextColor={'#999'}
          onChangeText={setComment}
          value={comment}
          multiline
        />
        <View className='flex-row mt-2'>
          <RectangleButton
            loading={loading}
            disabled={loading || disabled}
            title='Gửi đánh giá (Nhận 10.000 điểm)'
            onPress={handleSendReview}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Review;
