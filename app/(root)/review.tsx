import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Keyboard, View, Text, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import RectangleButton from '@/components/RectangleButton';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import { FontAwesome } from '@expo/vector-icons';
import getNewToken from '@/utils/getNewToken';

const RATING_OPTIONS = [1, 2, 3, 4, 5];

interface StarRatingInputProps {
  label: string;
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

const StarRatingInput = React.memo(
  ({ label, rating, onRatingChange, disabled }: StarRatingInputProps) => {
    return (
      <View className='mb-2 flex-row items-center'>
        <View className='w-1/2'>
          <Text className='text-[16px]'>{label}</Text>
        </View>
        <View className='w-1/2 flex-row justify-between'>
          {RATING_OPTIONS.map((value) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={value}
              disabled={disabled}
              onPress={() => onRatingChange(value)}
            >
              {value <= rating ? (
                <FontAwesome name='star' size={26} color='#faa935' />
              ) : (
                <FontAwesome name='star-o' size={26} color='#faa935' />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
);

const Review = () => {
  const { product_id, order_id, token } = useLocalSearchParams();
  const productArr = (product_id as string).split(',');

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <Form
        product_id={item}
        order_id={order_id as string}
        token={token as string}
      />
    ),
    [order_id, token]
  );

  return (
    <SafeAreaView edges={['top']} className='bg-primary-pink flex-1'>
      <FlatList
        data={productArr}
        keyExtractor={(item) => item}
        renderItem={renderItem}
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

const Form = React.memo(({ product_id, order_id, token }: IProps) => {
  const [ratings, setRatings] = useState({
    overall: 5,
    product: 5,
    service: 5,
  });
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  const handleRatingChange = (type: keyof typeof ratings, value: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [type]: value,
    }));
  };

  const handleSendReview = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/review`;
      const data = {
        review_comment: comment,
        review_rating: ratings.overall,
        review_productrating: ratings.product,
        review_servicerating: ratings.service,
        product_id: product_id,
        order_id: order_id,
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(url, data, config);
      if (res.status === 201) {
        Toast.show({ text1: 'Gửi đánh giá thành công' });
        setDisabled(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        getNewToken();
      } else {
        Toast.show({ type: 'error', text1: 'Gửi đánh giá không thành công' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className='p-3 flex-1 bg-white mb-2'>
        <StarRatingInput
          label='Tổng quan'
          rating={ratings.overall}
          onRatingChange={(value) => handleRatingChange('overall', value)}
          disabled={disabled}
        />
        <StarRatingInput
          label='Sản phẩm'
          rating={ratings.product}
          onRatingChange={(value) => handleRatingChange('product', value)}
          disabled={disabled}
        />
        <StarRatingInput
          label='Dịch vụ'
          rating={ratings.service}
          onRatingChange={(value) => handleRatingChange('service', value)}
          disabled={disabled}
        />

        <RectangleInput
          placeholder='Chia sẻ trải nghiệm của bạn'
          // ...
          onChangeText={setComment}
          value={comment}
          multiline
          editable={!disabled}
        />
        <View className='flex-row mt-2'>
          <RectangleButton
            loading={loading}
            disabled={loading || disabled}
            title={
              disabled ? 'Đã gửi đánh giá' : 'Gửi đánh giá (Nhận 10.000 điểm)'
            }
            onPress={handleSendReview}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default Review;
