import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, Switch, Text } from 'react-native';
import { View, SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import { IAddress } from '@/types/type';

const AddAddress = () => {
  const { token } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IAddress>({
    address: {
      address_full: '',
      address_recipient_name: '',
      address_recipient_phonenumber: '',
      address_home: '',
      address_note: '',
    },
    is_default: false,
  });

  const toggleSwitch = () => {
    setData((prevState) => ({
      ...prevState,
      is_default: !data.is_default,
    }));
  };

  const handleAddAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(url, data, config);
      if (res.status === 201) {
        Toast.show({ text1: 'Thêm địa chỉ thành công' });
        router.back();
      } else {
        Toast.show({ type: 'error', text1: res.data.message });
        console.log(res.data.message);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Lỗi khi thêm địa chỉ' });
      console.log('Lỗi thêm địa chỉ: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='bg-white flex-1'>
      <ScrollView stickyHeaderIndices={[0]}>
        <ScreenHeader text='Thêm địa chỉ' />
        <View className='p-3 bg-white'>
          <RectangleInput
            label='Tên người nhận'
            value={data.address.address_recipient_name}
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
            label='Số nhà'
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
            value={data?.is_default}
          />
        </View>
        <View className='m-3'>
          <CustomButton
            onPress={handleAddAddress}
            disabled={loading}
            loading={loading}
            title='Thêm'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddAddress;
