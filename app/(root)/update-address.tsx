import { View, Text, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import axios from 'axios';
import RectangleButton from '@/components/RectangleButton';
import ScreenHeader from '@/components/ScreenHeader';
import Toast from 'react-native-toast-message';

const UpdateAddress = () => {
  const { token, address_full } = useLocalSearchParams();
  const [address, setAddress] = useState<string>(address_full as string);
  const [loading, setLoading] = useState<boolean>(false);
  const nav = useNavigation();

  const handleUpdateAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping/update-address`;
      const config = {
        headers: {
          Authorization: ` Bearer ${token}`,
        },
      };
      const data = {
        address: address,
      };
      const res = await axios.put(url, data, config);

      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Cập nhật địa chỉ thành công' });
        nav.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Cập nhật địa chỉ không thành công',
        });
        console.error(res.data?.message);
      }
    } catch (error) {
      console.error('Thay đổi địa chỉ không thành công: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]} className='bg-gray-100 flex-1'>
        <ScreenHeader text='Chỉnh sửa địa chỉ' showCart={false} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className='p-3 bg-white'>
            <TextInput
              className='p-3 border border-gray-300 rounded-lg'
              onChangeText={setAddress}
              value={address}
              multiline
            />
            <RectangleButton
              onPress={handleUpdateAddress}
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

export default UpdateAddress;
