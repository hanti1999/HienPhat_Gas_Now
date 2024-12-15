import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { SafeAreaView, Keyboard, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';

const UpdateName = () => {
  const { token, user_fullname } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  const handleUpdateName = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/user`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const data = {
        user_fullname: name,
      };
      const res = await axios.put(url, data, config);

      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Cập nhật tên thành công' });
        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Cập nhật tên không thành công',
        });
        console.error(res.data?.message);
      }
    } catch (error) {
      console.error('Thay đổi tên không thành công: ', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]}>
        <ScreenHeader text='Cập nhật tên' />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className='p-3 bg-white'>
            <Text className='font-semibold'>Tên hiện tại</Text>
            <Text className='my-3'>{user_fullname}</Text>
            <RectangleInput
              placeholder='Nhập tên mới...'
              onChangeText={setName}
              label='Tên mới'
              value={name}
            />
            <CustomButton
              onPress={handleUpdateName}
              disabled={loading}
              loading={loading}
              className='mt-3'
              title='Lưu'
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateName;
