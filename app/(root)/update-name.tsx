import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Text, View } from 'react-native';
import axios from 'axios';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import getNewToken from '@/utils/getNewToken';

const url = `${process.env.EXPO_PUBLIC_API}/user`;

const UpdateName = () => {
  const { token, user_fullname } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const config = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const handleUpdateName = async () => {
    try {
      setLoading(true);
      const data = {
        user_fullname: name,
      };
      const res = await axios.put(url, data, config);
      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Cập nhật tên thành công' });
        router.back();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        getNewToken();
      } else {
        // console.error('Thay đổi tên không thành công: ', error);
        Toast.show({ type: 'error', text1: 'Đổi tên không thành công' });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView edges={['top']} className='bg-primary-pink flex-1'>
      <ScreenHeader text='Cập nhật tên' />
      <View className='flex-1 bg-gray-100'>
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
      </View>
    </SafeAreaView>
  );
};

export default UpdateName;
