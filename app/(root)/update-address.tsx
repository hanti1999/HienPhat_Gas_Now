import { Text, Switch, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { View, ScrollView, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useState } from 'react';
import axios from 'axios';
import { District, IAddress, Province, Ward } from '@/types/type';
import GetLocationButton from '@/components/GetLocationButton';
import RectangleButton from '@/components/RectangleButton';
import RectangleInput from '@/components/RectangleInput';
import ScreenHeader from '@/components/ScreenHeader';
import CustomButton from '@/components/CustomButton';
import handleGetLocation from '@/utils/getLocation';
import { AntDesign } from '@expo/vector-icons';
import getNewToken from '@/utils/getNewToken';

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
  const [delLoading, setDelLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const toggleSwitch = () => {
    setData((prevState) => ({
      ...prevState,
      is_default: !data.is_default,
    }));
  };

  const fetchProvinces = async () => {
    const res = await axios.get(`${process.env.EXPO_PUBLIC_PROVINCE_API}/p/`);
    setProvinces(res.data);
  };

  const fetchDistrict = async (provinceCode: number, name: string) => {
    const url = `${process.env.EXPO_PUBLIC_PROVINCE_API}/p/${provinceCode}?depth=2`;
    const res = await axios.get(url);
    setProvinces([]);
    setSelectedProvince(name);
    setDistricts(res.data?.districts);
  };

  const fetchWard = async (districtCode: number, name: string) => {
    const url = `${process.env.EXPO_PUBLIC_PROVINCE_API}/d/${districtCode}?depth=2`;
    const res = await axios.get(url);
    setDistricts([]);
    setSelectedDistrict(name);
    setWards(res.data?.wards);
  };

  const onCompleteSelectAddress = (name: string) => {
    setModalVisible(!modalVisible);
    setWards([]);
    setData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        address_full: `${name}, ${selectedDistrict}, ${selectedProvince}`,
      },
    }));
  };

  const onCloseModal = () => {
    setModalVisible(!modalVisible);
    setDistricts([]);
    setProvinces([]);
    setWards([]);
  };

  const handleUpdateAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping/${id}`;
      const res = await axios.put(url, data, config);

      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Cập nhật địa chỉ thành công' });
        router.back();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        getNewToken();
      } else {
        // console.error('Cập nhật địa chỉ không thành công: ', error);
        Toast.show({ type: 'error', text1: 'Cập nhật không thành công' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelAddress = async () => {
    try {
      setLoading(true);
      const url = `${process.env.EXPO_PUBLIC_API}/shipping/${id}`;
      const res = await axios.delete(url, config);

      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Xóa thành công' });
        router.back();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        getNewToken();
      } else {
        Toast.show({ type: 'error', text1: 'Xóa không thành công' });
        // console.error('Xóa địa chỉ không thành công: ', error);
      }
    } finally {
      setDelLoading(false);
    }
  };

  const handleGetLocationPress = async () => {
    try {
      const res = await handleGetLocation();
      setData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          address_full: res,
        },
      }));
    } catch (error) {
      // console.error('Lỗi lấy vị trí:', error);
      Toast.show({ type: 'error', text1: 'Không thể lấy vị trí' });
    }
  };

  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <ScreenHeader text='Chỉnh sửa địa chỉ' />
        <ScrollView className='bg-gray-100'>
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
              multiline
              onFocus={() => {
                setModalVisible(!modalVisible);
                fetchProvinces();
              }}
              onChangeText={(text) =>
                setData((prevState) => ({
                  ...prevState,
                  address: {
                    ...prevState.address,
                    address_full: text,
                  },
                }))
              }
              children={<GetLocationButton onPress={handleGetLocationPress} />}
            />
            <Modal
              animationType='fade'
              visible={modalVisible}
              transparent={true}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View
                style={{ backgroundColor: 'rgba( 0, 0, 0, 0.3)' }}
                className='flex-1 items-center justify-end'
              >
                <View
                  className='bg-white rounded-lg w-full p-2 h-[80%]'
                  style={{ paddingBottom: Platform.OS == 'ios' ? 14 : 0 }}
                >
                  <View className='flex-row justify-between mb-2 items-center'>
                    <Text className='text-left font-bold text-[18px]'>
                      Chọn địa chỉ
                    </Text>
                    <TouchableOpacity onPress={onCloseModal}>
                      <AntDesign name='close' size={26} color='black' />
                    </TouchableOpacity>
                  </View>
                  <ScrollView showsHorizontalScrollIndicator={false}>
                    {provinces.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => fetchDistrict(item?.code, item?.name)}
                        className='border-b border-gray-200 p-3'
                        key={index}
                      >
                        <Text>{item?.name}</Text>
                      </TouchableOpacity>
                    ))}
                    {districts?.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => fetchWard(item?.code, item?.name)}
                        className='border-b border-gray-200 p-3'
                        key={index}
                      >
                        <Text>{item?.name}</Text>
                      </TouchableOpacity>
                    ))}
                    {wards?.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          onCompleteSelectAddress(item?.name);
                        }}
                        className='border-b border-gray-200 p-3'
                        key={index}
                      >
                        <Text>{item?.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>
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
          <View className='p-3 flex-row items-center justify-between border-y bg-white border-gray-200'>
            <Text>Đặt làm địa chỉ mặc định</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#fb77c5' }}
              onValueChange={toggleSwitch}
              value={data.is_default}
            />
          </View>
          <View className='bg-white p-3'>
            <RectangleButton
              onPress={handleDelAddress}
              bgVariant='danger'
              textVariant='danger'
              title='Xóa địa chỉ'
              loading={delLoading}
              disabled={delLoading}
            />
          </View>
          <View className='bg-white p-3'>
            <CustomButton
              onPress={handleUpdateAddress}
              disabled={loading}
              loading={loading}
              title='Sửa'
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateAddress;
