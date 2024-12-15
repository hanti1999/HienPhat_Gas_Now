import { View, ScrollView, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Text, Switch } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import { IAddress } from '@/types/type';
import RectangleButton from '@/components/RectangleButton';

const UpdateAddress = () => {
  const { token, id, address, home, note, name, phonenumber, is_default } =
    useLocalSearchParams();
  const [data, setData] = useState<IAddress>({
    address: {
      address_full: address as string,
      address_recipient_name: name as string,
      address_recipient_phonenumber: phonenumber as string,
      address_home: home as string,
      address_note: note as string,
    },
    is_default: JSON.parse(is_default as string),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [delLoading, setDelLoading] = useState<boolean>(false);

  const toggleSwitch = () => {
    setData((prevState) => ({
      ...prevState,
      is_default: !data.is_default,
    }));
  };

  const handleUpdateAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping/${id}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(url, data, config);

      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Cập nhật địa chỉ thành công' });
        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message,
        });
        console.error(res.data?.message);
      }
    } catch (error) {
      console.error('Cập nhật địa chỉ không thành công: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping/${id}`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.delete(url, config);

      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Xóa thành công' });
        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message,
        });
        console.error(res.data?.message);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Xóa không thành công' });
      console.error('Xóa địa chỉ không thành công: ', error);
    } finally {
      setDelLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView stickyHeaderIndices={[0]}>
        <ScreenHeader text='Chỉnh sửa địa chỉ' />
        <View className='p-3 bg-white'>
          <RectangleInput
            label='Tên người nhận'
            value={data.address?.address_recipient_name}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_recipient_name: text,
                },
              }))
            }
          />
          <RectangleInput
            label='Số điện thoại'
            keyboardType='numeric'
            value={data.address?.address_recipient_phonenumber}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_recipient_phonenumber: text,
                },
              }))
            }
          />
          <RectangleInput
            label='Địa chỉ'
            value={data.address?.address_full}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_full: text,
                },
              }))
            }
          />
          <RectangleInput
            label='Số nhà (không bắt buộc)'
            value={data.address?.address_home}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_home: text,
                },
              }))
            }
          />
          <RectangleInput
            label='Ghi chú (không bắt buộc)'
            value={data.address?.address_note}
            onChangeText={(text) =>
              setData((prevState) => ({
                ...prevState,
                address: {
                  ...prevState.address,
                  address_note: text,
                },
              }))
            }
          />
        </View>
        <View className='p-3 flex-row items-center justify-between border-y border-gray-200'>
          <Text>Đặt làm địa chỉ mặc định</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#fb77c5' }}
            onValueChange={toggleSwitch}
            value={data.is_default}
          />
        </View>
        <View className='m-3'>
          <RectangleButton
            onPress={handleDelAddress}
            bgVariant='danger'
            textVariant='danger'
            title='Xóa địa chỉ'
            loading={delLoading}
            disabled={delLoading}
          />
        </View>
        <View className='m-3'>
          <CustomButton
            onPress={handleUpdateAddress}
            disabled={loading}
            loading={loading}
            title='Sửa'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateAddress;
